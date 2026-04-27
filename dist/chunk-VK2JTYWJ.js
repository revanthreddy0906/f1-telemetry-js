import {
  formatTelemetry,
  toAdapterResult
} from "./chunk-3TSKDY3A.js";

// src/adapters/shared.ts
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
  const direct = toNumber(value);
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

// src/adapters/fastf1.ts
var TIME_KEYS = ["SessionTime", "Time", "time", "timestamp"];
var SPEED_KEYS = ["Speed", "speed"];
var THROTTLE_KEYS = ["Throttle", "throttle"];
var BRAKE_KEYS = ["Brake", "brake"];
var X_KEYS = ["X", "x", "PositionX", "posX"];
var Y_KEYS = ["Y", "y", "PositionY", "posY"];
var GEAR_KEYS = ["nGear", "NGear", "gear"];
var ERS_DEPLOYMENT_KEYS = ["ERSDeploy", "ERSDeployment", "ersDeployment"];
var ERS_HARVEST_KEYS = ["ERSHarvest", "ersHarvest"];
var BATTERY_LEVEL_KEYS = ["BatteryLevel", "batteryLevel", "soc"];
var fromPoints = (points) => {
  const normalized = points.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS)) ?? 0,
    x: toNumber(pickField(point, X_KEYS)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS)) ?? 0,
    gear: toNumber(pickField(point, GEAR_KEYS)) ?? void 0,
    ersDeployment: toNumber(pickField(point, ERS_DEPLOYMENT_KEYS)) ?? void 0,
    ersHarvest: toNumber(pickField(point, ERS_HARVEST_KEYS)) ?? void 0,
    batteryLevel: toNumber(pickField(point, BATTERY_LEVEL_KEYS)) ?? void 0
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
var TIME_KEYS2 = ["session_time", "date", "time", "timestamp", "time_seconds"];
var SPEED_KEYS2 = ["speed", "speed_kmh"];
var THROTTLE_KEYS2 = ["throttle", "throttle_percentage"];
var BRAKE_KEYS2 = ["brake", "brake_percentage"];
var X_KEYS2 = ["x", "position_x", "world_x"];
var Y_KEYS2 = ["y", "position_y", "world_y"];
var GEAR_KEYS2 = ["n_gear", "nGear", "gear"];
var AIR_TEMP_KEYS = ["air_temperature", "airTemp"];
var TRACK_TEMP_KEYS = ["track_temperature", "trackTemp"];
var HUMIDITY_KEYS = ["humidity"];
var WIND_SPEED_KEYS = ["wind_speed", "windSpeed"];
var RAINFALL_KEYS = ["rainfall", "rain_intensity"];
var PRESSURE_KEYS = ["air_pressure", "pressure"];
var fromOpenF1Telemetry = (input) => {
  const points = input.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS2)) ?? index,
    speed: toNumber(pickField(point, SPEED_KEYS2)) ?? 0,
    throttle: toNumber(pickField(point, THROTTLE_KEYS2)) ?? 0,
    brake: toNumber(pickField(point, BRAKE_KEYS2)) ?? 0,
    x: toNumber(pickField(point, X_KEYS2)) ?? 0,
    y: toNumber(pickField(point, Y_KEYS2)) ?? 0,
    gear: toNumber(pickField(point, GEAR_KEYS2)) ?? void 0,
    airTemp: toNumber(pickField(point, AIR_TEMP_KEYS)) ?? void 0,
    trackTemp: toNumber(pickField(point, TRACK_TEMP_KEYS)) ?? void 0,
    humidity: toNumber(pickField(point, HUMIDITY_KEYS)) ?? void 0,
    windSpeed: toNumber(pickField(point, WIND_SPEED_KEYS)) ?? void 0,
    rainfall: toNumber(pickField(point, RAINFALL_KEYS)) ?? void 0,
    pressure: toNumber(pickField(point, PRESSURE_KEYS)) ?? void 0
  }));
  return formatTelemetry(points);
};
var fromOpenF1TelemetryWithDiagnostics = (input, options = {}) => toAdapterResult("openf1", fromOpenF1Telemetry(input), input.length, options);

// src/adapters/ergast.ts
var asRequiredNumber = (value) => toNumber(value) ?? 0;
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
      totalTimeMs: toNumber(result.Time?.millis) ?? void 0,
      fastestLapTime,
      fastestLapNumber: toNumber(result.FastestLap?.lap) ?? void 0,
      fastestLapRank: toNumber(result.FastestLap?.rank) ?? void 0,
      averageSpeedKmh: toNumber(result.FastestLap?.AverageSpeed?.speed) ?? void 0
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
  const parsed = toNumber(normalized.replace(/^\+/, ""));
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
      speed: toNumber(entry.channels.speed) ?? 0,
      throttle: toNumber(entry.channels.throttle) ?? 0,
      brake: toNumber(brakeValue) ?? 0,
      x: toNumber(entry.position?.x) ?? 0,
      y: toNumber(entry.position?.y) ?? 0,
      gear: toNumber(entry.channels.gear) ?? void 0
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
  tyreAge: toNumber(entry.tyreAge) ?? null
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
var warn = (message) => {
  const nodeProcess = globalThis.process;
  if (nodeProcess?.env?.NODE_ENV !== "production" && typeof console !== "undefined") {
    console.warn(`[f1-telemetry-js] ${message}`);
  }
};
var isColumnOriented = (value) => !!value && typeof value === "object" && !Array.isArray(value) && Object.values(value).some((entry) => Array.isArray(entry));
var fromJsonTelemetry = (input, options = {}) => {
  const fields = mapField(options.fieldMapping);
  const source = Array.isArray(input) ? input : options.dataPath ? resolvePath(input, options.dataPath) : input;
  if (options.dataPath && !Array.isArray(input) && source === void 0) {
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
  warn("fromJsonTelemetry: input did not resolve to telemetry rows or columns.");
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

export {
  fromFastF1Telemetry,
  fromFastF1TelemetryWithDiagnostics,
  fromOpenF1Telemetry,
  fromOpenF1TelemetryWithDiagnostics,
  fromErgastApi,
  fromMultiViewerCarData,
  fromMultiViewerCarDataWithDiagnostics,
  fromMultiViewerTiming,
  fromJsonTelemetry,
  fromJsonTelemetryWithDiagnostics,
  fromParquet,
  fromParquetWithDiagnostics,
  fetchOpenF1Telemetry,
  fetchOpenF1TelemetryWithDiagnostics,
  fetchOpenF1Sessions,
  fetchOpenF1Drivers
};
//# sourceMappingURL=chunk-VK2JTYWJ.js.map