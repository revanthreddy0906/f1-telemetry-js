import { formatTelemetry } from "../utils/formatTelemetry";
import type { AdapterParseOptions, FormattedTelemetry, RawTelemetryPoint, TelemetryAdapterResult } from "../types/telemetry";
import { toAdapterResult } from "./diagnostics";

export interface CsvTelemetryOptions {
  delimiter?: "," | ";" | "\t";
  hasHeader?: boolean;
}

const normalizeHeader = (value: string): string => value.trim().toLowerCase();

const HEADER_KEY_MAP: Record<string, keyof RawTelemetryPoint> = {
  time: "time",
  timestamp: "time",
  t: "time",
  speed: "speed",
  velocity: "speed",
  throttle: "throttle",
  brake: "brake",
  gear: "gear",
  ngear: "gear",
  ersdeployment: "ersDeployment",
  ersharvest: "ersHarvest",
  batterylevel: "batteryLevel",
  airtemp: "airTemp",
  tracktemp: "trackTemp",
  humidity: "humidity",
  windspeed: "windSpeed",
  rainfall: "rainfall",
  pressure: "pressure",
  x: "x",
  y: "y"
};

const detectDelimiter = (row: string): "," | ";" | "\t" => {
  if (row.includes("\t")) {
    return "\t";
  }
  if (row.includes(";")) {
    return ";";
  }
  return ",";
};

const splitCsvRow = (row: string, delimiter: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];

    if (char === "\"") {
      if (inQuotes && row[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const maybeNumber = (value: string): number | string => {
  if (value === "") {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};

/**
 * Parse CSV telemetry text into normalized telemetry arrays.
 */
export const fromCsvTelemetry = (csv: string, options: CsvTelemetryOptions = {}): FormattedTelemetry => {
  const rows = csv
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  if (rows.length === 0) {
    return formatTelemetry([]);
  }

  const delimiter = options.delimiter ?? detectDelimiter(rows[0]);
  const hasHeader = options.hasHeader ?? true;

  const rawHeaders = hasHeader
    ? splitCsvRow(rows[0], delimiter)
    : ["time", "speed", "throttle", "brake", "x", "y"];
  const headers = rawHeaders.map((header) => HEADER_KEY_MAP[normalizeHeader(header)] ?? normalizeHeader(header));

  const startIndex = hasHeader ? 1 : 0;
  const points: RawTelemetryPoint[] = [];

  for (let rowIndex = startIndex; rowIndex < rows.length; rowIndex += 1) {
    const columns = splitCsvRow(rows[rowIndex], delimiter);
    const point: RawTelemetryPoint = {};

    headers.forEach((header, columnIndex) => {
      const value = columns[columnIndex] ?? "";
      point[header] = maybeNumber(value);
    });

    points.push(point);
  }

  return formatTelemetry(points);
};

export const fromCsvTelemetryWithDiagnostics = (
  csv: string,
  options: CsvTelemetryOptions & AdapterParseOptions = {}
): TelemetryAdapterResult => {
  const telemetry = fromCsvTelemetry(csv, options);
  const sourceSamples = csv
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0).length - (options.hasHeader ?? true ? 1 : 0);
  return toAdapterResult("csv", telemetry, Math.max(sourceSamples, 0), options);
};
