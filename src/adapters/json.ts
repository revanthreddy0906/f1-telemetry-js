import { formatTelemetry } from "../utils/formatTelemetry";
import type { FormattedTelemetry, RawTelemetryPoint } from "../types/telemetry";

export interface JsonFieldMapping {
  time?: string;
  speed?: string;
  throttle?: string;
  brake?: string;
  x?: string;
  y?: string;
}

export interface JsonTelemetryOptions {
  fieldMapping?: JsonFieldMapping;
  dataPath?: string;
}

const DEFAULT_FIELD_MAPPING: Required<JsonFieldMapping> = {
  time: "time",
  speed: "speed",
  throttle: "throttle",
  brake: "brake",
  x: "x",
  y: "y"
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
        y: resolvePath(point, fields.y)
      } satisfies RawTelemetryPoint;
    });
    return formatTelemetry(rows);
  }

  if (isColumnOriented(source)) {
    return formatTelemetry({
      time: resolvePath(source, fields.time),
      speed: resolvePath(source, fields.speed),
      throttle: resolvePath(source, fields.throttle),
      brake: resolvePath(source, fields.brake),
      x: resolvePath(source, fields.x),
      y: resolvePath(source, fields.y)
    });
  }

  warn("fromJsonTelemetry: input did not resolve to telemetry rows or columns.");
  return formatTelemetry([]);
};
