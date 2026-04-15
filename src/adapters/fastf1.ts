import { formatTelemetry } from "../utils/formatTelemetry";
import type { FormattedTelemetry, RawTelemetryPoint } from "../types/telemetry";
import { pickField, toNumber, toSeconds } from "./shared";

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

const fromPoints = (points: FastF1TelemetryPoint[]): FormattedTelemetry => {
  const normalized = points.map((point, index): RawTelemetryPoint => ({
    time: toSeconds(pickField(point, TIME_KEYS)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS)) ?? 0,
    x: toNumber(pickField(point, X_KEYS)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS)) ?? 0
  }));

  return formatTelemetry(normalized);
};

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
    y: input.Y ?? input.y
  });
};
