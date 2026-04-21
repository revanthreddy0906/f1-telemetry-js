import { formatTelemetry } from "../utils/formatTelemetry";
import type {
  AdapterParseOptions,
  FormattedTelemetry,
  RawTelemetryPoint,
  TelemetryAdapterResult
} from "../types/telemetry";
import { toAdapterResult } from "./diagnostics";

export interface JsonFieldMapping {
  time?: string;
  speed?: string;
  throttle?: string;
  brake?: string;
  x?: string;
  y?: string;
  gear?: string;
  ersDeployment?: string;
  ersHarvest?: string;
  batteryLevel?: string;
  airTemp?: string;
  trackTemp?: string;
  humidity?: string;
  windSpeed?: string;
  rainfall?: string;
  pressure?: string;
}

export interface JsonTelemetryOptions {
  fieldMapping?: JsonFieldMapping;
  dataPath?: string;
  eventsPath?: string;
}

const DEFAULT_FIELD_MAPPING: Required<JsonFieldMapping> = {
  time: "time",
  speed: "speed",
  throttle: "throttle",
  brake: "brake",
  x: "x",
  y: "y",
  gear: "gear",
  ersDeployment: "ersDeployment",
  ersHarvest: "ersHarvest",
  batteryLevel: "batteryLevel",
  airTemp: "airTemp",
  trackTemp: "trackTemp",
  humidity: "humidity",
  windSpeed: "windSpeed",
  rainfall: "rainfall",
  pressure: "pressure"
};

const resolvePath = (obj: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[key]
          : undefined,
      obj
    );

const mapField = (mapping: JsonFieldMapping | undefined): Required<JsonFieldMapping> => ({
  ...DEFAULT_FIELD_MAPPING,
  ...mapping
});

const warn = (message: string) => {
  const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  if (nodeProcess?.env?.NODE_ENV !== "production" && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
};

const isColumnOriented = (value: unknown): value is Record<string, unknown> =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).some((entry) => Array.isArray(entry));

export const fromJsonTelemetry = (
  input: unknown,
  options: JsonTelemetryOptions = {}
): FormattedTelemetry => {
  const fields = mapField(options.fieldMapping);
  const source = Array.isArray(input)
    ? input
    : options.dataPath
      ? resolvePath(input, options.dataPath)
      : input;

  if (options.dataPath && !Array.isArray(input) && source === undefined) {
    warn(`fromJsonTelemetry: dataPath "${options.dataPath}" was not found.`);
    return formatTelemetry([]);
  }

  if (Array.isArray(source)) {
    const rows = source.map((point) => {
      if (!point || typeof point !== "object") {
        return {};
      }
      return {
        time: resolvePath(point, fields.time),
        speed: resolvePath(point, fields.speed),
        throttle: resolvePath(point, fields.throttle),
        brake: resolvePath(point, fields.brake),
        x: resolvePath(point, fields.x),
        y: resolvePath(point, fields.y),
        gear: resolvePath(point, fields.gear),
        ersDeployment: resolvePath(point, fields.ersDeployment),
        ersHarvest: resolvePath(point, fields.ersHarvest),
        batteryLevel: resolvePath(point, fields.batteryLevel),
        airTemp: resolvePath(point, fields.airTemp),
        trackTemp: resolvePath(point, fields.trackTemp),
        humidity: resolvePath(point, fields.humidity),
        windSpeed: resolvePath(point, fields.windSpeed),
        rainfall: resolvePath(point, fields.rainfall),
        pressure: resolvePath(point, fields.pressure)
      } satisfies RawTelemetryPoint;
    });
    const telemetryData =
      options.eventsPath && !Array.isArray(input)
        ? {
            telemetry: rows,
            events: resolvePath(input, options.eventsPath)
          }
        : rows;
    return formatTelemetry(telemetryData);
  }

  if (isColumnOriented(source)) {
    const telemetryColumns = {
      time: resolvePath(source, fields.time),
      speed: resolvePath(source, fields.speed),
      throttle: resolvePath(source, fields.throttle),
      brake: resolvePath(source, fields.brake),
      x: resolvePath(source, fields.x),
      y: resolvePath(source, fields.y),
      gear: resolvePath(source, fields.gear),
      ersDeployment: resolvePath(source, fields.ersDeployment),
      ersHarvest: resolvePath(source, fields.ersHarvest),
      batteryLevel: resolvePath(source, fields.batteryLevel),
      airTemp: resolvePath(source, fields.airTemp),
      trackTemp: resolvePath(source, fields.trackTemp),
      humidity: resolvePath(source, fields.humidity),
      windSpeed: resolvePath(source, fields.windSpeed),
      rainfall: resolvePath(source, fields.rainfall),
      pressure: resolvePath(source, fields.pressure)
    };
    const telemetryData =
      options.eventsPath && !Array.isArray(input)
        ? {
            ...telemetryColumns,
            events: resolvePath(input, options.eventsPath)
          }
        : telemetryColumns;
    return formatTelemetry(telemetryData);
  }

  warn("fromJsonTelemetry: input did not resolve to telemetry rows or columns.");
  return formatTelemetry([]);
};

export const fromJsonTelemetryWithDiagnostics = (
  input: unknown,
  options: JsonTelemetryOptions & AdapterParseOptions = {}
): TelemetryAdapterResult => {
  const source = Array.isArray(input)
    ? input
    : options.dataPath
      ? resolvePath(input, options.dataPath)
      : input;
  const sourceSamples = Array.isArray(source)
    ? source.length
    : isColumnOriented(source)
      ? Math.max(
          0,
          ...Object.values(source).map((entry) => (Array.isArray(entry) ? entry.length : 0))
        )
      : 0;
  const telemetry = fromJsonTelemetry(input, options);
  return toAdapterResult("json", telemetry, sourceSamples, options);
};
