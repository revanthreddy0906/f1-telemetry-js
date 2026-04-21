import { formatTelemetry } from "../utils/formatTelemetry";
import type { AdapterParseOptions, FormattedTelemetry, RawTelemetryPoint, TelemetryAdapterResult } from "../types/telemetry";
import { fromFastF1Telemetry } from "./fastf1";
import type { JsonFieldMapping } from "./json";
import { toAdapterResult } from "./diagnostics";

export interface ParquetTelemetryOptions {
  fieldMapping?: JsonFieldMapping;
}

const DEFAULT_PARQUET_MAPPING: Required<JsonFieldMapping> = {
  time: "SessionTime",
  speed: "Speed",
  throttle: "Throttle",
  brake: "Brake",
  x: "X",
  y: "Y",
  gear: "nGear",
  ersDeployment: "ERSDeploy",
  ersHarvest: "ERSHarvest",
  batteryLevel: "BatteryLevel",
  airTemp: "AirTemp",
  trackTemp: "TrackTemp",
  humidity: "Humidity",
  windSpeed: "WindSpeed",
  rainfall: "Rainfall",
  pressure: "Pressure"
};

export const fromParquet = (
  rows: Record<string, unknown>[],
  options: ParquetTelemetryOptions = {}
): FormattedTelemetry => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return formatTelemetry([]);
  }

  if (!options.fieldMapping) {
    return fromFastF1Telemetry(rows);
  }

  const mapping = { ...DEFAULT_PARQUET_MAPPING, ...options.fieldMapping };
  const remapped = rows.map(
    (row): RawTelemetryPoint => ({
      time: row[mapping.time],
      speed: row[mapping.speed],
      throttle: row[mapping.throttle],
      brake: row[mapping.brake],
      x: row[mapping.x],
      y: row[mapping.y],
      gear: row[mapping.gear],
      ersDeployment: row[mapping.ersDeployment],
      ersHarvest: row[mapping.ersHarvest],
      batteryLevel: row[mapping.batteryLevel],
      airTemp: row[mapping.airTemp],
      trackTemp: row[mapping.trackTemp],
      humidity: row[mapping.humidity],
      windSpeed: row[mapping.windSpeed],
      rainfall: row[mapping.rainfall],
      pressure: row[mapping.pressure]
    })
  );

  return formatTelemetry(remapped);
};

export const fromParquetWithDiagnostics = (
  rows: Record<string, unknown>[],
  options: ParquetTelemetryOptions & AdapterParseOptions = {}
): TelemetryAdapterResult => toAdapterResult("parquet", fromParquet(rows, options), rows.length, options);
