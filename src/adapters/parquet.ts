import { formatTelemetry } from "../utils/formatTelemetry";
import type { FormattedTelemetry, RawTelemetryPoint } from "../types/telemetry";
import { fromFastF1Telemetry } from "./fastf1";
import type { JsonFieldMapping } from "./json";

export interface ParquetTelemetryOptions {
  fieldMapping?: JsonFieldMapping;
}

const DEFAULT_PARQUET_MAPPING: Required<JsonFieldMapping> = {
  time: "SessionTime",
  speed: "Speed",
  throttle: "Throttle",
  brake: "Brake",
  x: "X",
  y: "Y"
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
      y: row[mapping.y]
    })
  );

  return formatTelemetry(remapped);
};
