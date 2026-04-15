import type {
  FormattedTelemetry,
  TelemetryValidationIssue,
  TelemetryValidationResult
} from "../types/telemetry";

const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
const isProduction = nodeProcess?.env?.NODE_ENV === "production";

const warn = (message: string) => {
  if (!isProduction && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
};

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

export const sanitizeNumericArray = (input: unknown, seriesName: string): number[] => {
  if (!Array.isArray(input)) {
    warn(`"${seriesName}" must be an array. Received ${typeof input}.`);
    return [];
  }

  const values: number[] = [];
  let invalidCount = 0;

  input.forEach((value) => {
    const parsed = toFiniteNumber(value);
    if (parsed === null) {
      invalidCount += 1;
      return;
    }
    values.push(parsed);
  });

  if (invalidCount > 0) {
    warn(`"${seriesName}" dropped ${invalidCount} invalid value(s).`);
  }

  return values;
};

export const alignSeriesLengths = (
  context: string,
  time: number[],
  seriesMap: Record<string, number[]>
): { time: number[]; seriesMap: Record<string, number[]> } => {
  const seriesEntries = Object.entries(seriesMap);
  const lengths = [time.length, ...seriesEntries.map(([, series]) => series.length)];
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);

  if (maxLength === 0) {
    warn(`${context}: all telemetry arrays are empty.`);
    return {
      time: [],
      seriesMap: Object.fromEntries(seriesEntries.map(([key]) => [key, []]))
    };
  }

  if (minLength !== maxLength) {
    warn(`${context}: telemetry arrays have mismatched lengths and were trimmed to ${minLength}.`);
  }

  return {
    time: time.slice(0, minLength),
    seriesMap: Object.fromEntries(seriesEntries.map(([key, series]) => [key, series.slice(0, minLength)]))
  };
};

export const validateTelemetry = (
  telemetry: Partial<FormattedTelemetry>,
  context = "Telemetry"
): TelemetryValidationResult => {
  const requiredKeys: Array<keyof FormattedTelemetry> = ["time", "speed", "throttle", "brake", "x", "y"];
  const issues: TelemetryValidationIssue[] = [];
  const lengths: number[] = [];

  requiredKeys.forEach((key) => {
    const candidate = telemetry[key];
    if (!Array.isArray(candidate)) {
      issues.push({
        code: "INVALID_SERIES",
        message: `${context}: "${key}" is missing or not an array.`
      });
      return;
    }

    if (candidate.length === 0) {
      issues.push({
        code: "EMPTY_SERIES",
        message: `${context}: "${key}" is empty.`
      });
    }

    candidate.forEach((value, index) => {
      if (!Number.isFinite(value)) {
        issues.push({
          code: "INVALID_VALUE",
          message: `${context}: "${key}" contains a non-finite value at index ${index}.`
        });
      }
    });

    lengths.push(candidate.length);
  });

  if (lengths.length > 1 && Math.min(...lengths) !== Math.max(...lengths)) {
    issues.push({
      code: "LENGTH_MISMATCH",
      message: `${context}: telemetry arrays have inconsistent lengths.`
    });
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

export const warnTelemetryIssues = (validation: TelemetryValidationResult) => {
  if (!validation.isValid) {
    validation.issues.forEach((issue) => warn(issue.message));
  }
};
