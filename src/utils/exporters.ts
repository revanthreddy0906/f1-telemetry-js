import type {
  CsvExportOptions,
  FormattedTelemetry,
  JsonExportFormat,
  TelemetrySeriesKey
} from "../types/telemetry";
import { alignSeriesLengths, sanitizeNumericArray } from "./validation";

const TELEMETRY_CHANNELS: TelemetrySeriesKey[] = [
  "time",
  "speed",
  "throttle",
  "brake",
  "x",
  "y"
];

const sanitizeTelemetry = (telemetry: FormattedTelemetry, context: string): FormattedTelemetry => {
  const sanitized = alignSeriesLengths(
    context,
    sanitizeNumericArray(telemetry.time, `${context}.time`),
    {
      speed: sanitizeNumericArray(telemetry.speed, `${context}.speed`),
      throttle: sanitizeNumericArray(telemetry.throttle, `${context}.throttle`),
      brake: sanitizeNumericArray(telemetry.brake, `${context}.brake`),
      x: sanitizeNumericArray(telemetry.x, `${context}.x`),
      y: sanitizeNumericArray(telemetry.y, `${context}.y`)
    }
  );

  return {
    time: sanitized.time,
    speed: sanitized.seriesMap.speed,
    throttle: sanitized.seriesMap.throttle,
    brake: sanitized.seriesMap.brake,
    x: sanitized.seriesMap.x,
    y: sanitized.seriesMap.y
  };
};

/**
 * Merge multiple telemetry traces into one continuous telemetry object.
 * Time values are shifted to avoid overlap between consecutive traces.
 *
 * @param telemetrySources - One or more telemetry traces
 * @returns Combined telemetry trace
 *
 * @example
 * ```ts
 * const merged = mergeTelemetry(fp1, fp2, fp3);
 * ```
 */
export const mergeTelemetry = (...telemetrySources: FormattedTelemetry[]): FormattedTelemetry => {
  if (telemetrySources.length === 0) {
    return {
      time: [],
      speed: [],
      throttle: [],
      brake: [],
      x: [],
      y: []
    };
  }

  if (telemetrySources.length === 1) {
    const source = telemetrySources[0];
    return {
      time: [...source.time],
      speed: [...source.speed],
      throttle: [...source.throttle],
      brake: [...source.brake],
      x: [...source.x],
      y: [...source.y]
    };
  }

  const merged: FormattedTelemetry = {
    time: [],
    speed: [],
    throttle: [],
    brake: [],
    x: [],
    y: []
  };

  let offset = 0;
  telemetrySources.forEach((source, sourceIndex) => {
    const telemetry = sanitizeTelemetry(source, `mergeTelemetry.source[${sourceIndex}]`);
    if (telemetry.time.length === 0) {
      return;
    }

    telemetry.time.forEach((timeValue, index) => {
      merged.time.push(timeValue + offset);
      merged.speed.push(telemetry.speed[index]);
      merged.throttle.push(telemetry.throttle[index]);
      merged.brake.push(telemetry.brake[index]);
      merged.x.push(telemetry.x[index]);
      merged.y.push(telemetry.y[index]);
    });

    offset = (merged.time[merged.time.length - 1] ?? offset) + 0.001;
  });

  return merged;
};

/**
 * Export telemetry to JSON in row or column format.
 *
 * @param telemetry - Source telemetry
 * @param format - Export format (`rows` by default)
 * @param precision - Optional decimal precision (defaults to 6)
 * @returns JSON string
 *
 * @example
 * ```ts
 * const json = exportToJson(telemetry, "rows");
 * ```
 */
export const exportToJson = (
  telemetry: FormattedTelemetry,
  format: JsonExportFormat = "rows"
): string => {
  const sanitized = sanitizeTelemetry(telemetry, "exportToJson");

  if (sanitized.time.length === 0) {
    return format === "columns" ? "{}" : "[]";
  }

  if (format === "columns") {
    return JSON.stringify(sanitized);
  }

  const rows = sanitized.time.map((timeValue, index) => ({
    time: timeValue,
    speed: sanitized.speed[index],
    throttle: sanitized.throttle[index],
    brake: sanitized.brake[index],
    x: sanitized.x[index],
    y: sanitized.y[index]
  }));

  return JSON.stringify(rows);
};

const resolveChannels = (channels?: TelemetrySeriesKey[]): TelemetrySeriesKey[] => {
  if (!channels || channels.length === 0) {
    return TELEMETRY_CHANNELS;
  }

  const unique = Array.from(new Set(channels));
  return unique.filter((channel): channel is TelemetrySeriesKey => TELEMETRY_CHANNELS.includes(channel));
};

/**
 * Export telemetry to CSV.
 *
 * @param telemetry - Source telemetry
 * @param options - CSV export options
 * @returns CSV text
 *
 * @example
 * ```ts
 * const csv = exportToCsv(telemetry, { delimiter: ";", precision: 3 });
 * ```
 */
export const exportToCsv = (
  telemetry: FormattedTelemetry,
  options: CsvExportOptions = {}
): string => {
  const {
    delimiter = ",",
    includeHeader = true,
    precision = 6,
    channels
  } = options;
  const selectedChannels = resolveChannels(channels);

  if (selectedChannels.length === 0) {
    return "";
  }

  const sanitized = sanitizeTelemetry(telemetry, "exportToCsv");
  const rowCount = Math.min(...selectedChannels.map((channel) => sanitized[channel].length));

  const formatValue = (value: number): string => {
    if (!Number.isFinite(value)) {
      return "";
    }
    return precision >= 0 ? value.toFixed(precision) : String(value);
  };

  const lines: string[] = [];
  if (includeHeader) {
    lines.push(selectedChannels.join(delimiter));
  }

  for (let index = 0; index < rowCount; index += 1) {
    const row = selectedChannels.map((channel) => formatValue(sanitized[channel][index]));
    lines.push(row.join(delimiter));
  }

  return lines.join("\n");
};
