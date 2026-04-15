import type {
  DeltaPoint,
  DistanceBasedTelemetry,
  DriverLapTelemetry,
  DriverPositionHistory,
  FormattedTelemetry,
  LapSectors,
  LapTime,
  OvertakeEvent,
  TimeDeltaPoint,
  TyreClassification
} from "../types/telemetry";
import { findNearestIndex } from "./processing";
import { alignSeriesLengths, sanitizeNumericArray } from "./validation";

const cloneEmptyTelemetry = (): FormattedTelemetry => ({
  time: [],
  speed: [],
  throttle: [],
  brake: [],
  x: [],
  y: []
});

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

const cumulativeDistance = (x: number[], y: number[]): number[] => {
  if (x.length === 0 || y.length === 0) {
    return [];
  }

  const length = Math.min(x.length, y.length);
  const distances = new Array<number>(length).fill(0);

  for (let index = 1; index < length; index += 1) {
    const dx = x[index] - x[index - 1];
    const dy = y[index] - y[index - 1];
    const segment = Math.hypot(dx, dy);
    distances[index] = distances[index - 1] + (Number.isFinite(segment) ? segment : 0);
  }

  return distances;
};

const averageStep = (values: number[]): number => {
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

const lerp = (x0: number, y0: number, x1: number, y1: number, x: number): number =>
  y0 + (y1 - y0) * ((x - x0) / (x1 - x0));

const interpolateMonotonicSeries = (
  base: number[],
  values: number[],
  target: number
): number | null => {
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

const sortTelemetryByTime = (telemetry: FormattedTelemetry, context: string): FormattedTelemetry => {
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

/**
 * Convert time-domain telemetry to distance-domain telemetry.
 *
 * @param telemetry - Time-domain telemetry with x,y coordinates
 * @returns Distance-domain telemetry where `time` becomes cumulative distance in meters
 *
 * @example
 * ```ts
 * const distanceTelemetry = normalizeDistance(telemetry);
 * // distanceTelemetry.time -> [0, 12.5, 25.1, ...]
 * ```
 */
export const normalizeDistance = (telemetry: FormattedTelemetry): DistanceBasedTelemetry => {
  const sanitized = sanitizeTelemetry(telemetry, "normalizeDistance");
  if (sanitized.time.length === 0) {
    return cloneEmptyTelemetry();
  }

  return {
    ...sanitized,
    time: cumulativeDistance(sanitized.x, sanitized.y)
  };
};

/**
 * Extract lap times from continuous telemetry using explicit boundaries or auto-detection.
 *
 * @param telemetry - Continuous session telemetry
 * @param lapBoundaries - Optional lap start times in seconds
 * @returns Array of lap timing objects
 *
 * @example
 * ```ts
 * const laps = computeLapTimes(telemetry, [0, 82.4, 163.1, 244.8]);
 * ```
 */
export const computeLapTimes = (
  telemetry: FormattedTelemetry,
  lapBoundaries?: number[]
): LapTime[] => {
  const sanitized = sanitizeTelemetry(telemetry, "computeLapTimes");
  if (sanitized.time.length === 0) {
    return [];
  }

  const createLapTimesFromBoundaries = (boundaries: number[]): LapTime[] => {
    if (boundaries.length < 2) {
      return [];
    }

    const laps: LapTime[] = [];
    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const startTime = boundaries[index];
      const endTime = boundaries[index + 1];
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
    const boundaries = sanitizeNumericArray(lapBoundaries, "computeLapTimes.lapBoundaries")
      .sort((left, right) => left - right);
    return createLapTimesFromBoundaries(boundaries);
  }

  if (sanitized.x.length < 2 || sanitized.y.length < 2) {
    return [];
  }

  const startX = sanitized.x[0];
  const startY = sanitized.y[0];
  const xRange = Math.max(...sanitized.x) - Math.min(...sanitized.x);
  const yRange = Math.max(...sanitized.y) - Math.min(...sanitized.y);
  const threshold = Math.max(xRange, yRange, 1) * 0.02;

  const boundaries: number[] = [sanitized.time[0]];
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

/**
 * Calculate sector split times for each lap.
 *
 * @param lapTimes - Lap timing objects
 * @param sectorMarkers - Sector split offsets in seconds from lap start
 * @param telemetry - Full telemetry data (reserved for future marker refinement)
 * @returns Sector timing breakdown per lap
 *
 * @example
 * ```ts
 * const sectors = computeSectorTimes(laps, [28.5, 55.2], telemetry);
 * ```
 */
export const computeSectorTimes = (
  lapTimes: LapTime[],
  sectorMarkers: number[],
  telemetry: FormattedTelemetry
): LapSectors[] => {
  void telemetry;
  if (lapTimes.length === 0) {
    return [];
  }

  const markers = sanitizeNumericArray(sectorMarkers, "computeSectorTimes.sectorMarkers")
    .filter((marker) => marker > 0)
    .sort((left, right) => left - right);

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

/**
 * Compute point-wise speed delta between two drivers.
 *
 * @param driver1 - Reference driver telemetry
 * @param driver2 - Comparison driver telemetry
 * @returns Delta points where positive values mean driver2 is faster
 *
 * @example
 * ```ts
 * const delta = computeSpeedDelta(driver1, driver2);
 * ```
 */
export const computeSpeedDelta = (
  driver1: DriverLapTelemetry,
  driver2: DriverLapTelemetry
): DeltaPoint[] => {
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

  const sameTimeBase =
    d1.time.length === d2.time.length &&
    d1.time.every((timeValue, index) => timeValue === d2.time[index]);

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

/**
 * Align two telemetry streams to the same time base using linear interpolation.
 *
 * @param t1 - First telemetry stream
 * @param t2 - Second telemetry stream
 * @param resolution - Optional output step in seconds
 * @returns Tuple of aligned telemetry streams with identical time arrays
 *
 * @example
 * ```ts
 * const [aligned1, aligned2] = interpolateTelemetry(t1, t2);
 * ```
 */
export const interpolateTelemetry = (
  t1: FormattedTelemetry,
  t2: FormattedTelemetry,
  resolution?: number
): [FormattedTelemetry, FormattedTelemetry] => {
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

  const resolvedStep =
    typeof resolution === "number" && Number.isFinite(resolution) && resolution > 0
      ? resolution
      : Math.min(averageStep(telemetry1.time), averageStep(telemetry2.time));
  const step = resolvedStep > 0 ? resolvedStep : 0.1;

  const time: number[] = [];
  for (let value = start; value <= end + 1e-9; value += step) {
    time.push(Number(value.toFixed(8)));
  }

  const interpolateChannel = (source: FormattedTelemetry, channel: keyof FormattedTelemetry): number[] =>
    time.map((timeValue) => interpolateMonotonicSeries(source.time, source[channel], timeValue) ?? 0);

  const aligned1: FormattedTelemetry = {
    time,
    speed: interpolateChannel(telemetry1, "speed"),
    throttle: interpolateChannel(telemetry1, "throttle"),
    brake: interpolateChannel(telemetry1, "brake"),
    x: interpolateChannel(telemetry1, "x"),
    y: interpolateChannel(telemetry1, "y")
  };

  const aligned2: FormattedTelemetry = {
    time,
    speed: interpolateChannel(telemetry2, "speed"),
    throttle: interpolateChannel(telemetry2, "throttle"),
    brake: interpolateChannel(telemetry2, "brake"),
    x: interpolateChannel(telemetry2, "x"),
    y: interpolateChannel(telemetry2, "y")
  };

  return [aligned1, aligned2];
};

/**
 * Compute cumulative time delta over lap distance.
 *
 * @param driver1 - Baseline driver telemetry
 * @param driver2 - Comparison driver telemetry
 * @returns Distance-indexed time delta points
 *
 * @example
 * ```ts
 * const trace = computeTimeDelta(driver1, driver2);
 * ```
 */
export const computeTimeDelta = (
  driver1: FormattedTelemetry,
  driver2: FormattedTelemetry
): TimeDeltaPoint[] => {
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

  const grid: number[] = [];
  for (let distance = 0; distance <= maxDistance; distance += 1) {
    grid.push(distance);
  }
  if (grid[grid.length - 1] !== maxDistance) {
    grid.push(maxDistance);
  }

  const points: TimeDeltaPoint[] = [];
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

const hasDuplicatePositions = (positions: number[]): boolean =>
  new Set(positions).size !== positions.length;

/**
 * Detect overtaking events from lap-by-lap position history.
 *
 * @param positions - Position traces for multiple drivers
 * @returns Ordered overtake events
 *
 * @example
 * ```ts
 * const events = detectOvertakes(positionHistory);
 * ```
 */
export const detectOvertakes = (positions: DriverPositionHistory[]): OvertakeEvent[] => {
  if (positions.length < 2) {
    return [];
  }

  const minLaps = Math.min(...positions.map((driver) => driver.positions.length));
  if (minLaps < 2) {
    return [];
  }

  const events: OvertakeEvent[] = [];

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

const linearRegression = (values: number[]): { slope: number; intercept: number; r2: number } => {
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

/**
 * Infer tyre compound from stint lap-time behaviour.
 *
 * @param stintLapTimes - Lap times in seconds for a single stint
 * @param baselineLapTime - Baseline dry lap time in seconds
 * @returns Compound guess with confidence and degradation metrics
 *
 * @example
 * ```ts
 * const result = classifyTyreCompound([81.2, 81.4, 81.7, 82.1], 80.5);
 * ```
 */
export const classifyTyreCompound = (
  stintLapTimes: number[],
  baselineLapTime: number
): TyreClassification => {
  const lapTimes = sanitizeNumericArray(stintLapTimes, "classifyTyreCompound.stintLapTimes")
    .filter((value) => value > 0);
  const avgLapTime =
    lapTimes.length > 0
      ? lapTimes.reduce((sum, value) => sum + value, 0) / lapTimes.length
      : 0;

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

  let compound: TyreClassification["compound"] = "medium";

  if (avgDelta > 8) {
    compound = "wet";
  } else if (avgDelta > 4) {
    compound = "intermediate";
  } else if (degradationRate > 0.10 && avgDelta < 1.5) {
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
