import { formatTelemetry } from "../utils/formatTelemetry";
import type { AdapterParseOptions, FormattedTelemetry, RawTelemetryPoint, TelemetryAdapterResult } from "../types/telemetry";
import { pickField, toNumber, toSeconds } from "./shared";
import { toAdapterResult } from "./diagnostics";

export type FastF1TelemetryPoint = {
  [key: string]: unknown;
  Time?: unknown;
  SessionTime?: unknown;
  timestamp?: unknown;
  speed?: unknown;
  Speed?: unknown;
  throttle?: unknown;
  Throttle?: unknown;
  brake?: unknown;
  Brake?: unknown;
  x?: unknown;
  X?: unknown;
  y?: unknown;
  Y?: unknown;
};

export type FastF1TelemetryInput = FastF1TelemetryPoint[] | Record<string, unknown>;

const TIME_KEYS = ["SessionTime", "Time", "time", "timestamp"];
const SPEED_KEYS = ["Speed", "speed"];
const THROTTLE_KEYS = ["Throttle", "throttle"];
const BRAKE_KEYS = ["Brake", "brake"];
const X_KEYS = ["X", "x", "PositionX", "posX"];
const Y_KEYS = ["Y", "y", "PositionY", "posY"];
const GEAR_KEYS = ["nGear", "NGear", "gear"];
const ERS_DEPLOYMENT_KEYS = ["ERSDeploy", "ERSDeployment", "ersDeployment"];
const ERS_HARVEST_KEYS = ["ERSHarvest", "ersHarvest"];
const BATTERY_LEVEL_KEYS = ["BatteryLevel", "batteryLevel", "soc"];

const fromPoints = (points: FastF1TelemetryPoint[]): FormattedTelemetry => {
  const normalized = points.map((point, index): RawTelemetryPoint => ({
    time: toSeconds(pickField(point, TIME_KEYS)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS)) ?? 0,
    x: toNumber(pickField(point, X_KEYS)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS)) ?? 0,
    gear: toNumber(pickField(point, GEAR_KEYS)) ?? undefined,
    ersDeployment: toNumber(pickField(point, ERS_DEPLOYMENT_KEYS)) ?? undefined,
    ersHarvest: toNumber(pickField(point, ERS_HARVEST_KEYS)) ?? undefined,
    batteryLevel: toNumber(pickField(point, BATTERY_LEVEL_KEYS)) ?? undefined
  }));

  return formatTelemetry(normalized);
};

/**
 * Convert FastF1 telemetry payloads into normalized telemetry arrays.
 */
export const fromFastF1Telemetry = (input: FastF1TelemetryInput): FormattedTelemetry => {
  if (Array.isArray(input)) {
    return fromPoints(input);
  }

  if ("records" in input && Array.isArray(input.records)) {
    return fromPoints(input.records as FastF1TelemetryPoint[]);
  }

  if ("telemetry" in input && Array.isArray(input.telemetry)) {
    return fromPoints(input.telemetry as FastF1TelemetryPoint[]);
  }

  return formatTelemetry({
    time: input.SessionTime ?? input.Time ?? input.time,
    speed: input.Speed ?? input.speed,
    throttle: input.Throttle ?? input.throttle,
    brake: input.Brake ?? input.brake,
    x: input.X ?? input.x,
    y: input.Y ?? input.y,
    gear: input.nGear ?? input.NGear ?? input.gear,
    ersDeployment: input.ERSDeploy ?? input.ERSDeployment ?? input.ersDeployment,
    ersHarvest: input.ERSHarvest ?? input.ersHarvest,
    batteryLevel: input.BatteryLevel ?? input.batteryLevel ?? input.soc
  });
};

export const fromFastF1TelemetryWithDiagnostics = (
  input: FastF1TelemetryInput,
  options: AdapterParseOptions = {}
): TelemetryAdapterResult => {
  const telemetry = fromFastF1Telemetry(input);
  const sourceSamples = Array.isArray(input)
    ? input.length
    : Array.isArray(input.records)
      ? input.records.length
      : Array.isArray(input.telemetry)
        ? input.telemetry.length
        : telemetry.time.length;
  return toAdapterResult("fastf1", telemetry, sourceSamples, options);
};
