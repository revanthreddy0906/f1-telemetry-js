import type { FormattedTelemetry, RawTelemetryInput, RawTelemetryPoint } from "../types/telemetry";
import { validateTelemetry, warnTelemetryIssues } from "./validation";

const TIME_KEYS = ["time", "timestamp", "t", "elapsed", "elapsedTime"];
const SPEED_KEYS = ["speed", "velocity", "v"];
const THROTTLE_KEYS = ["throttle", "throttlePosition"];
const BRAKE_KEYS = ["brake", "brakePressure", "brakePosition"];
const X_KEYS = ["x", "posX", "positionX", "worldX"];
const Y_KEYS = ["y", "posY", "positionY", "worldY"];

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

  const length = Math.max(time.length, speed.length, throttle.length, brake.length, x.length, y.length);
  return Array.from({ length }, (_, index) => ({
    time: time[index] ?? index,
    speed: speed[index] ?? 0,
    throttle: throttle[index] ?? 0,
    brake: brake[index] ?? 0,
    x: x[index] ?? 0,
    y: y[index] ?? 0
  }));
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
    y: []
  };

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
  });

  warnTelemetryIssues(validateTelemetry(formatted, "formatTelemetry"));

  return formatted;
};
