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
var validateTelemetry = (telemetry, context = "Telemetry") => {
  const requiredKeys = ["time", "speed", "throttle", "brake", "x", "y"];
  const issues = [];
  const lengths = [];
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
var warnTelemetryIssues = (validation) => {
  if (!validation.isValid) {
    validation.issues.forEach((issue) => warn(issue.message));
  }
};

// src/utils/processing.ts
var applyWindow = (time, seriesMap, processing) => {
  const start = processing?.window?.startTime ?? Number.NEGATIVE_INFINITY;
  const end = processing?.window?.endTime ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(start) && !Number.isFinite(end)) {
    return { time, seriesMap };
  }
  const selectedIndices = [];
  time.forEach((value, index) => {
    if (value >= start && value <= end) {
      selectedIndices.push(index);
    }
  });
  if (selectedIndices.length === 0) {
    return {
      time: [],
      seriesMap: Object.fromEntries(Object.keys(seriesMap).map((key) => [key, []]))
    };
  }
  return {
    time: selectedIndices.map((index) => time[index]),
    seriesMap: Object.fromEntries(
      Object.entries(seriesMap).map(([key, series]) => [key, selectedIndices.map((index) => series[index])])
    )
  };
};
var uniqueSorted = (indices) => [...new Set(indices)].sort((a, b) => a - b);
var pickByIndices = (values, indices) => indices.map((index) => values[index]);
var downsampleEveryNth = (length, maxPoints) => {
  if (length <= maxPoints) {
    return Array.from({ length }, (_, index) => index);
  }
  const step = Math.ceil(length / maxPoints);
  const indices = [0];
  for (let index = step; index < length - 1; index += step) {
    indices.push(index);
  }
  indices.push(length - 1);
  return uniqueSorted(indices);
};
var downsampleMinMax = (basis, maxPoints) => {
  if (basis.length <= maxPoints || maxPoints < 4) {
    return downsampleEveryNth(basis.length, maxPoints);
  }
  const targetBuckets = maxPoints - 2;
  const bucketSize = (basis.length - 2) / targetBuckets;
  const indices = [0];
  for (let bucket = 0; bucket < targetBuckets; bucket += 1) {
    const start = 1 + Math.floor(bucket * bucketSize);
    const endExclusive = Math.min(1 + Math.floor((bucket + 1) * bucketSize), basis.length - 1);
    if (start >= endExclusive) {
      continue;
    }
    let minIndex = start;
    let maxIndex = start;
    for (let index = start + 1; index < endExclusive; index += 1) {
      if (basis[index] < basis[minIndex]) {
        minIndex = index;
      }
      if (basis[index] > basis[maxIndex]) {
        maxIndex = index;
      }
    }
    indices.push(minIndex, maxIndex);
  }
  indices.push(basis.length - 1);
  const deduped = uniqueSorted(indices);
  if (deduped.length > maxPoints) {
    return downsampleEveryNth(deduped.length, maxPoints).map((index) => deduped[index]);
  }
  return deduped;
};
var applyDownsampling = (time, seriesMap, processing) => {
  const maxPoints = processing?.maxPoints;
  if (typeof maxPoints !== "number" || maxPoints < 2 || time.length <= maxPoints) {
    return { time, seriesMap };
  }
  const basisKey = Object.keys(seriesMap)[0];
  const basisSeries = basisKey ? seriesMap[basisKey] : time;
  const indices = processing?.downsampleStrategy === "min-max" ? downsampleMinMax(basisSeries, maxPoints) : downsampleEveryNth(time.length, maxPoints);
  return {
    time: pickByIndices(time, indices),
    seriesMap: Object.fromEntries(
      Object.entries(seriesMap).map(([key, series]) => [key, pickByIndices(series, indices)])
    )
  };
};
var processSeriesData = ({
  context,
  time,
  seriesMap,
  processing
}) => {
  const sanitizedTime = sanitizeNumericArray(time, `${context}.time`);
  const sanitizedSeries = Object.fromEntries(
    Object.entries(seriesMap).map(([key, values]) => [key, sanitizeNumericArray(values, `${context}.${key}`)])
  );
  const aligned = alignSeriesLengths(context, sanitizedTime, sanitizedSeries);
  const windowed = applyWindow(aligned.time, aligned.seriesMap, processing);
  const downsampled = applyDownsampling(windowed.time, windowed.seriesMap, processing);
  return {
    time: downsampled.time,
    seriesMap: downsampled.seriesMap
  };
};
var findNearestIndex = (values, target) => {
  if (target === null || target === void 0 || values.length === 0) {
    return -1;
  }
  let nearestIndex = 0;
  let nearestDistance = Math.abs(values[0] - target);
  for (let index = 1; index < values.length; index += 1) {
    const distance = Math.abs(values[index] - target);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }
  return nearestIndex;
};

// src/utils/formatTelemetry.ts
var TIME_KEYS = ["time", "timestamp", "t", "elapsed", "elapsedTime"];
var SPEED_KEYS = ["speed", "velocity", "v"];
var THROTTLE_KEYS = ["throttle", "throttlePosition"];
var BRAKE_KEYS = ["brake", "brakePressure", "brakePosition"];
var X_KEYS = ["x", "posX", "positionX", "worldX"];
var Y_KEYS = ["y", "posY", "positionY", "worldY"];
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
  const length = Math.max(time.length, speed.length, throttle.length, brake.length, x.length, y.length);
  return Array.from({ length }, (_, index) => ({
    time: time[index] ?? index,
    speed: speed[index] ?? 0,
    throttle: throttle[index] ?? 0,
    brake: brake[index] ?? 0,
    x: x[index] ?? 0,
    y: y[index] ?? 0
  }));
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
  const points = Array.isArray(data) ? data.filter((entry) => typeof entry === "object" && entry !== null) : getPointsFromNestedArray(data) ?? getPointsFromColumns(data);
  points.forEach((point, index) => {
    formatted.time.push(pickNumber(point, TIME_KEYS) ?? index);
    formatted.speed.push(pickNumber(point, SPEED_KEYS) ?? 0);
    formatted.throttle.push(pickNumber(point, THROTTLE_KEYS) ?? 0);
    formatted.brake.push(pickNumber(point, BRAKE_KEYS) ?? 0);
    formatted.x.push(pickNumber(point, X_KEYS) ?? 0);
    formatted.y.push(pickNumber(point, Y_KEYS) ?? 0);
  });
  warnTelemetryIssues(validateTelemetry(formatted, "formatTelemetry"));
  return formatted;
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

// src/utils/computations.ts
var cloneEmptyTelemetry = () => ({
  time: [],
  speed: [],
  throttle: [],
  brake: [],
  x: [],
  y: []
});
var sanitizeTelemetry = (telemetry, context) => {
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
var cumulativeDistance = (x, y) => {
  if (x.length === 0 || y.length === 0) {
    return [];
  }
  const length = Math.min(x.length, y.length);
  const distances = new Array(length).fill(0);
  for (let index = 1; index < length; index += 1) {
    const dx = x[index] - x[index - 1];
    const dy = y[index] - y[index - 1];
    const segment = Math.hypot(dx, dy);
    distances[index] = distances[index - 1] + (Number.isFinite(segment) ? segment : 0);
  }
  return distances;
};
var averageStep = (values) => {
  if (values.length < 2) {
    return 0;
  }
  let sum = 0;
  let count = 0;
  for (let index = 1; index < values.length; index += 1) {
    const delta = values[index] - values[index - 1];
    if (delta > 0 && Number.isFinite(delta)) {
      sum += delta;
      count += 1;
    }
  }
  return count > 0 ? sum / count : 0;
};
var lerp = (x0, y0, x1, y1, x) => y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
var interpolateMonotonicSeries = (base, values, target) => {
  if (base.length < 2 || values.length < 2) {
    return null;
  }
  if (target < base[0] || target > base[base.length - 1]) {
    return null;
  }
  let left = 0;
  let right = base.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const candidate = base[middle];
    if (candidate === target) {
      return values[middle];
    }
    if (candidate < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  const upper = Math.max(1, left);
  const lower = Math.max(0, upper - 1);
  const x0 = base[lower];
  const x1 = base[upper];
  const y0 = values[lower];
  const y1 = values[upper];
  if (x1 === x0) {
    return y0;
  }
  return lerp(x0, y0, x1, y1, target);
};
var sortTelemetryByTime = (telemetry, context) => {
  const sanitized = sanitizeTelemetry(telemetry, context);
  const entries = sanitized.time.map((time, index) => ({
    time,
    speed: sanitized.speed[index],
    throttle: sanitized.throttle[index],
    brake: sanitized.brake[index],
    x: sanitized.x[index],
    y: sanitized.y[index]
  }));
  entries.sort((left, right) => left.time - right.time);
  const unique = entries.filter((entry, index) => index === 0 || entry.time !== entries[index - 1].time);
  return {
    time: unique.map((entry) => entry.time),
    speed: unique.map((entry) => entry.speed),
    throttle: unique.map((entry) => entry.throttle),
    brake: unique.map((entry) => entry.brake),
    x: unique.map((entry) => entry.x),
    y: unique.map((entry) => entry.y)
  };
};
var normalizeDistance = (telemetry) => {
  const sanitized = sanitizeTelemetry(telemetry, "normalizeDistance");
  if (sanitized.time.length === 0) {
    return cloneEmptyTelemetry();
  }
  return {
    ...sanitized,
    time: cumulativeDistance(sanitized.x, sanitized.y)
  };
};
var computeLapTimes = (telemetry, lapBoundaries) => {
  const sanitized = sanitizeTelemetry(telemetry, "computeLapTimes");
  if (sanitized.time.length === 0) {
    return [];
  }
  const createLapTimesFromBoundaries = (boundaries2) => {
    if (boundaries2.length < 2) {
      return [];
    }
    const laps = [];
    for (let index = 0; index < boundaries2.length - 1; index += 1) {
      const startTime = boundaries2[index];
      const endTime = boundaries2[index + 1];
      const duration = endTime - startTime;
      if (!Number.isFinite(duration) || duration <= 0) {
        continue;
      }
      laps.push({
        lap: laps.length + 1,
        startTime,
        endTime,
        duration
      });
    }
    return laps;
  };
  if (Array.isArray(lapBoundaries)) {
    const boundaries2 = sanitizeNumericArray(lapBoundaries, "computeLapTimes.lapBoundaries").sort((left, right) => left - right);
    return createLapTimesFromBoundaries(boundaries2);
  }
  if (sanitized.x.length < 2 || sanitized.y.length < 2) {
    return [];
  }
  const startX = sanitized.x[0];
  const startY = sanitized.y[0];
  const xRange = Math.max(...sanitized.x) - Math.min(...sanitized.x);
  const yRange = Math.max(...sanitized.y) - Math.min(...sanitized.y);
  const threshold = Math.max(xRange, yRange, 1) * 0.02;
  const boundaries = [sanitized.time[0]];
  let lastBoundary = sanitized.time[0];
  for (let index = 1; index < sanitized.time.length; index += 1) {
    const distance = Math.hypot(sanitized.x[index] - startX, sanitized.y[index] - startY);
    const timeValue = sanitized.time[index];
    if (distance <= threshold && timeValue - lastBoundary >= 30) {
      boundaries.push(timeValue);
      lastBoundary = timeValue;
    }
  }
  const finalTime = sanitized.time[sanitized.time.length - 1];
  if (finalTime > boundaries[boundaries.length - 1]) {
    boundaries.push(finalTime);
  }
  return createLapTimesFromBoundaries(boundaries);
};
var computeSectorTimes = (lapTimes, sectorMarkers, telemetry) => {
  void telemetry;
  if (lapTimes.length === 0) {
    return [];
  }
  const markers = sanitizeNumericArray(sectorMarkers, "computeSectorTimes.sectorMarkers").filter((marker) => marker > 0).sort((left, right) => left - right);
  return lapTimes.map((lap) => {
    const boundaries = [lap.startTime];
    markers.forEach((marker) => {
      const clamped = Math.min(marker, lap.duration);
      const absolute = lap.startTime + clamped;
      if (absolute > boundaries[boundaries.length - 1]) {
        boundaries.push(absolute);
      }
    });
    if (boundaries[boundaries.length - 1] !== lap.endTime) {
      boundaries.push(lap.endTime);
    }
    const sectors = boundaries.slice(1).map((boundary, index) => ({
      sector: index + 1,
      duration: Math.max(0, boundary - boundaries[index])
    }));
    return {
      lap: lap.lap,
      sectors,
      total: lap.duration
    };
  });
};
var computeSpeedDelta = (driver1, driver2) => {
  const d1 = alignSeriesLengths(
    "computeSpeedDelta.driver1",
    sanitizeNumericArray(driver1.time, "computeSpeedDelta.driver1.time"),
    { speed: sanitizeNumericArray(driver1.speed, "computeSpeedDelta.driver1.speed") }
  );
  const d2 = alignSeriesLengths(
    "computeSpeedDelta.driver2",
    sanitizeNumericArray(driver2.time, "computeSpeedDelta.driver2.time"),
    { speed: sanitizeNumericArray(driver2.speed, "computeSpeedDelta.driver2.speed") }
  );
  if (d1.time.length === 0 || d2.time.length === 0) {
    return [];
  }
  const sameTimeBase = d1.time.length === d2.time.length && d1.time.every((timeValue, index) => timeValue === d2.time[index]);
  if (sameTimeBase) {
    return d1.time.map((timeValue, index) => ({
      time: timeValue,
      delta: d2.seriesMap.speed[index] - d1.seriesMap.speed[index]
    }));
  }
  const length = Math.min(d1.time.length, d2.time.length);
  return d1.time.slice(0, length).map((timeValue, index) => {
    const nearest = findNearestIndex(d2.time, timeValue);
    return {
      time: timeValue,
      delta: (d2.seriesMap.speed[nearest] ?? 0) - (d1.seriesMap.speed[index] ?? 0)
    };
  });
};
var interpolateTelemetry = (t1, t2, resolution) => {
  const telemetry1 = sortTelemetryByTime(t1, "interpolateTelemetry.t1");
  const telemetry2 = sortTelemetryByTime(t2, "interpolateTelemetry.t2");
  if (telemetry1.time.length < 2 || telemetry2.time.length < 2) {
    return [cloneEmptyTelemetry(), cloneEmptyTelemetry()];
  }
  const start = Math.max(telemetry1.time[0], telemetry2.time[0]);
  const end = Math.min(
    telemetry1.time[telemetry1.time.length - 1],
    telemetry2.time[telemetry2.time.length - 1]
  );
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return [cloneEmptyTelemetry(), cloneEmptyTelemetry()];
  }
  const resolvedStep = typeof resolution === "number" && Number.isFinite(resolution) && resolution > 0 ? resolution : Math.min(averageStep(telemetry1.time), averageStep(telemetry2.time));
  const step = resolvedStep > 0 ? resolvedStep : 0.1;
  const time = [];
  for (let value = start; value <= end + 1e-9; value += step) {
    time.push(Number(value.toFixed(8)));
  }
  const interpolateChannel = (source, channel) => time.map((timeValue) => interpolateMonotonicSeries(source.time, source[channel], timeValue) ?? 0);
  const aligned1 = {
    time,
    speed: interpolateChannel(telemetry1, "speed"),
    throttle: interpolateChannel(telemetry1, "throttle"),
    brake: interpolateChannel(telemetry1, "brake"),
    x: interpolateChannel(telemetry1, "x"),
    y: interpolateChannel(telemetry1, "y")
  };
  const aligned2 = {
    time,
    speed: interpolateChannel(telemetry2, "speed"),
    throttle: interpolateChannel(telemetry2, "throttle"),
    brake: interpolateChannel(telemetry2, "brake"),
    x: interpolateChannel(telemetry2, "x"),
    y: interpolateChannel(telemetry2, "y")
  };
  return [aligned1, aligned2];
};
var computeTimeDelta = (driver1, driver2) => {
  const source1 = sanitizeTelemetry(driver1, "computeTimeDelta.driver1");
  const source2 = sanitizeTelemetry(driver2, "computeTimeDelta.driver2");
  const d1 = normalizeDistance(source1);
  const d2 = normalizeDistance(source2);
  if (d1.time.length < 2 || d2.time.length < 2) {
    return [];
  }
  const maxDistance = Math.min(
    d1.time[d1.time.length - 1] ?? 0,
    d2.time[d2.time.length - 1] ?? 0
  );
  if (maxDistance <= 0) {
    return [];
  }
  const grid = [];
  for (let distance = 0; distance <= maxDistance; distance += 1) {
    grid.push(distance);
  }
  if (grid[grid.length - 1] !== maxDistance) {
    grid.push(maxDistance);
  }
  const points = [];
  grid.forEach((distance) => {
    const t1 = interpolateMonotonicSeries(d1.time, source1.time, distance);
    const t2 = interpolateMonotonicSeries(d2.time, source2.time, distance);
    if (t1 === null || t2 === null) {
      return;
    }
    points.push({
      distance,
      timeDelta: t1 - t2
    });
  });
  return points;
};
var hasDuplicatePositions = (positions) => new Set(positions).size !== positions.length;
var detectOvertakes = (positions) => {
  if (positions.length < 2) {
    return [];
  }
  const minLaps = Math.min(...positions.map((driver) => driver.positions.length));
  if (minLaps < 2) {
    return [];
  }
  const events = [];
  for (let lapIndex = 0; lapIndex < minLaps - 1; lapIndex += 1) {
    const before = positions.map((driver) => driver.positions[lapIndex]);
    const after = positions.map((driver) => driver.positions[lapIndex + 1]);
    if (hasDuplicatePositions(before) || hasDuplicatePositions(after)) {
      continue;
    }
    for (let left = 0; left < positions.length; left += 1) {
      for (let right = left + 1; right < positions.length; right += 1) {
        const beforeLeft = before[left];
        const beforeRight = before[right];
        const afterLeft = after[left];
        const afterRight = after[right];
        if (beforeLeft < beforeRight && afterLeft > afterRight) {
          events.push({
            lap: lapIndex + 2,
            overtaker: positions[right].driver,
            overtaken: positions[left].driver,
            newPosition: afterRight
          });
        } else if (beforeRight < beforeLeft && afterRight > afterLeft) {
          events.push({
            lap: lapIndex + 2,
            overtaker: positions[left].driver,
            overtaken: positions[right].driver,
            newPosition: afterLeft
          });
        }
      }
    }
  }
  return events.sort(
    (left, right) => left.lap - right.lap || left.newPosition - right.newPosition
  );
};
var linearRegression = (values) => {
  const n = values.length;
  if (n === 0) {
    return { slope: 0, intercept: 0, r2: 0 };
  }
  const xMean = (n + 1) / 2;
  const yMean = values.reduce((sum, value) => sum + value, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < n; index += 1) {
    const x = index + 1;
    numerator += (x - xMean) * (values[index] - yMean);
    denominator += (x - xMean) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  const predictions = values.map((_, index) => intercept + slope * (index + 1));
  const ssRes = values.reduce((sum, value, index) => sum + (value - predictions[index]) ** 2, 0);
  const ssTot = values.reduce((sum, value) => sum + (value - yMean) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
  return { slope, intercept, r2 };
};
var classifyTyreCompound = (stintLapTimes, baselineLapTime) => {
  const lapTimes = sanitizeNumericArray(stintLapTimes, "classifyTyreCompound.stintLapTimes").filter((value) => value > 0);
  const avgLapTime = lapTimes.length > 0 ? lapTimes.reduce((sum, value) => sum + value, 0) / lapTimes.length : 0;
  if (lapTimes.length < 3) {
    return {
      compound: "hard",
      confidence: 0,
      degradationRate: 0,
      avgLapTime
    };
  }
  const regression = linearRegression(lapTimes);
  const degradationRate = regression.slope;
  const avgDelta = avgLapTime - baselineLapTime;
  let compound = "medium";
  if (avgDelta > 8) {
    compound = "wet";
  } else if (avgDelta > 4) {
    compound = "intermediate";
  } else if (degradationRate > 0.1 && avgDelta < 1.5) {
    compound = "soft";
  } else if (degradationRate > 0.04) {
    compound = "medium";
  } else {
    compound = "hard";
  }
  let confidence = Math.max(0, Math.min(1, regression.r2));
  if (degradationRate < 0) {
    compound = "medium";
    confidence *= 0.45;
  }
  if (lapTimes.every((value) => value === lapTimes[0])) {
    compound = "hard";
    confidence = 0.95;
  }
  return {
    compound,
    confidence: Number(confidence.toFixed(4)),
    degradationRate: Number(degradationRate.toFixed(4)),
    avgLapTime: Number(avgLapTime.toFixed(4))
  };
};

// src/utils/exporters.ts
var TELEMETRY_CHANNELS = [
  "time",
  "speed",
  "throttle",
  "brake",
  "x",
  "y"
];
var sanitizeTelemetry2 = (telemetry, context) => {
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
var mergeTelemetry = (...telemetrySources) => {
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
  const merged = {
    time: [],
    speed: [],
    throttle: [],
    brake: [],
    x: [],
    y: []
  };
  let offset = 0;
  telemetrySources.forEach((source, sourceIndex) => {
    const telemetry = sanitizeTelemetry2(source, `mergeTelemetry.source[${sourceIndex}]`);
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
    offset = (merged.time[merged.time.length - 1] ?? offset) + 1e-3;
  });
  return merged;
};
var exportToJson = (telemetry, format = "rows") => {
  const sanitized = sanitizeTelemetry2(telemetry, "exportToJson");
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
var resolveChannels = (channels) => {
  if (!channels || channels.length === 0) {
    return TELEMETRY_CHANNELS;
  }
  const unique = Array.from(new Set(channels));
  return unique.filter(
    (channel) => TELEMETRY_CHANNELS.includes(channel)
  );
};
var exportToCsv = (telemetry, options = {}) => {
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
  const sanitized = sanitizeTelemetry2(telemetry, "exportToCsv");
  const rowCount = Math.min(...selectedChannels.map((channel) => sanitized[channel].length));
  const formatValue = (value) => {
    if (!Number.isFinite(value)) {
      return "";
    }
    return precision >= 0 ? value.toFixed(precision) : String(value);
  };
  const lines = [];
  if (includeHeader) {
    lines.push(selectedChannels.join(delimiter));
  }
  for (let index = 0; index < rowCount; index += 1) {
    const row = selectedChannels.map((channel) => formatValue(sanitized[channel][index]));
    lines.push(row.join(delimiter));
  }
  return lines.join("\n");
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

// src/adapters/fastf1.ts
var TIME_KEYS2 = ["SessionTime", "Time", "time", "timestamp"];
var SPEED_KEYS2 = ["Speed", "speed"];
var THROTTLE_KEYS2 = ["Throttle", "throttle"];
var BRAKE_KEYS2 = ["Brake", "brake"];
var X_KEYS2 = ["X", "x", "PositionX", "posX"];
var Y_KEYS2 = ["Y", "y", "PositionY", "posY"];
var fromPoints = (points) => {
  const normalized = points.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS2)) ?? index,
    speed: toNumber2(pickField(point, SPEED_KEYS2)) ?? 0,
    throttle: toNumber2(pickField(point, THROTTLE_KEYS2)) ?? 0,
    brake: toNumber2(pickField(point, BRAKE_KEYS2)) ?? 0,
    x: toNumber2(pickField(point, X_KEYS2)) ?? 0,
    y: toNumber2(pickField(point, Y_KEYS2)) ?? 0
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
    y: input.Y ?? input.y
  });
};

// src/adapters/openf1.ts
var TIME_KEYS3 = ["session_time", "date", "time", "timestamp", "time_seconds"];
var SPEED_KEYS3 = ["speed", "speed_kmh"];
var THROTTLE_KEYS3 = ["throttle", "throttle_percentage"];
var BRAKE_KEYS3 = ["brake", "brake_percentage"];
var X_KEYS3 = ["x", "position_x", "world_x"];
var Y_KEYS3 = ["y", "position_y", "world_y"];
var fromOpenF1Telemetry = (input) => {
  const points = input.map((point, index) => ({
    time: toSeconds(pickField(point, TIME_KEYS3)) ?? index,
    speed: toNumber2(pickField(point, SPEED_KEYS3)) ?? 0,
    throttle: toNumber2(pickField(point, THROTTLE_KEYS3)) ?? 0,
    brake: toNumber2(pickField(point, BRAKE_KEYS3)) ?? 0,
    x: toNumber2(pickField(point, X_KEYS3)) ?? 0,
    y: toNumber2(pickField(point, Y_KEYS3)) ?? 0
  }));
  return formatTelemetry(points);
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
      y: toNumber2(entry.position?.y) ?? 0
    };
  });
  return formatTelemetry(points);
};
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
  y: "y"
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
        y: resolvePath(point, fields.y)
      };
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
  warn2("fromJsonTelemetry: input did not resolve to telemetry rows or columns.");
  return formatTelemetry([]);
};

// src/adapters/parquet.ts
var DEFAULT_PARQUET_MAPPING = {
  time: "SessionTime",
  speed: "Speed",
  throttle: "Throttle",
  brake: "Brake",
  x: "X",
  y: "Y"
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
      y: row[mapping.y]
    })
  );
  return formatTelemetry(remapped);
};

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

// src/constants/teams.ts
var F1_TEAMS = [
  {
    id: "red_bull",
    name: "Oracle Red Bull Racing",
    shortName: "Red Bull",
    color: "#3671C6",
    secondaryColor: "#1B2A4A",
    country: "Austria",
    principal: "Christian Horner",
    powerUnit: "Honda RBPT",
    drivers: ["VER", "LAW"]
  },
  {
    id: "mclaren",
    name: "McLaren F1 Team",
    shortName: "McLaren",
    color: "#FF8000",
    secondaryColor: "#47352E",
    country: "United Kingdom",
    principal: "Andrea Stella",
    powerUnit: "Mercedes",
    drivers: ["NOR", "PIA"]
  },
  {
    id: "ferrari",
    name: "Scuderia Ferrari",
    shortName: "Ferrari",
    color: "#E8002D",
    secondaryColor: "#FFEB3B",
    country: "Italy",
    principal: "Fr\xE9d\xE9ric Vasseur",
    powerUnit: "Ferrari",
    drivers: ["LEC", "HAM"]
  },
  {
    id: "mercedes",
    name: "Mercedes-AMG Petronas F1 Team",
    shortName: "Mercedes",
    color: "#27F4D2",
    secondaryColor: "#000000",
    country: "Germany",
    principal: "Toto Wolff",
    powerUnit: "Mercedes",
    drivers: ["RUS", "ANT"]
  },
  {
    id: "aston_martin",
    name: "Aston Martin Aramco F1 Team",
    shortName: "Aston Martin",
    color: "#229971",
    secondaryColor: "#04352D",
    country: "United Kingdom",
    principal: "Andy Cowell",
    powerUnit: "Mercedes",
    drivers: ["ALO", "STR"]
  },
  {
    id: "alpine",
    name: "BWT Alpine F1 Team",
    shortName: "Alpine",
    color: "#FF87BC",
    secondaryColor: "#0055A0",
    country: "France",
    principal: "Oliver Oakes",
    powerUnit: "Renault",
    drivers: ["GAS", "DOO"]
  },
  {
    id: "williams",
    name: "Williams Racing",
    shortName: "Williams",
    color: "#1868DB",
    secondaryColor: "#00275E",
    country: "United Kingdom",
    principal: "James Vowles",
    powerUnit: "Mercedes",
    drivers: ["SAI", "ALB"]
  },
  {
    id: "rb",
    name: "Visa Cash App Racing Bulls",
    shortName: "RB",
    color: "#6692FF",
    secondaryColor: "#1A2B4A",
    country: "Italy",
    principal: "Laurent Mekies",
    powerUnit: "Honda RBPT",
    drivers: ["TSU", "HAD"]
  },
  {
    id: "kick_sauber",
    name: "Stake F1 Team Kick Sauber",
    shortName: "Kick Sauber",
    color: "#52E252",
    secondaryColor: "#1B3D2F",
    country: "Switzerland",
    principal: "Mattia Binotto",
    powerUnit: "Ferrari",
    drivers: ["HUL", "BOR"]
  },
  {
    id: "haas",
    name: "MoneyGram Haas F1 Team",
    shortName: "Haas",
    color: "#B6BABD",
    secondaryColor: "#B40D14",
    country: "United States",
    principal: "Ayao Komatsu",
    powerUnit: "Ferrari",
    drivers: ["OCO", "BEA"]
  }
];
var TEAM_COLORS = {
  red_bull: "#3671C6",
  mclaren: "#FF8000",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#1868DB",
  rb: "#6692FF",
  kick_sauber: "#52E252",
  haas: "#B6BABD"
};
var F1_DRIVERS = [
  {
    code: "VER",
    number: 1,
    firstName: "Max",
    lastName: "Verstappen",
    fullName: "Max Verstappen",
    teamId: "red_bull",
    nationality: "Dutch",
    dateOfBirth: "1997-09-30"
  },
  {
    code: "LAW",
    number: 30,
    firstName: "Liam",
    lastName: "Lawson",
    fullName: "Liam Lawson",
    teamId: "red_bull",
    nationality: "New Zealander",
    dateOfBirth: "2002-02-11"
  },
  {
    code: "NOR",
    number: 4,
    firstName: "Lando",
    lastName: "Norris",
    fullName: "Lando Norris",
    teamId: "mclaren",
    nationality: "British",
    dateOfBirth: "1999-11-13"
  },
  {
    code: "PIA",
    number: 81,
    firstName: "Oscar",
    lastName: "Piastri",
    fullName: "Oscar Piastri",
    teamId: "mclaren",
    nationality: "Australian",
    dateOfBirth: "2001-04-06"
  },
  {
    code: "LEC",
    number: 16,
    firstName: "Charles",
    lastName: "Leclerc",
    fullName: "Charles Leclerc",
    teamId: "ferrari",
    nationality: "Mon\xE9gasque",
    dateOfBirth: "1997-10-16"
  },
  {
    code: "HAM",
    number: 44,
    firstName: "Lewis",
    lastName: "Hamilton",
    fullName: "Lewis Hamilton",
    teamId: "ferrari",
    nationality: "British",
    dateOfBirth: "1985-01-07"
  },
  {
    code: "RUS",
    number: 63,
    firstName: "George",
    lastName: "Russell",
    fullName: "George Russell",
    teamId: "mercedes",
    nationality: "British",
    dateOfBirth: "1998-02-15"
  },
  {
    code: "ANT",
    number: 12,
    firstName: "Kimi",
    lastName: "Antonelli",
    fullName: "Kimi Antonelli",
    teamId: "mercedes",
    nationality: "Italian",
    dateOfBirth: "2006-08-25"
  },
  {
    code: "ALO",
    number: 14,
    firstName: "Fernando",
    lastName: "Alonso",
    fullName: "Fernando Alonso",
    teamId: "aston_martin",
    nationality: "Spanish",
    dateOfBirth: "1981-07-29"
  },
  {
    code: "STR",
    number: 18,
    firstName: "Lance",
    lastName: "Stroll",
    fullName: "Lance Stroll",
    teamId: "aston_martin",
    nationality: "Canadian",
    dateOfBirth: "1998-10-29"
  },
  {
    code: "GAS",
    number: 10,
    firstName: "Pierre",
    lastName: "Gasly",
    fullName: "Pierre Gasly",
    teamId: "alpine",
    nationality: "French",
    dateOfBirth: "1996-02-07"
  },
  {
    code: "DOO",
    number: 7,
    firstName: "Jack",
    lastName: "Doohan",
    fullName: "Jack Doohan",
    teamId: "alpine",
    nationality: "Australian",
    dateOfBirth: "2003-01-20"
  },
  {
    code: "ALB",
    number: 23,
    firstName: "Alexander",
    lastName: "Albon",
    fullName: "Alexander Albon",
    teamId: "williams",
    nationality: "Thai",
    dateOfBirth: "1996-03-23"
  },
  {
    code: "SAI",
    number: 55,
    firstName: "Carlos",
    lastName: "Sainz Jr.",
    fullName: "Carlos Sainz Jr.",
    teamId: "williams",
    nationality: "Spanish",
    dateOfBirth: "1994-09-01"
  },
  {
    code: "TSU",
    number: 22,
    firstName: "Yuki",
    lastName: "Tsunoda",
    fullName: "Yuki Tsunoda",
    teamId: "rb",
    nationality: "Japanese",
    dateOfBirth: "2000-05-11"
  },
  {
    code: "HAD",
    number: 6,
    firstName: "Isack",
    lastName: "Hadjar",
    fullName: "Isack Hadjar",
    teamId: "rb",
    nationality: "French",
    dateOfBirth: "2004-09-28"
  },
  {
    code: "HUL",
    number: 27,
    firstName: "Nico",
    lastName: "H\xFClkenberg",
    fullName: "Nico H\xFClkenberg",
    teamId: "kick_sauber",
    nationality: "German",
    dateOfBirth: "1987-08-19"
  },
  {
    code: "BOR",
    number: 5,
    firstName: "Gabriel",
    lastName: "Bortoleto",
    fullName: "Gabriel Bortoleto",
    teamId: "kick_sauber",
    nationality: "Brazilian",
    dateOfBirth: "2004-10-14"
  },
  {
    code: "OCO",
    number: 31,
    firstName: "Esteban",
    lastName: "Ocon",
    fullName: "Esteban Ocon",
    teamId: "haas",
    nationality: "French",
    dateOfBirth: "1996-09-17"
  },
  {
    code: "BEA",
    number: 87,
    firstName: "Oliver",
    lastName: "Bearman",
    fullName: "Oliver Bearman",
    teamId: "haas",
    nationality: "British",
    dateOfBirth: "2005-05-08"
  }
];
var getTeam = (teamId) => F1_TEAMS.find((team) => team.id === teamId);
var getDriver = (code) => F1_DRIVERS.find((driver) => driver.code === code.toUpperCase());
var getDriverColor = (code) => {
  const driver = getDriver(code);
  if (!driver) {
    return void 0;
  }
  return TEAM_COLORS[driver.teamId];
};
var getTeamDrivers = (teamId) => F1_DRIVERS.filter((driver) => driver.teamId === teamId);

// src/constants/tracks.ts
var TRACKS = [
  {
    id: "albert_park",
    name: "Albert Park Circuit",
    shortName: "Melbourne",
    country: "Australia",
    city: "Melbourne",
    lapLength: 5278,
    turns: 14,
    drsZones: [
      { detectionPoint: 450, activationPoint: 640, endPoint: 1170 },
      { detectionPoint: 2720, activationPoint: 2900, endPoint: 3380 }
    ],
    sectorDistances: [1860, 3780],
    lat: -37.8497,
    lng: 144.968
  },
  {
    id: "shanghai",
    name: "Shanghai International Circuit",
    shortName: "Shanghai",
    country: "China",
    city: "Shanghai",
    lapLength: 5451,
    turns: 16,
    drsZones: [
      { detectionPoint: 440, activationPoint: 610, endPoint: 1130 },
      { detectionPoint: 4670, activationPoint: 4860, endPoint: 5350 }
    ],
    sectorDistances: [1847, 3910],
    lat: 31.3389,
    lng: 121.2197
  },
  {
    id: "suzuka",
    name: "Suzuka International Racing Course",
    shortName: "Suzuka",
    country: "Japan",
    city: "Suzuka",
    lapLength: 5807,
    turns: 18,
    drsZones: [{ detectionPoint: 5100, activationPoint: 5350, endPoint: 5700 }],
    sectorDistances: [2027, 4385],
    lat: 34.8431,
    lng: 136.5407
  },
  {
    id: "bahrain",
    name: "Bahrain International Circuit",
    shortName: "Bahrain",
    country: "Bahrain",
    city: "Sakhir",
    lapLength: 5412,
    turns: 15,
    drsZones: [
      { detectionPoint: 340, activationPoint: 490, endPoint: 1010 },
      { detectionPoint: 4680, activationPoint: 4890, endPoint: 5260 }
    ],
    sectorDistances: [1811, 3621],
    lat: 26.0325,
    lng: 50.5106
  },
  {
    id: "jeddah",
    name: "Jeddah Corniche Circuit",
    shortName: "Jeddah",
    country: "Saudi Arabia",
    city: "Jeddah",
    lapLength: 6174,
    turns: 27,
    drsZones: [
      { detectionPoint: 1580, activationPoint: 1780, endPoint: 2340 },
      { detectionPoint: 5120, activationPoint: 5380, endPoint: 5980 }
    ],
    sectorDistances: [2060, 4340],
    lat: 21.6319,
    lng: 39.1044
  },
  {
    id: "miami",
    name: "Miami International Autodrome",
    shortName: "Miami",
    country: "United States",
    city: "Miami Gardens",
    lapLength: 5412,
    turns: 19,
    drsZones: [
      { detectionPoint: 560, activationPoint: 740, endPoint: 1280 },
      { detectionPoint: 3600, activationPoint: 3790, endPoint: 4280 }
    ],
    sectorDistances: [1780, 3720],
    lat: 25.9581,
    lng: -80.2389
  },
  {
    id: "imola",
    name: "Autodromo Enzo e Dino Ferrari",
    shortName: "Imola",
    country: "Italy",
    city: "Imola",
    lapLength: 4909,
    turns: 19,
    drsZones: [{ detectionPoint: 4100, activationPoint: 4350, endPoint: 4780 }],
    sectorDistances: [1697, 3487],
    lat: 44.3439,
    lng: 11.7167
  },
  {
    id: "monaco",
    name: "Circuit de Monaco",
    shortName: "Monaco",
    country: "Monaco",
    city: "Monte Carlo",
    lapLength: 3337,
    turns: 19,
    drsZones: [{ detectionPoint: 2780, activationPoint: 2920, endPoint: 3210 }],
    sectorDistances: [1145, 2329],
    lat: 43.7347,
    lng: 7.4206
  },
  {
    id: "barcelona",
    name: "Circuit de Barcelona-Catalunya",
    shortName: "Barcelona",
    country: "Spain",
    city: "Montmel\xF3",
    lapLength: 4657,
    turns: 16,
    drsZones: [
      { detectionPoint: 580, activationPoint: 770, endPoint: 1260 },
      { detectionPoint: 3700, activationPoint: 3930, endPoint: 4450 }
    ],
    sectorDistances: [1580, 3340],
    lat: 41.57,
    lng: 2.2611
  },
  {
    id: "montreal",
    name: "Circuit Gilles Villeneuve",
    shortName: "Montreal",
    country: "Canada",
    city: "Montreal",
    lapLength: 4361,
    turns: 14,
    drsZones: [
      { detectionPoint: 80, activationPoint: 260, endPoint: 1180 },
      { detectionPoint: 3550, activationPoint: 3720, endPoint: 4240 }
    ],
    sectorDistances: [1460, 3050],
    lat: 45.5,
    lng: -73.5228
  },
  {
    id: "red_bull_ring",
    name: "Red Bull Ring",
    shortName: "Austria",
    country: "Austria",
    city: "Spielberg",
    lapLength: 4318,
    turns: 10,
    drsZones: [
      { detectionPoint: 1020, activationPoint: 1200, endPoint: 1880 },
      { detectionPoint: 3320, activationPoint: 3490, endPoint: 4190 }
    ],
    sectorDistances: [1510, 3040],
    lat: 47.2197,
    lng: 14.7647
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    shortName: "Silverstone",
    country: "United Kingdom",
    city: "Silverstone",
    lapLength: 5891,
    turns: 18,
    drsZones: [
      { detectionPoint: 1620, activationPoint: 1820, endPoint: 2370 },
      { detectionPoint: 5080, activationPoint: 5320, endPoint: 5780 }
    ],
    sectorDistances: [1983, 4236],
    lat: 52.0786,
    lng: -1.0169
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    shortName: "Spa",
    country: "Belgium",
    city: "Stavelot",
    lapLength: 7004,
    turns: 19,
    drsZones: [
      { detectionPoint: 340, activationPoint: 520, endPoint: 1080 },
      { detectionPoint: 5840, activationPoint: 6120, endPoint: 6850 }
    ],
    sectorDistances: [2364, 5196],
    lat: 50.4372,
    lng: 5.9714
  },
  {
    id: "hungaroring",
    name: "Hungaroring",
    shortName: "Hungary",
    country: "Hungary",
    city: "Mogyor\xF3d",
    lapLength: 4381,
    turns: 14,
    drsZones: [{ detectionPoint: 3600, activationPoint: 3820, endPoint: 4300 }],
    sectorDistances: [1585, 3015],
    lat: 47.5789,
    lng: 19.2486
  },
  {
    id: "zandvoort",
    name: "Circuit Zandvoort",
    shortName: "Zandvoort",
    country: "Netherlands",
    city: "Zandvoort",
    lapLength: 4259,
    turns: 14,
    drsZones: [
      { detectionPoint: 970, activationPoint: 1140, endPoint: 1510 },
      { detectionPoint: 3600, activationPoint: 3770, endPoint: 4160 }
    ],
    sectorDistances: [1490, 3005],
    lat: 52.3888,
    lng: 4.5409
  },
  {
    id: "monza",
    name: "Autodromo Nazionale di Monza",
    shortName: "Monza",
    country: "Italy",
    city: "Monza",
    lapLength: 5793,
    turns: 11,
    drsZones: [
      { detectionPoint: 700, activationPoint: 890, endPoint: 1540 },
      { detectionPoint: 4768, activationPoint: 4980, endPoint: 5680 }
    ],
    sectorDistances: [1950, 4200],
    lat: 45.6156,
    lng: 9.2811
  },
  {
    id: "baku",
    name: "Baku City Circuit",
    shortName: "Baku",
    country: "Azerbaijan",
    city: "Baku",
    lapLength: 6003,
    turns: 20,
    drsZones: [
      { detectionPoint: 390, activationPoint: 560, endPoint: 1380 },
      { detectionPoint: 5320, activationPoint: 5520, endPoint: 5970 }
    ],
    sectorDistances: [2020, 4120],
    lat: 40.3725,
    lng: 49.8533
  },
  {
    id: "singapore",
    name: "Marina Bay Street Circuit",
    shortName: "Singapore",
    country: "Singapore",
    city: "Singapore",
    lapLength: 4940,
    turns: 19,
    drsZones: [
      { detectionPoint: 340, activationPoint: 510, endPoint: 960 },
      { detectionPoint: 4100, activationPoint: 4300, endPoint: 4820 }
    ],
    sectorDistances: [1760, 3590],
    lat: 1.2914,
    lng: 103.864
  },
  {
    id: "cota",
    name: "Circuit of the Americas",
    shortName: "COTA",
    country: "United States",
    city: "Austin",
    lapLength: 5513,
    turns: 20,
    drsZones: [
      { detectionPoint: 550, activationPoint: 730, endPoint: 1290 },
      { detectionPoint: 4780, activationPoint: 4990, endPoint: 5400 }
    ],
    sectorDistances: [1870, 3960],
    lat: 30.1328,
    lng: -97.6411
  },
  {
    id: "mexico_city",
    name: "Aut\xF3dromo Hermanos Rodr\xEDguez",
    shortName: "Mexico City",
    country: "Mexico",
    city: "Mexico City",
    lapLength: 4304,
    turns: 17,
    drsZones: [
      { detectionPoint: 960, activationPoint: 1140, endPoint: 1740 },
      { detectionPoint: 3260, activationPoint: 3420, endPoint: 4120 }
    ],
    sectorDistances: [1460, 2950],
    lat: 19.4042,
    lng: -99.0907
  },
  {
    id: "interlagos",
    name: "Aut\xF3dromo Jos\xE9 Carlos Pace",
    shortName: "Interlagos",
    country: "Brazil",
    city: "S\xE3o Paulo",
    lapLength: 4309,
    turns: 15,
    drsZones: [
      { detectionPoint: 690, activationPoint: 870, endPoint: 1400 },
      { detectionPoint: 3500, activationPoint: 3690, endPoint: 4190 }
    ],
    sectorDistances: [1471, 3192],
    lat: -23.7036,
    lng: -46.6997
  },
  {
    id: "las_vegas",
    name: "Las Vegas Strip Circuit",
    shortName: "Las Vegas",
    country: "United States",
    city: "Las Vegas",
    lapLength: 6201,
    turns: 17,
    drsZones: [
      { detectionPoint: 850, activationPoint: 1020, endPoint: 1620 },
      { detectionPoint: 5340, activationPoint: 5540, endPoint: 6080 }
    ],
    sectorDistances: [2100, 4400],
    lat: 36.1147,
    lng: -115.1728
  },
  {
    id: "lusail",
    name: "Lusail International Circuit",
    shortName: "Lusail",
    country: "Qatar",
    city: "Lusail",
    lapLength: 5419,
    turns: 16,
    drsZones: [{ detectionPoint: 4600, activationPoint: 4820, endPoint: 5300 }],
    sectorDistances: [1877, 3930],
    lat: 25.49,
    lng: 51.4542
  },
  {
    id: "yas_marina",
    name: "Yas Marina Circuit",
    shortName: "Abu Dhabi",
    country: "United Arab Emirates",
    city: "Abu Dhabi",
    lapLength: 5281,
    turns: 16,
    drsZones: [
      { detectionPoint: 560, activationPoint: 740, endPoint: 1280 },
      { detectionPoint: 4440, activationPoint: 4640, endPoint: 5140 }
    ],
    sectorDistances: [1765, 3760],
    lat: 24.4672,
    lng: 54.6031
  }
];
var getTrack = (trackId) => TRACKS.find((track) => track.id === trackId);
var getTrackIds = () => TRACKS.map((track) => track.id);

// src/constants/tyres.ts
var TYRE_COMPOUNDS = {
  soft: { compound: "soft", label: "Soft", color: "#FF3333", pirelli: "C3-C5" },
  medium: { compound: "medium", label: "Medium", color: "#FFC700", pirelli: "C2-C4" },
  hard: { compound: "hard", label: "Hard", color: "#FFFFFF", pirelli: "C1-C3" },
  intermediate: {
    compound: "intermediate",
    label: "Intermediate",
    color: "#47C747",
    pirelli: "Intermediate"
  },
  wet: { compound: "wet", label: "Wet", color: "#3D9BE9", pirelli: "Full Wet" }
};
var RACE_COMPOUND_ALLOCATIONS = [
  { trackId: "bahrain", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "jeddah", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "albert_park", hard: "C2", medium: "C3", soft: "C4" },
  { trackId: "monaco", hard: "C3", medium: "C4", soft: "C5" },
  { trackId: "silverstone", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "monza", hard: "C2", medium: "C3", soft: "C4" },
  { trackId: "singapore", hard: "C3", medium: "C4", soft: "C5" },
  { trackId: "spa", hard: "C1", medium: "C2", soft: "C3" }
];
var getRaceCompounds = (trackId) => RACE_COMPOUND_ALLOCATIONS.find((allocation) => allocation.trackId === trackId);
var getTyreColor = (compound) => TYRE_COMPOUNDS[compound]?.color ?? "#FFFFFF";

// src/constants/flags.ts
var FLAG_TYPES = [
  {
    id: "green",
    name: "Green Flag",
    description: "Track clear, racing resumes",
    color: "#00CC00",
    emoji: "\u{1F7E2}",
    causesNeutralization: false
  },
  {
    id: "yellow",
    name: "Yellow Flag",
    description: "Caution, danger on or near the track. No overtaking in the yellowed sector.",
    color: "#FFC700",
    emoji: "\u{1F7E1}",
    causesNeutralization: false
  },
  {
    id: "double_yellow",
    name: "Double Yellow Flag",
    description: "Great danger, slow down significantly. Be prepared to stop.",
    color: "#FFC700",
    emoji: "\u{1F7E1}\u{1F7E1}",
    causesNeutralization: false
  },
  {
    id: "red",
    name: "Red Flag",
    description: "Session stopped. All cars must return to the pit lane.",
    color: "#FF0000",
    emoji: "\u{1F534}",
    causesNeutralization: true
  },
  {
    id: "safety_car",
    name: "Safety Car",
    description: "Safety car deployed. All cars must form up behind the safety car.",
    color: "#FFA500",
    emoji: "\u{1F3CE}\uFE0F",
    causesNeutralization: true
  },
  {
    id: "virtual_safety_car",
    name: "Virtual Safety Car (VSC)",
    description: "All cars must reduce speed to a delta time. No overtaking.",
    color: "#FFA500",
    emoji: "\u26A0\uFE0F",
    causesNeutralization: true
  },
  {
    id: "blue",
    name: "Blue Flag",
    description: "Shown to a lapped car: let the faster car behind you pass.",
    color: "#0066FF",
    emoji: "\u{1F535}",
    causesNeutralization: false
  },
  {
    id: "white",
    name: "White Flag",
    description: "Slow-moving vehicle on track (recovery vehicle, medical car).",
    color: "#FFFFFF",
    emoji: "\u26AA",
    causesNeutralization: false
  },
  {
    id: "black",
    name: "Black Flag",
    description: "Driver disqualified. Must return to pits immediately.",
    color: "#000000",
    emoji: "\u2B1B",
    causesNeutralization: false
  },
  {
    id: "black_orange",
    name: "Black and Orange Flag (Meatball)",
    description: "Car has mechanical issue. Driver must pit for repairs.",
    color: "#FF6600",
    emoji: "\u{1F7E0}",
    causesNeutralization: false
  },
  {
    id: "chequered",
    name: "Chequered Flag",
    description: "End of session.",
    color: "#000000",
    emoji: "\u{1F3C1}",
    causesNeutralization: false
  }
];
var getFlag = (id) => FLAG_TYPES.find((flag) => flag.id === id);

// src/constants/calendar.ts
var RACE_CALENDAR_2025 = [
  {
    round: 1,
    raceName: "Australian Grand Prix",
    trackId: "albert_park",
    country: "Australia",
    dateStart: "2025-03-14",
    raceDate: "2025-03-16",
    isSprint: false
  },
  {
    round: 2,
    raceName: "Chinese Grand Prix",
    trackId: "shanghai",
    country: "China",
    dateStart: "2025-03-21",
    raceDate: "2025-03-23",
    isSprint: true
  },
  {
    round: 3,
    raceName: "Japanese Grand Prix",
    trackId: "suzuka",
    country: "Japan",
    dateStart: "2025-04-04",
    raceDate: "2025-04-06",
    isSprint: false
  },
  {
    round: 4,
    raceName: "Bahrain Grand Prix",
    trackId: "bahrain",
    country: "Bahrain",
    dateStart: "2025-04-11",
    raceDate: "2025-04-13",
    isSprint: false
  },
  {
    round: 5,
    raceName: "Saudi Arabian Grand Prix",
    trackId: "jeddah",
    country: "Saudi Arabia",
    dateStart: "2025-04-18",
    raceDate: "2025-04-20",
    isSprint: false
  },
  {
    round: 6,
    raceName: "Miami Grand Prix",
    trackId: "miami",
    country: "United States",
    dateStart: "2025-05-02",
    raceDate: "2025-05-04",
    isSprint: true
  },
  {
    round: 7,
    raceName: "Emilia Romagna Grand Prix",
    trackId: "imola",
    country: "Italy",
    dateStart: "2025-05-16",
    raceDate: "2025-05-18",
    isSprint: false
  },
  {
    round: 8,
    raceName: "Monaco Grand Prix",
    trackId: "monaco",
    country: "Monaco",
    dateStart: "2025-05-23",
    raceDate: "2025-05-25",
    isSprint: false
  },
  {
    round: 9,
    raceName: "Spanish Grand Prix",
    trackId: "barcelona",
    country: "Spain",
    dateStart: "2025-05-30",
    raceDate: "2025-06-01",
    isSprint: false
  },
  {
    round: 10,
    raceName: "Canadian Grand Prix",
    trackId: "montreal",
    country: "Canada",
    dateStart: "2025-06-13",
    raceDate: "2025-06-15",
    isSprint: false
  },
  {
    round: 11,
    raceName: "Austrian Grand Prix",
    trackId: "red_bull_ring",
    country: "Austria",
    dateStart: "2025-06-27",
    raceDate: "2025-06-29",
    isSprint: false
  },
  {
    round: 12,
    raceName: "British Grand Prix",
    trackId: "silverstone",
    country: "United Kingdom",
    dateStart: "2025-07-04",
    raceDate: "2025-07-06",
    isSprint: false
  },
  {
    round: 13,
    raceName: "Belgian Grand Prix",
    trackId: "spa",
    country: "Belgium",
    dateStart: "2025-07-25",
    raceDate: "2025-07-27",
    isSprint: true
  },
  {
    round: 14,
    raceName: "Hungarian Grand Prix",
    trackId: "hungaroring",
    country: "Hungary",
    dateStart: "2025-08-01",
    raceDate: "2025-08-03",
    isSprint: false
  },
  {
    round: 15,
    raceName: "Dutch Grand Prix",
    trackId: "zandvoort",
    country: "Netherlands",
    dateStart: "2025-08-29",
    raceDate: "2025-08-31",
    isSprint: false
  },
  {
    round: 16,
    raceName: "Italian Grand Prix",
    trackId: "monza",
    country: "Italy",
    dateStart: "2025-09-05",
    raceDate: "2025-09-07",
    isSprint: false
  },
  {
    round: 17,
    raceName: "Azerbaijan Grand Prix",
    trackId: "baku",
    country: "Azerbaijan",
    dateStart: "2025-09-19",
    raceDate: "2025-09-21",
    isSprint: false
  },
  {
    round: 18,
    raceName: "Singapore Grand Prix",
    trackId: "singapore",
    country: "Singapore",
    dateStart: "2025-10-03",
    raceDate: "2025-10-05",
    isSprint: false
  },
  {
    round: 19,
    raceName: "United States Grand Prix",
    trackId: "cota",
    country: "United States",
    dateStart: "2025-10-17",
    raceDate: "2025-10-19",
    isSprint: true
  },
  {
    round: 20,
    raceName: "Mexico City Grand Prix",
    trackId: "mexico_city",
    country: "Mexico",
    dateStart: "2025-10-24",
    raceDate: "2025-10-26",
    isSprint: false
  },
  {
    round: 21,
    raceName: "S\xE3o Paulo Grand Prix",
    trackId: "interlagos",
    country: "Brazil",
    dateStart: "2025-11-07",
    raceDate: "2025-11-09",
    isSprint: true
  },
  {
    round: 22,
    raceName: "Las Vegas Grand Prix",
    trackId: "las_vegas",
    country: "United States",
    dateStart: "2025-11-20",
    raceDate: "2025-11-22",
    isSprint: false
  },
  {
    round: 23,
    raceName: "Qatar Grand Prix",
    trackId: "lusail",
    country: "Qatar",
    dateStart: "2025-11-28",
    raceDate: "2025-11-30",
    isSprint: true
  },
  {
    round: 24,
    raceName: "Abu Dhabi Grand Prix",
    trackId: "yas_marina",
    country: "United Arab Emirates",
    dateStart: "2025-12-05",
    raceDate: "2025-12-07",
    isSprint: false
  }
];
var getNextRace = (today = /* @__PURE__ */ new Date()) => {
  const now = today.getTime();
  return RACE_CALENDAR_2025.find((race) => Date.parse(race.raceDate) >= now);
};
var getSprintWeekends = () => RACE_CALENDAR_2025.filter((race) => race.isSprint);
var getRaceByRound = (round) => RACE_CALENDAR_2025.find((race) => race.round === round);

export {
  sanitizeNumericArray,
  alignSeriesLengths,
  validateTelemetry,
  processSeriesData,
  findNearestIndex,
  formatTelemetry,
  fromCsvTelemetry,
  normalizeDistance,
  computeLapTimes,
  computeSectorTimes,
  computeSpeedDelta,
  interpolateTelemetry,
  computeTimeDelta,
  detectOvertakes,
  classifyTyreCompound,
  mergeTelemetry,
  exportToJson,
  exportToCsv,
  fromFastF1Telemetry,
  fromOpenF1Telemetry,
  fromErgastApi,
  fromMultiViewerCarData,
  fromMultiViewerTiming,
  fromJsonTelemetry,
  fromParquet,
  fetchOpenF1Telemetry,
  fetchOpenF1Sessions,
  fetchOpenF1Drivers,
  F1_TEAMS,
  TEAM_COLORS,
  F1_DRIVERS,
  getTeam,
  getDriver,
  getDriverColor,
  getTeamDrivers,
  TRACKS,
  getTrack,
  getTrackIds,
  TYRE_COMPOUNDS,
  RACE_COMPOUND_ALLOCATIONS,
  getRaceCompounds,
  getTyreColor,
  FLAG_TYPES,
  getFlag,
  RACE_CALENDAR_2025,
  getNextRace,
  getSprintWeekends,
  getRaceByRound
};
//# sourceMappingURL=chunk-FATZZYEL.js.map