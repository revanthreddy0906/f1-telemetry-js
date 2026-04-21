"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/adapters-entry.ts
var adapters_entry_exports = {};
__export(adapters_entry_exports, {
  fetchOpenF1Drivers: () => fetchOpenF1Drivers,
  fetchOpenF1Sessions: () => fetchOpenF1Sessions,
  fetchOpenF1Telemetry: () => fetchOpenF1Telemetry,
  fetchOpenF1TelemetryWithDiagnostics: () => fetchOpenF1TelemetryWithDiagnostics,
  fromCsvTelemetry: () => fromCsvTelemetry,
  fromCsvTelemetryWithDiagnostics: () => fromCsvTelemetryWithDiagnostics,
  fromErgastApi: () => fromErgastApi,
  fromFastF1Telemetry: () => fromFastF1Telemetry,
  fromFastF1TelemetryWithDiagnostics: () => fromFastF1TelemetryWithDiagnostics,
  fromJsonTelemetry: () => fromJsonTelemetry,
  fromJsonTelemetryWithDiagnostics: () => fromJsonTelemetryWithDiagnostics,
  fromMultiViewerCarData: () => fromMultiViewerCarData,
  fromMultiViewerCarDataWithDiagnostics: () => fromMultiViewerCarDataWithDiagnostics,
  fromMultiViewerTiming: () => fromMultiViewerTiming,
  fromOpenF1Telemetry: () => fromOpenF1Telemetry,
  fromOpenF1TelemetryWithDiagnostics: () => fromOpenF1TelemetryWithDiagnostics,
  fromParquet: () => fromParquet,
  fromParquetWithDiagnostics: () => fromParquetWithDiagnostics
});
module.exports = __toCommonJS(adapters_entry_exports);

// src/utils/validation.ts
var nodeProcess = globalThis.process;
var isProduction = nodeProcess?.env?.NODE_ENV === "production";
var warn = (message) => {
  if (!isProduction && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
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
    y: []
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
  warnTelemetryIssues(validateTelemetry(formatted, "formatTelemetry"));
  return formatted;
};

// src/adapters/shared.ts
var toNumber2 = (value) => {
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
var parseClockLikeTime = (value) => {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }
  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return Number(normalized);
  }
  const dayMatch = normalized.match(/(\d+)\s+days?\s+(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (dayMatch) {
    const [, days, hours, minutes, seconds] = dayMatch;
    return Number(days) * 86400 + Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }
  const segments = normalized.split(":");
  if (segments.length === 3) {
    return Number(segments[0]) * 3600 + Number(segments[1]) * 60 + Number(segments[2]);
  }
  if (segments.length === 2) {
    return Number(segments[0]) * 60 + Number(segments[1]);
  }
  return null;
};
var toSeconds = (value) => {
  const direct = toNumber2(value);
  if (direct !== null) {
    return direct;
  }
  if (value instanceof Date) {
    return value.getTime() / 1e3;
  }
  if (typeof value === "string") {
    const clock = parseClockLikeTime(value);
    if (clock !== null && Number.isFinite(clock)) {
      return clock;
    }
    const dateTimestamp = Date.parse(value);
    if (Number.isFinite(dateTimestamp)) {
      return dateTimestamp / 1e3;
    }
  }
  return null;
};
var pickField = (point, keys) => {
  for (const key of keys) {
    if (key in point) {
      return point[key];
    }
  }
  return void 0;
};
var parseLapTimeString = (timeStr) => {
  const normalized = timeStr.trim();
  if (!normalized) {
    return null;
  }
  const segments = normalized.split(":");
  if (segments.length === 2) {
    const minutes = Number(segments[0]);
    const seconds = Number(segments[1]);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
      return null;
    }
    return minutes * 60 + seconds;
  }
  if (segments.length === 3) {
    const hours = Number(segments[0]);
    const minutes = Number(segments[1]);
    const seconds = Number(segments[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
      return null;
    }
    return hours * 3600 + minutes * 60 + seconds;
  }
  return null;
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

// src/adapters/fastf1.ts
var TIME_KEYS2 = ["SessionTime", "Time", "time", "timestamp"];
var SPEED_KEYS2 = ["Speed", "speed"];
var THROTTLE_KEYS2 = ["Throttle", "throttle"];
var BRAKE_KEYS2 = ["Brake", "brake"];
var X_KEYS2 = ["X", "x", "PositionX", "posX"];
var Y_KEYS2 = ["Y", "y", "PositionY", "posY"];
var GEAR_KEYS = ["nGear", "NGear", "gear"];
var ERS_DEPLOYMENT_KEYS = ["ERSDeploy", "ERSDeployment", "ersDeployment"];
var ERS_HARVEST_KEYS = ["ERSHarvest", "ersHarvest"];
var BATTERY_LEVEL_KEYS = ["BatteryLevel", "batteryLevel", "soc"];
var fromPoints = (points) => {
  const normalized = points.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS2)) ?? index,
    speed: toNumber2(pickField(point, SPEED_KEYS2)) ?? 0,
    throttle: toNumber2(pickField(point, THROTTLE_KEYS2)) ?? 0,
    brake: toNumber2(pickField(point, BRAKE_KEYS2)) ?? 0,
    x: toNumber2(pickField(point, X_KEYS2)) ?? 0,
    y: toNumber2(pickField(point, Y_KEYS2)) ?? 0,
    gear: toNumber2(pickField(point, GEAR_KEYS)) ?? void 0,
    ersDeployment: toNumber2(pickField(point, ERS_DEPLOYMENT_KEYS)) ?? void 0,
    ersHarvest: toNumber2(pickField(point, ERS_HARVEST_KEYS)) ?? void 0,
    batteryLevel: toNumber2(pickField(point, BATTERY_LEVEL_KEYS)) ?? void 0
  }));
  return formatTelemetry(normalized);
};
var fromFastF1Telemetry = (input) => {
  if (Array.isArray(input)) {
    return fromPoints(input);
  }
  if ("records" in input && Array.isArray(input.records)) {
    return fromPoints(input.records);
  }
  if ("telemetry" in input && Array.isArray(input.telemetry)) {
    return fromPoints(input.telemetry);
  }
  return formatTelemetry({
    time: input.SessionTime ?? input.Time ?? input.time,
    speed: input.Speed ?? input.speed,
    throttle: input.Throttle ?? input.throttle,
    brake: input.Brake ?? input.brake,
    x: input.X ?? input.x,
    y: input.Y ?? input.y,
    gear: input.nGear ?? input.NGear ?? input.gear,
    ersDeployment: input.ERSDeploy ?? input.ERSDeployment ?? input.ersDeployment,
    ersHarvest: input.ERSHarvest ?? input.ersHarvest,
    batteryLevel: input.BatteryLevel ?? input.batteryLevel ?? input.soc
  });
};
var fromFastF1TelemetryWithDiagnostics = (input, options = {}) => {
  const telemetry = fromFastF1Telemetry(input);
  const sourceSamples = Array.isArray(input) ? input.length : Array.isArray(input.records) ? input.records.length : Array.isArray(input.telemetry) ? input.telemetry.length : telemetry.time.length;
  return toAdapterResult("fastf1", telemetry, sourceSamples, options);
};

// src/adapters/openf1.ts
var TIME_KEYS3 = ["session_time", "date", "time", "timestamp", "time_seconds"];
var SPEED_KEYS3 = ["speed", "speed_kmh"];
var THROTTLE_KEYS3 = ["throttle", "throttle_percentage"];
var BRAKE_KEYS3 = ["brake", "brake_percentage"];
var X_KEYS3 = ["x", "position_x", "world_x"];
var Y_KEYS3 = ["y", "position_y", "world_y"];
var GEAR_KEYS2 = ["n_gear", "nGear", "gear"];
var AIR_TEMP_KEYS = ["air_temperature", "airTemp"];
var TRACK_TEMP_KEYS = ["track_temperature", "trackTemp"];
var HUMIDITY_KEYS = ["humidity"];
var WIND_SPEED_KEYS = ["wind_speed", "windSpeed"];
var RAINFALL_KEYS = ["rainfall", "rain_intensity"];
var PRESSURE_KEYS = ["air_pressure", "pressure"];
var fromOpenF1Telemetry = (input) => {
  const points = input.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS3)) ?? index,
    speed: toNumber2(pickField(point, SPEED_KEYS3)) ?? 0,
    throttle: toNumber2(pickField(point, THROTTLE_KEYS3)) ?? 0,
    brake: toNumber2(pickField(point, BRAKE_KEYS3)) ?? 0,
    x: toNumber2(pickField(point, X_KEYS3)) ?? 0,
    y: toNumber2(pickField(point, Y_KEYS3)) ?? 0,
    gear: toNumber2(pickField(point, GEAR_KEYS2)) ?? void 0,
    airTemp: toNumber2(pickField(point, AIR_TEMP_KEYS)) ?? void 0,
    trackTemp: toNumber2(pickField(point, TRACK_TEMP_KEYS)) ?? void 0,
    humidity: toNumber2(pickField(point, HUMIDITY_KEYS)) ?? void 0,
    windSpeed: toNumber2(pickField(point, WIND_SPEED_KEYS)) ?? void 0,
    rainfall: toNumber2(pickField(point, RAINFALL_KEYS)) ?? void 0,
    pressure: toNumber2(pickField(point, PRESSURE_KEYS)) ?? void 0
  }));
  return formatTelemetry(points);
};
var fromOpenF1TelemetryWithDiagnostics = (input, options = {}) => toAdapterResult("openf1", fromOpenF1Telemetry(input), input.length, options);

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

// src/adapters/ergast.ts
var asRequiredNumber = (value) => toNumber2(value) ?? 0;
var fromErgastApi = (data) => {
  const results = (data.Results ?? []).map((result) => {
    const fastestLapTime = result.FastestLap?.Time?.time ? parseLapTimeString(result.FastestLap.Time.time) ?? void 0 : void 0;
    return {
      driver: result.Driver.code,
      driverFullName: `${result.Driver.givenName} ${result.Driver.familyName}`.trim(),
      team: result.Constructor.name,
      position: asRequiredNumber(result.position),
      gridPosition: asRequiredNumber(result.grid),
      points: asRequiredNumber(result.points),
      lapsCompleted: asRequiredNumber(result.laps),
      status: result.status,
      totalTimeMs: toNumber2(result.Time?.millis) ?? void 0,
      fastestLapTime,
      fastestLapNumber: toNumber2(result.FastestLap?.lap) ?? void 0,
      fastestLapRank: toNumber2(result.FastestLap?.rank) ?? void 0,
      averageSpeedKmh: toNumber2(result.FastestLap?.AverageSpeed?.speed) ?? void 0
    };
  });
  const driverIdToCode = /* @__PURE__ */ new Map();
  (data.Results ?? []).forEach((result) => {
    driverIdToCode.set(result.Driver.driverId, result.Driver.code);
  });
  const lapMap = /* @__PURE__ */ new Map();
  (data.Laps ?? []).forEach((lap) => {
    const lapNumber = asRequiredNumber(lap.number);
    lap.Timings.forEach((timing) => {
      const parsedLapTime = parseLapTimeString(timing.time);
      if (!Number.isFinite(parsedLapTime)) {
        return;
      }
      const driverCode = driverIdToCode.get(timing.driverId) ?? timing.driverId.toUpperCase();
      const current = lapMap.get(driverCode) ?? [];
      current.push({
        lap: lapNumber,
        position: asRequiredNumber(timing.position),
        time: parsedLapTime
      });
      lapMap.set(driverCode, current);
    });
  });
  const lapTimes = Array.from(lapMap.entries()).map(([driver, laps]) => ({
    driver,
    laps: laps.sort((left, right) => left.lap - right.lap)
  })).sort((left, right) => left.driver.localeCompare(right.driver));
  return {
    raceName: data.raceName,
    round: asRequiredNumber(data.round),
    circuit: {
      id: data.Circuit.circuitId,
      name: data.Circuit.circuitName,
      lat: asRequiredNumber(data.Circuit.Location.lat),
      lng: asRequiredNumber(data.Circuit.Location.long),
      locality: data.Circuit.Location.locality,
      country: data.Circuit.Location.country
    },
    results,
    lapTimes
  };
};

// src/adapters/multiviewer.ts
var parseGap = (gap) => {
  if (!gap) {
    return null;
  }
  const normalized = gap.trim();
  if (!normalized || /lap/i.test(normalized)) {
    return null;
  }
  const parsed = toNumber2(normalized.replace(/^\+/, ""));
  return parsed ?? null;
};
var fromMultiViewerCarData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return formatTelemetry([]);
  }
  const sorted = [...data].sort(
    (left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp)
  );
  const start = Date.parse(sorted[0].timestamp);
  const points = sorted.map((entry, index) => {
    const brakeValue = typeof entry.channels.brake === "boolean" ? entry.channels.brake ? 100 : 0 : entry.channels.brake;
    return {
      time: Number.isFinite(start) ? (Date.parse(entry.timestamp) - start) / 1e3 : index,
      speed: toNumber2(entry.channels.speed) ?? 0,
      throttle: toNumber2(entry.channels.throttle) ?? 0,
      brake: toNumber2(brakeValue) ?? 0,
      x: toNumber2(entry.position?.x) ?? 0,
      y: toNumber2(entry.position?.y) ?? 0,
      gear: toNumber2(entry.channels.gear) ?? void 0
    };
  });
  return formatTelemetry(points);
};
var fromMultiViewerCarDataWithDiagnostics = (data, options = {}) => toAdapterResult("multiviewer", fromMultiViewerCarData(data), data.length, options);
var fromMultiViewerTiming = (data) => data.map((entry) => ({
  driverNumber: entry.driverNumber,
  driverCode: entry.driverCode,
  position: entry.position,
  gapToLeader: parseGap(entry.gapToLeader),
  lastLapTime: entry.lastLapTime ? parseLapTimeString(entry.lastLapTime) : null,
  bestLapTime: entry.bestLapTime ? parseLapTimeString(entry.bestLapTime) : null,
  sectors: [
    entry.sector1 ? parseLapTimeString(entry.sector1) : null,
    entry.sector2 ? parseLapTimeString(entry.sector2) : null,
    entry.sector3 ? parseLapTimeString(entry.sector3) : null
  ],
  tyreCompound: entry.tyreCompound ?? null,
  tyreAge: toNumber2(entry.tyreAge) ?? null
}));

// src/adapters/json.ts
var DEFAULT_FIELD_MAPPING = {
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
var resolvePath = (obj, path) => path.split(".").reduce(
  (current, key) => current && typeof current === "object" ? current[key] : void 0,
  obj
);
var mapField = (mapping) => ({
  ...DEFAULT_FIELD_MAPPING,
  ...mapping
});
var warn2 = (message) => {
  const nodeProcess2 = globalThis.process;
  if (nodeProcess2?.env?.NODE_ENV !== "production" && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
};
var isColumnOriented = (value) => !!value && typeof value === "object" && !Array.isArray(value) && Object.values(value).some((entry) => Array.isArray(entry));
var fromJsonTelemetry = (input, options = {}) => {
  const fields = mapField(options.fieldMapping);
  const source = Array.isArray(input) ? input : options.dataPath ? resolvePath(input, options.dataPath) : input;
  if (options.dataPath && !Array.isArray(input) && source === void 0) {
    warn2(`fromJsonTelemetry: dataPath "${options.dataPath}" was not found.`);
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
      };
    });
    const telemetryData = options.eventsPath && !Array.isArray(input) ? {
      telemetry: rows,
      events: resolvePath(input, options.eventsPath)
    } : rows;
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
    const telemetryData = options.eventsPath && !Array.isArray(input) ? {
      ...telemetryColumns,
      events: resolvePath(input, options.eventsPath)
    } : telemetryColumns;
    return formatTelemetry(telemetryData);
  }
  warn2("fromJsonTelemetry: input did not resolve to telemetry rows or columns.");
  return formatTelemetry([]);
};
var fromJsonTelemetryWithDiagnostics = (input, options = {}) => {
  const source = Array.isArray(input) ? input : options.dataPath ? resolvePath(input, options.dataPath) : input;
  const sourceSamples = Array.isArray(source) ? source.length : isColumnOriented(source) ? Math.max(
    0,
    ...Object.values(source).map((entry) => Array.isArray(entry) ? entry.length : 0)
  ) : 0;
  const telemetry = fromJsonTelemetry(input, options);
  return toAdapterResult("json", telemetry, sourceSamples, options);
};

// src/adapters/parquet.ts
var DEFAULT_PARQUET_MAPPING = {
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
var fromParquet = (rows, options = {}) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return formatTelemetry([]);
  }
  if (!options.fieldMapping) {
    return fromFastF1Telemetry(rows);
  }
  const mapping = { ...DEFAULT_PARQUET_MAPPING, ...options.fieldMapping };
  const remapped = rows.map(
    (row) => ({
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
var fromParquetWithDiagnostics = (rows, options = {}) => toAdapterResult("parquet", fromParquet(rows, options), rows.length, options);

// src/adapters/fetchOpenF1.ts
var DEFAULT_OPEN_F1_BASE_URL = "https://api.openf1.org/v1";
var buildUrl = (baseUrl, path, query) => {
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
};
var fetchJson = async (url, options) => {
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};
var fetchOpenF1Telemetry = async (sessionKey, driverNumber, options = {}) => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "car_data", {
    session_key: sessionKey,
    driver_number: driverNumber
  });
  const data = await fetchJson(url, options);
  return fromOpenF1Telemetry(data ?? []);
};
var fetchOpenF1TelemetryWithDiagnostics = async (sessionKey, driverNumber, options = {}) => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "car_data", {
    session_key: sessionKey,
    driver_number: driverNumber
  });
  const data = await fetchJson(url, options);
  const telemetry = fromOpenF1Telemetry(data ?? []);
  return toAdapterResult("openf1-fetch", telemetry, (data ?? []).length, options);
};
var fetchOpenF1Sessions = async (year = (/* @__PURE__ */ new Date()).getUTCFullYear(), options = {}) => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "sessions", { year });
  const payload = await fetchJson(url, options);
  return (payload ?? []).map((entry) => ({
    sessionKey: Number(entry.session_key ?? entry.sessionKey ?? 0),
    sessionName: String(entry.session_name ?? entry.sessionName ?? ""),
    sessionType: String(entry.session_type ?? entry.sessionType ?? ""),
    circuitShortName: String(entry.circuit_short_name ?? entry.circuitShortName ?? ""),
    dateStart: String(entry.date_start ?? entry.dateStart ?? ""),
    dateEnd: String(entry.date_end ?? entry.dateEnd ?? ""),
    year: Number(entry.year ?? 0)
  }));
};
var fetchOpenF1Drivers = async (sessionKey, options = {}) => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "drivers", { session_key: sessionKey });
  const payload = await fetchJson(url, options);
  return (payload ?? []).map((entry) => ({
    driverNumber: Number(entry.driver_number ?? entry.driverNumber ?? 0),
    fullName: String(entry.full_name ?? entry.fullName ?? ""),
    nameAcronym: String(entry.name_acronym ?? entry.nameAcronym ?? ""),
    teamName: String(entry.team_name ?? entry.teamName ?? ""),
    teamColour: String(entry.team_colour ?? entry.teamColour ?? "")
  }));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchOpenF1Drivers,
  fetchOpenF1Sessions,
  fetchOpenF1Telemetry,
  fetchOpenF1TelemetryWithDiagnostics,
  fromCsvTelemetry,
  fromCsvTelemetryWithDiagnostics,
  fromErgastApi,
  fromFastF1Telemetry,
  fromFastF1TelemetryWithDiagnostics,
  fromJsonTelemetry,
  fromJsonTelemetryWithDiagnostics,
  fromMultiViewerCarData,
  fromMultiViewerCarDataWithDiagnostics,
  fromMultiViewerTiming,
  fromOpenF1Telemetry,
  fromOpenF1TelemetryWithDiagnostics,
  fromParquet,
  fromParquetWithDiagnostics
});
//# sourceMappingURL=adapters.cjs.map