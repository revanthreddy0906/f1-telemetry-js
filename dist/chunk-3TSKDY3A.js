import {
  validateTelemetry,
  warnTelemetryIssues
} from "./chunk-HW46UJWW.js";

// src/utils/timeSemantics.ts
var round = (value) => Number(value.toFixed(6));
var normalizeTelemetryTime = (telemetry, options = {}) => {
  const timeReference = options.timeReference ?? telemetry.timeReference ?? "session";
  if (telemetry.time.length === 0) {
    return {
      ...telemetry,
      timeReference
    };
  }
  const baseline = telemetry.time[0];
  const normalizedTime = telemetry.time.map((value) => round(value - baseline));
  const normalizedEvents = telemetry.events?.map((event) => ({
    ...event,
    time: round(event.time - baseline),
    timeReference
  }));
  return {
    ...telemetry,
    time: normalizedTime,
    events: normalizedEvents,
    timeReference
  };
};

// src/utils/formatTelemetry.ts
var TIME_KEYS = ["time", "timestamp", "t", "elapsed", "elapsedTime"];
var SPEED_KEYS = ["speed", "velocity", "v"];
var THROTTLE_KEYS = ["throttle", "throttlePosition"];
var BRAKE_KEYS = ["brake", "brakePressure", "brakePosition"];
var X_KEYS = ["x", "posX", "positionX", "worldX"];
var Y_KEYS = ["y", "posY", "positionY", "worldY"];
var EVENT_TIME_KEYS = ["time", "timestamp", "t", "sessionTime"];
var EVENT_TYPE_KEYS = ["type", "eventType", "event", "kind"];
var EVENT_VALUE_KEYS = ["value", "eventValue", "delta", "severity"];
var EXTRA_CHANNEL_KEY_MAP = {
  gear: ["gear", "nGear", "n_gear"],
  ersDeployment: ["ersDeployment", "ers_deployment", "ers", "ersDeploy"],
  ersHarvest: ["ersHarvest", "ers_harvest", "ersRecovery"],
  batteryLevel: ["batteryLevel", "battery", "battery_level", "soc"],
  airTemp: ["airTemp", "air_temperature", "air_temperature_celsius"],
  trackTemp: ["trackTemp", "track_temperature", "track_temperature_celsius"],
  humidity: ["humidity", "relative_humidity"],
  windSpeed: ["windSpeed", "wind_speed"],
  rainfall: ["rainfall", "rain_intensity", "rain"],
  pressure: ["pressure", "air_pressure"]
};
var toNumber = (value) => {
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
var pickNumber = (point, keys) => {
  for (const key of keys) {
    const value = toNumber(point[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
};
var pickArray = (input, keys) => {
  for (const key of keys) {
    const candidate = input[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }
  return null;
};
var getPointsFromNestedArray = (input) => {
  const containerKeys = ["telemetry", "data", "samples", "points", "records", "lapData"];
  for (const key of containerKeys) {
    const candidate = input[key];
    if (Array.isArray(candidate)) {
      return candidate.filter((entry) => typeof entry === "object" && entry !== null);
    }
  }
  return null;
};
var getPointsFromColumns = (input) => {
  const time = pickArray(input, TIME_KEYS) ?? [];
  const speed = pickArray(input, SPEED_KEYS) ?? [];
  const throttle = pickArray(input, THROTTLE_KEYS) ?? [];
  const brake = pickArray(input, BRAKE_KEYS) ?? [];
  const x = pickArray(input, X_KEYS) ?? [];
  const y = pickArray(input, Y_KEYS) ?? [];
  const extraArrays = Object.fromEntries(
    Object.entries(EXTRA_CHANNEL_KEY_MAP).map(([channel, keys]) => [channel, pickArray(input, keys) ?? []])
  );
  const length = Math.max(
    time.length,
    speed.length,
    throttle.length,
    brake.length,
    x.length,
    y.length,
    ...Object.values(extraArrays).map((series) => series.length)
  );
  return Array.from({ length }, (_, index) => {
    const row = {
      time: time[index] ?? index,
      speed: speed[index] ?? 0,
      throttle: throttle[index] ?? 0,
      brake: brake[index] ?? 0,
      x: x[index] ?? 0,
      y: y[index] ?? 0
    };
    Object.keys(extraArrays).forEach((channel) => {
      row[channel] = extraArrays[channel][index];
    });
    return row;
  });
};
var formatEvent = (entry) => {
  if (typeof entry !== "object" || entry === null) {
    return null;
  }
  const point = entry;
  const type = EVENT_TYPE_KEYS.map((key) => point[key]).find(
    (value2) => typeof value2 === "string" && value2.trim() !== ""
  );
  const time = pickNumber(point, EVENT_TIME_KEYS);
  if (!type || time === null) {
    return null;
  }
  const rawValue = EVENT_VALUE_KEYS.map((key) => point[key]).find((value2) => value2 !== void 0);
  const value = typeof rawValue === "number" || typeof rawValue === "string" || typeof rawValue === "boolean" || rawValue === null ? rawValue : void 0;
  const description = typeof point.description === "string" ? point.description : void 0;
  const metadata = typeof point.metadata === "object" && point.metadata !== null && !Array.isArray(point.metadata) ? point.metadata : void 0;
  return {
    time,
    type,
    value,
    description,
    metadata
  };
};
var getEvents = (input) => {
  if (Array.isArray(input)) {
    return [];
  }
  const directEvents = Array.isArray(input.events) ? input.events : [];
  return directEvents.map(formatEvent).filter((event) => event !== null);
};
var formatTelemetry = (data) => {
  const formatted = {
    time: [],
    speed: [],
    throttle: [],
    brake: [],
    x: [],
    y: [],
    timeReference: "session"
  };
  const extraChannelBuffers = Object.fromEntries(
    Object.keys(EXTRA_CHANNEL_KEY_MAP).map((channel) => [channel, []])
  );
  const hasExtraChannel = Object.fromEntries(
    Object.keys(EXTRA_CHANNEL_KEY_MAP).map((channel) => [channel, false])
  );
  const points = Array.isArray(data) ? data.filter((entry) => typeof entry === "object" && entry !== null) : getPointsFromNestedArray(data) ?? getPointsFromColumns(data);
  points.forEach((point, index) => {
    formatted.time.push(pickNumber(point, TIME_KEYS) ?? index);
    formatted.speed.push(pickNumber(point, SPEED_KEYS) ?? 0);
    formatted.throttle.push(pickNumber(point, THROTTLE_KEYS) ?? 0);
    formatted.brake.push(pickNumber(point, BRAKE_KEYS) ?? 0);
    formatted.x.push(pickNumber(point, X_KEYS) ?? 0);
    formatted.y.push(pickNumber(point, Y_KEYS) ?? 0);
    Object.keys(EXTRA_CHANNEL_KEY_MAP).forEach((channel) => {
      const channelValue = pickNumber(point, EXTRA_CHANNEL_KEY_MAP[channel]);
      if (channelValue !== null) {
        hasExtraChannel[channel] = true;
      }
      extraChannelBuffers[channel].push(channelValue ?? 0);
    });
  });
  const channels = Object.fromEntries(
    Object.keys(EXTRA_CHANNEL_KEY_MAP).filter((channel) => hasExtraChannel[channel]).map((channel) => [channel, extraChannelBuffers[channel]])
  );
  if (Object.keys(channels).length > 0) {
    formatted.channels = channels;
  }
  const events = getEvents(data);
  if (events.length > 0) {
    formatted.events = events;
  }
  const normalized = normalizeTelemetryTime(formatted);
  warnTelemetryIssues(validateTelemetry(normalized, "formatTelemetry"));
  return normalized;
};

// src/adapters/diagnostics.ts
var toDiagnostic = (issue) => ({
  code: issue.code,
  severity: issue.severity,
  message: issue.message,
  field: issue.channel
});
var toAdapterResult = (adapter, telemetry, sourceSamples, options = {}) => {
  const validation = validateTelemetry(telemetry, `${adapter} adapter`, {
    mode: options.validationMode
  });
  const diagnostics = validation.issues.map(toDiagnostic);
  const warningCount = diagnostics.filter((entry) => entry.severity === "warning").length;
  const errorCount = diagnostics.length - warningCount;
  return {
    telemetry,
    validation,
    diagnostics: {
      adapter,
      sourceSamples,
      parsedSamples: telemetry.time.length,
      mode: validation.mode,
      errorCount,
      warningCount,
      diagnostics
    }
  };
};

// src/adapters/csv.ts
var normalizeHeader = (value) => value.trim().toLowerCase();
var HEADER_KEY_MAP = {
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
var detectDelimiter = (row) => {
  if (row.includes("	")) {
    return "	";
  }
  if (row.includes(";")) {
    return ";";
  }
  return ",";
};
var splitCsvRow = (row, delimiter) => {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];
    if (char === '"') {
      if (inQuotes && row[index + 1] === '"') {
        current += '"';
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
var maybeNumber = (value) => {
  if (value === "") {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};
var fromCsvTelemetry = (csv, options = {}) => {
  const rows = csv.split(/\r?\n/).map((row) => row.trim()).filter((row) => row.length > 0);
  if (rows.length === 0) {
    return formatTelemetry([]);
  }
  const delimiter = options.delimiter ?? detectDelimiter(rows[0]);
  const hasHeader = options.hasHeader ?? true;
  const rawHeaders = hasHeader ? splitCsvRow(rows[0], delimiter) : ["time", "speed", "throttle", "brake", "x", "y"];
  const headers = rawHeaders.map((header) => HEADER_KEY_MAP[normalizeHeader(header)] ?? normalizeHeader(header));
  const startIndex = hasHeader ? 1 : 0;
  const points = [];
  for (let rowIndex = startIndex; rowIndex < rows.length; rowIndex += 1) {
    const columns = splitCsvRow(rows[rowIndex], delimiter);
    const point = {};
    headers.forEach((header, columnIndex) => {
      const value = columns[columnIndex] ?? "";
      point[header] = maybeNumber(value);
    });
    points.push(point);
  }
  return formatTelemetry(points);
};
var fromCsvTelemetryWithDiagnostics = (csv, options = {}) => {
  const telemetry = fromCsvTelemetry(csv, options);
  const sourceSamples = csv.split(/\r?\n/).map((row) => row.trim()).filter((row) => row.length > 0).length - (options.hasHeader ?? true ? 1 : 0);
  return toAdapterResult("csv", telemetry, Math.max(sourceSamples, 0), options);
};

export {
  normalizeTelemetryTime,
  formatTelemetry,
  toAdapterResult,
  fromCsvTelemetry,
  fromCsvTelemetryWithDiagnostics
};
//# sourceMappingURL=chunk-3TSKDY3A.js.map