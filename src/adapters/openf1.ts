import { formatTelemetry } from "../utils/formatTelemetry";
import type { FormattedTelemetry, RawTelemetryPoint } from "../types/telemetry";
import { pickField, toNumber, toSeconds } from "./shared";

export interface OpenF1TelemetryPoint {
  [key: string]: unknown;
  date?: string;
  session_time?: number | string;
  speed?: number | string;
  throttle?: number | string;
  brake?: number | string;
  x?: number | string;
  y?: number | string;
}

const TIME_KEYS = ["session_time", "date", "time", "timestamp", "time_seconds"];
const SPEED_KEYS = ["speed", "speed_kmh"];
const THROTTLE_KEYS = ["throttle", "throttle_percentage"];
const BRAKE_KEYS = ["brake", "brake_percentage"];
const X_KEYS = ["x", "position_x", "world_x"];
const Y_KEYS = ["y", "position_y", "world_y"];

export const fromOpenF1Telemetry = (input: OpenF1TelemetryPoint[]): FormattedTelemetry => {
  const points = input.map((point, index): RawTelemetryPoint => ({
    time: toSeconds(pickField(point, TIME_KEYS)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS)) ?? 0,
    x: toNumber(pickField(point, X_KEYS)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS)) ?? 0
  }));

  return formatTelemetry(points);
};
