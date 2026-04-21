import { formatTelemetry } from "../utils/formatTelemetry";
import type { AdapterParseOptions, FormattedTelemetry, RawTelemetryPoint, TelemetryAdapterResult } from "../types/telemetry";
import { pickField, toNumber, toSeconds } from "./shared";
import { toAdapterResult } from "./diagnostics";

export interface OpenF1TelemetryPoint {
  [key: string]: unknown;
  date?: string;
  session_time?: number | string;
  speed?: number | string;
  throttle?: number | string;
  brake?: number | string;
  n_gear?: number | string;
  air_temperature?: number | string;
  track_temperature?: number | string;
  humidity?: number | string;
  wind_speed?: number | string;
  rainfall?: number | string;
  air_pressure?: number | string;
  x?: number | string;
  y?: number | string;
}

const TIME_KEYS = ["session_time", "date", "time", "timestamp", "time_seconds"];
const SPEED_KEYS = ["speed", "speed_kmh"];
const THROTTLE_KEYS = ["throttle", "throttle_percentage"];
const BRAKE_KEYS = ["brake", "brake_percentage"];
const X_KEYS = ["x", "position_x", "world_x"];
const Y_KEYS = ["y", "position_y", "world_y"];
const GEAR_KEYS = ["n_gear", "nGear", "gear"];
const AIR_TEMP_KEYS = ["air_temperature", "airTemp"];
const TRACK_TEMP_KEYS = ["track_temperature", "trackTemp"];
const HUMIDITY_KEYS = ["humidity"];
const WIND_SPEED_KEYS = ["wind_speed", "windSpeed"];
const RAINFALL_KEYS = ["rainfall", "rain_intensity"];
const PRESSURE_KEYS = ["air_pressure", "pressure"];

/**
 * Convert OpenF1 telemetry records into normalized telemetry arrays.
 */
export const fromOpenF1Telemetry = (input: OpenF1TelemetryPoint[]): FormattedTelemetry => {
  const points = input.map((point, index): RawTelemetryPoint => ({
    time: toSeconds(pickField(point, TIME_KEYS)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS)) ?? 0,
    x: toNumber(pickField(point, X_KEYS)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS)) ?? 0,
    gear: toNumber(pickField(point, GEAR_KEYS)) ?? undefined,
    airTemp: toNumber(pickField(point, AIR_TEMP_KEYS)) ?? undefined,
    trackTemp: toNumber(pickField(point, TRACK_TEMP_KEYS)) ?? undefined,
    humidity: toNumber(pickField(point, HUMIDITY_KEYS)) ?? undefined,
    windSpeed: toNumber(pickField(point, WIND_SPEED_KEYS)) ?? undefined,
    rainfall: toNumber(pickField(point, RAINFALL_KEYS)) ?? undefined,
    pressure: toNumber(pickField(point, PRESSURE_KEYS)) ?? undefined
  }));

  return formatTelemetry(points);
};

export const fromOpenF1TelemetryWithDiagnostics = (
  input: OpenF1TelemetryPoint[],
  options: AdapterParseOptions = {}
): TelemetryAdapterResult => toAdapterResult("openf1", fromOpenF1Telemetry(input), input.length, options);
