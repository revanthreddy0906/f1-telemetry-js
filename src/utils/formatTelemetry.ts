import type {
  FormattedTelemetry,
  RawTelemetryInput,
  RawTelemetryPoint,
  TelemetryEvent,
  TelemetryExtraChannel
} from "../types/telemetry";
import { validateTelemetry, warnTelemetryIssues } from "./validation";
import { normalizeTelemetryTime } from "./timeSemantics";

const TIME_KEYS = ["time", "timestamp", "t", "elapsed", "elapsedTime"];
const SPEED_KEYS = ["speed", "velocity", "v"];
const THROTTLE_KEYS = ["throttle", "throttlePosition"];
const BRAKE_KEYS = ["brake", "brakePressure", "brakePosition"];
const X_KEYS = ["x", "posX", "positionX", "worldX"];
const Y_KEYS = ["y", "posY", "positionY", "worldY"];
const EVENT_TIME_KEYS = ["time", "timestamp", "t", "sessionTime"];
const EVENT_TYPE_KEYS = ["type", "eventType", "event", "kind"];
const EVENT_VALUE_KEYS = ["value", "eventValue", "delta", "severity"];

const EXTRA_CHANNEL_KEY_MAP: Record<TelemetryExtraChannel, string[]> = {
  gear: ["gear", "nGear", "n_gear"],
  ersDeployment: ["ersDeployment", "ers_deployment", "ers", "ersDeploy"],
  ersHarvest: ["ersHarvest", "ers_harvest", "ersRecovery"],
  batteryLevel: ["batteryLevel", "battery", "battery_level", "soc"],
  airTemp: ["airTemp", "air_temperature", "air_temperature_celsius"],
  trackTemp: ["trackTemp", "track_temperature", "track_temperature_celsius"],
  humidity: ["humidity", "relative_humidity"],
  windSpeed: ["windSpeed", "wind_speed"],
  rainfall: ["rainfall", "rain_intensity", "rain"],
  pressure: ["pressure", "air_pressure"]
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const pickNumber = (point: RawTelemetryPoint, keys: string[]): number | null => {
  for (const key of keys) {
    const value = toNumber(point[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
};

const pickArray = (input: Record<string, unknown>, keys: string[]): unknown[] | null => {
  for (const key of keys) {
    const candidate = input[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }
  return null;
};

const getPointsFromNestedArray = (input: Record<string, unknown>): RawTelemetryPoint[] | null => {
  const containerKeys = ["telemetry", "data", "samples", "points", "records", "lapData"];
  for (const key of containerKeys) {
    const candidate = input[key];
    if (Array.isArray(candidate)) {
      return candidate.filter((entry): entry is RawTelemetryPoint => typeof entry === "object" && entry !== null);
    }
  }
  return null;
};

const getPointsFromColumns = (input: Record<string, unknown>): RawTelemetryPoint[] => {
  const time = pickArray(input, TIME_KEYS) ?? [];
  const speed = pickArray(input, SPEED_KEYS) ?? [];
  const throttle = pickArray(input, THROTTLE_KEYS) ?? [];
  const brake = pickArray(input, BRAKE_KEYS) ?? [];
  const x = pickArray(input, X_KEYS) ?? [];
  const y = pickArray(input, Y_KEYS) ?? [];
  const extraArrays = Object.fromEntries(
    Object.entries(EXTRA_CHANNEL_KEY_MAP).map(([channel, keys]) => [channel, pickArray(input, keys) ?? []])
  ) as Record<TelemetryExtraChannel, unknown[]>;

  const length = Math.max(
    time.length,
    speed.length,
    throttle.length,
    brake.length,
    x.length,
    y.length,
    ...Object.values(extraArrays).map((series) => series.length)
  );
  return Array.from({ length }, (_, index) => {
    const row: RawTelemetryPoint = {
      time: time[index] ?? index,
      speed: speed[index] ?? 0,
      throttle: throttle[index] ?? 0,
      brake: brake[index] ?? 0,
      x: x[index] ?? 0,
      y: y[index] ?? 0
    };
    (Object.keys(extraArrays) as TelemetryExtraChannel[]).forEach((channel) => {
      row[channel] = extraArrays[channel][index];
    });
    return row;
  });
};

const formatEvent = (entry: unknown): TelemetryEvent | null => {
  if (typeof entry !== "object" || entry === null) {
    return null;
  }

  const point = entry as RawTelemetryPoint;
  const type = EVENT_TYPE_KEYS.map((key) => point[key]).find(
    (value): value is string => typeof value === "string" && value.trim() !== ""
  );
  const time = pickNumber(point, EVENT_TIME_KEYS);

  if (!type || time === null) {
    return null;
  }

  const rawValue = EVENT_VALUE_KEYS.map((key) => point[key]).find((value) => value !== undefined);
  const value =
    typeof rawValue === "number" || typeof rawValue === "string" || typeof rawValue === "boolean" || rawValue === null
      ? rawValue
      : undefined;
  const description = typeof point.description === "string" ? point.description : undefined;
  const metadata =
    typeof point.metadata === "object" && point.metadata !== null && !Array.isArray(point.metadata)
      ? (point.metadata as Record<string, unknown>)
      : undefined;

  return {
    time,
    type,
    value,
    description,
    metadata
  };
};

const getEvents = (input: RawTelemetryInput): TelemetryEvent[] => {
  if (Array.isArray(input)) {
    return [];
  }

  const directEvents = Array.isArray(input.events) ? input.events : [];
  return directEvents.map(formatEvent).filter((event): event is TelemetryEvent => event !== null);
};

/**
 * Normalize raw telemetry payloads into aligned numeric series.
 *
 * Accepts row arrays, nested array payloads, or column-oriented objects and
 * always returns a `FormattedTelemetry` shape.
 */
export const formatTelemetry = (data: RawTelemetryInput): FormattedTelemetry => {
  const formatted: FormattedTelemetry = {
    time: [],
    speed: [],
    throttle: [],
    brake: [],
    x: [],
    y: [],
    timeReference: "session"
  };
  const extraChannelBuffers = Object.fromEntries(
    Object.keys(EXTRA_CHANNEL_KEY_MAP).map((channel) => [channel, [] as number[]])
  ) as Record<TelemetryExtraChannel, number[]>;
  const hasExtraChannel = Object.fromEntries(
    Object.keys(EXTRA_CHANNEL_KEY_MAP).map((channel) => [channel, false])
  ) as Record<TelemetryExtraChannel, boolean>;

  const points: RawTelemetryPoint[] = Array.isArray(data)
    ? data.filter((entry): entry is RawTelemetryPoint => typeof entry === "object" && entry !== null)
    : getPointsFromNestedArray(data) ?? getPointsFromColumns(data);

  points.forEach((point, index) => {
    formatted.time.push(pickNumber(point, TIME_KEYS) ?? index);
    formatted.speed.push(pickNumber(point, SPEED_KEYS) ?? 0);
    formatted.throttle.push(pickNumber(point, THROTTLE_KEYS) ?? 0);
    formatted.brake.push(pickNumber(point, BRAKE_KEYS) ?? 0);
    formatted.x.push(pickNumber(point, X_KEYS) ?? 0);
    formatted.y.push(pickNumber(point, Y_KEYS) ?? 0);
    (Object.keys(EXTRA_CHANNEL_KEY_MAP) as TelemetryExtraChannel[]).forEach((channel) => {
      const channelValue = pickNumber(point, EXTRA_CHANNEL_KEY_MAP[channel]);
      if (channelValue !== null) {
        hasExtraChannel[channel] = true;
      }
      extraChannelBuffers[channel].push(channelValue ?? 0);
    });
  });

  const channels = Object.fromEntries(
    (Object.keys(EXTRA_CHANNEL_KEY_MAP) as TelemetryExtraChannel[])
      .filter((channel) => hasExtraChannel[channel])
      .map((channel) => [channel, extraChannelBuffers[channel]])
  ) as Partial<Record<TelemetryExtraChannel, number[]>>;
  if (Object.keys(channels).length > 0) {
    formatted.channels = channels;
  }

  const events = getEvents(data);
  if (events.length > 0) {
    formatted.events = events;
  }

  const normalized = normalizeTelemetryTime(formatted);
  warnTelemetryIssues(validateTelemetry(normalized, "formatTelemetry"));

  return normalized;
};
