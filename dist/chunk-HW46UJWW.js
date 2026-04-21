// src/utils/validation.ts
var nodeProcess = globalThis.process;
var isProduction = nodeProcess?.env?.NODE_ENV === "production";
var warn = (message) => {
  if (!isProduction && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
};
var toFiniteNumber = (value) => {
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
var sanitizeNumericArray = (input, seriesName) => {
  if (!Array.isArray(input)) {
    warn(`"${seriesName}" must be an array. Received ${typeof input}.`);
    return [];
  }
  const values = [];
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
var alignSeriesLengths = (context, time, seriesMap) => {
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
var validateTelemetry = (telemetry, context = "Telemetry", options = {}) => {
  const requiredKeys = ["time", "speed", "throttle", "brake", "x", "y"];
  const issues = [];
  const lengths = {};
  const mode = options.mode ?? "strict";
  const isLenient = mode === "lenient";
  const allowEmptySeries = options.allowEmptySeries ?? isLenient;
  requiredKeys.forEach((key) => {
    const candidate = telemetry[key];
    if (!Array.isArray(candidate)) {
      issues.push({
        code: "INVALID_SERIES",
        severity: "error",
        channel: key,
        message: `${context}: "${key}" is missing or not an array.`
      });
      return;
    }
    lengths[key] = candidate.length;
    if (candidate.length === 0 && !allowEmptySeries) {
      issues.push({
        code: "EMPTY_SERIES",
        severity: isLenient ? "warning" : "error",
        channel: key,
        message: `${context}: "${key}" is empty.`
      });
    }
    if (candidate.length > 0 && candidate.length < 3) {
      issues.push({
        code: "SPARSE_SERIES",
        severity: "warning",
        channel: key,
        actualLength: candidate.length,
        message: `${context}: "${key}" has sparse data (${candidate.length} point(s)).`
      });
    }
    candidate.forEach((value, index) => {
      if (!Number.isFinite(value)) {
        issues.push({
          code: "INVALID_VALUE",
          severity: "error",
          channel: key,
          index,
          message: `${context}: "${key}" contains a non-finite value at index ${index}.`
        });
      }
    });
  });
  const lengthValues = Object.values(lengths);
  const minLength = lengthValues.length === 0 ? 0 : Math.min(...lengthValues);
  const maxLength = lengthValues.length === 0 ? 0 : Math.max(...lengthValues);
  if (lengthValues.length > 1 && minLength !== maxLength) {
    issues.push({
      code: "LENGTH_MISMATCH",
      severity: isLenient ? "warning" : "error",
      expectedLength: minLength,
      actualLength: maxLength,
      message: `${context}: telemetry arrays have inconsistent lengths.`
    });
  }
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.length - errorCount;
  return {
    isValid: errorCount === 0,
    issues,
    mode,
    diagnostics: {
      context,
      mode,
      totalIssues: issues.length,
      errorCount,
      warningCount,
      lengths
    }
  };
};
var warnTelemetryIssues = (validation) => {
  const warnableIssues = validation.issues.filter(
    (issue) => issue.severity === "error" || issue.code !== "SPARSE_SERIES"
  );
  if (warnableIssues.length === 0) {
    return;
  }
  warnableIssues.forEach((issue) => warn(issue.message));
};

export {
  sanitizeNumericArray,
  alignSeriesLengths,
  validateTelemetry,
  warnTelemetryIssues
};
//# sourceMappingURL=chunk-HW46UJWW.js.map