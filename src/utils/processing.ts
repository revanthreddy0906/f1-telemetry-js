import type { DataProcessingOptions } from "../types/telemetry";
import { alignSeriesLengths, sanitizeNumericArray } from "./validation";

type SeriesMap = Record<string, number[]>;

export interface ProcessSeriesInput {
  context: string;
  time: unknown;
  seriesMap: Record<string, unknown>;
  processing?: DataProcessingOptions;
}

export interface ProcessSeriesOutput<T extends SeriesMap> {
  time: number[];
  seriesMap: T;
}

const applyWindow = (
  time: number[],
  seriesMap: SeriesMap,
  processing?: DataProcessingOptions
): { time: number[]; seriesMap: SeriesMap } => {
  const start = processing?.window?.startTime ?? Number.NEGATIVE_INFINITY;
  const end = processing?.window?.endTime ?? Number.POSITIVE_INFINITY;

  if (!Number.isFinite(start) && !Number.isFinite(end)) {
    return { time, seriesMap };
  }

  const selectedIndices: number[] = [];
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

const normalizeTimeSeries = (
  time: number[],
  seriesMap: SeriesMap
): { time: number[]; seriesMap: SeriesMap } => {
  if (time.length < 2) {
    return { time, seriesMap };
  }

  const sortedIndices = Array.from({ length: time.length }, (_, index) => index).sort(
    (left, right) => time[left] - time[right]
  );
  const isAlreadySorted = sortedIndices.every((index, sortedPosition) => index === sortedPosition);
  const orderedTime = isAlreadySorted ? time : sortedIndices.map((index) => time[index]);
  const orderedSeries = isAlreadySorted
    ? seriesMap
    : Object.fromEntries(
        Object.entries(seriesMap).map(([key, series]) => [key, sortedIndices.map((index) => series[index])])
      );

  const dedupedTime: number[] = [];
  const dedupedSeries = Object.fromEntries(
    Object.keys(orderedSeries).map((key) => [key, [] as number[]])
  ) as SeriesMap;
  const timeToIndex = new Map<number, number>();
  orderedTime.forEach((value, index) => {
    const existingIndex = timeToIndex.get(value);
    if (existingIndex === undefined) {
      dedupedTime.push(value);
      const nextIndex = dedupedTime.length - 1;
      timeToIndex.set(value, nextIndex);
      Object.entries(orderedSeries).forEach(([key, series]) => {
        dedupedSeries[key].push(series[index]);
      });
      return;
    }

    // Keep the latest sample for duplicate timestamps.
    Object.entries(orderedSeries).forEach(([key, series]) => {
      dedupedSeries[key][existingIndex] = series[index];
    });
  });

  return { time: dedupedTime, seriesMap: dedupedSeries };
};

const uniqueSorted = (indices: number[]): number[] => [...new Set(indices)].sort((a, b) => a - b);

const pickByIndices = (values: number[], indices: number[]): number[] => indices.map((index) => values[index]);

const downsampleEveryNth = (length: number, maxPoints: number): number[] => {
  if (length <= maxPoints) {
    return Array.from({ length }, (_, index) => index);
  }

  const step = Math.ceil(length / maxPoints);
  const indices: number[] = [0];

  for (let index = step; index < length - 1; index += step) {
    indices.push(index);
  }

  indices.push(length - 1);
  return uniqueSorted(indices);
};

const downsampleMinMax = (basis: number[], maxPoints: number): number[] => {
  if (basis.length <= maxPoints || maxPoints < 4) {
    return downsampleEveryNth(basis.length, maxPoints);
  }

  const targetBuckets = maxPoints - 2;
  const bucketSize = (basis.length - 2) / targetBuckets;
  const indices: number[] = [0];

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

const resolveAdaptiveConfig = (
  timeLength: number,
  processing?: DataProcessingOptions
): { strategy: "every-nth" | "min-max"; maxPoints: number } => {
  const configuredMaxPoints = processing?.maxPoints;
  const viewportWidth = processing?.adaptive?.viewportWidth;
  const chartType = processing?.adaptive?.chartType ?? "line";
  const chartMultiplier: Record<typeof chartType, number> = {
    line: 1.8,
    track: 1.2,
    scatter: 1.0,
    bar: 1.4
  };

  const viewportDerivedPoints =
    typeof viewportWidth === "number" && Number.isFinite(viewportWidth) && viewportWidth > 0
      ? Math.max(200, Math.floor(viewportWidth * chartMultiplier[chartType]))
      : undefined;

  const maxPointsCandidates = [configuredMaxPoints, viewportDerivedPoints, timeLength]
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 1)
    .map((value) => Math.floor(value));
  const resolvedMaxPoints =
    maxPointsCandidates.length > 0 ? Math.min(...maxPointsCandidates) : Math.min(1500, timeLength);
  const compressionRatio = timeLength / Math.max(resolvedMaxPoints, 1);
  const strategy = compressionRatio > 3 || chartType === "line" || chartType === "track" ? "min-max" : "every-nth";

  return { strategy, maxPoints: resolvedMaxPoints };
};

const applyDownsampling = (
  time: number[],
  seriesMap: SeriesMap,
  processing?: DataProcessingOptions
): { time: number[]; seriesMap: SeriesMap } => {
  const strategy = processing?.downsampleStrategy ?? "every-nth";
  const adaptive = strategy === "adaptive" ? resolveAdaptiveConfig(time.length, processing) : null;
  const maxPoints = adaptive ? adaptive.maxPoints : processing?.maxPoints;
  if (typeof maxPoints !== "number" || maxPoints < 2 || time.length <= maxPoints) {
    return { time, seriesMap };
  }

  const basisKey = Object.keys(seriesMap)[0];
  const basisSeries = basisKey ? seriesMap[basisKey] : time;
  const indices =
    (adaptive ? adaptive.strategy : strategy) === "min-max"
      ? downsampleMinMax(basisSeries, maxPoints)
      : downsampleEveryNth(time.length, maxPoints);

  return {
    time: pickByIndices(time, indices),
    seriesMap: Object.fromEntries(
      Object.entries(seriesMap).map(([key, series]) => [key, pickByIndices(series, indices)])
    )
  };
};

/**
 * Sanitize, align, window, and downsample telemetry series in one pass.
 */
export const processSeriesData = <T extends SeriesMap>({
  context,
  time,
  seriesMap,
  processing
}: ProcessSeriesInput): ProcessSeriesOutput<T> => {
  const sanitizedTime = sanitizeNumericArray(time, `${context}.time`);
  const sanitizedSeries = Object.fromEntries(
    Object.entries(seriesMap).map(([key, values]) => [key, sanitizeNumericArray(values, `${context}.${key}`)])
  );

  const aligned = alignSeriesLengths(context, sanitizedTime, sanitizedSeries);
  const normalized = normalizeTimeSeries(aligned.time, aligned.seriesMap);
  const windowed = applyWindow(normalized.time, normalized.seriesMap, processing);
  const downsampled = applyDownsampling(windowed.time, windowed.seriesMap, processing);

  return {
    time: downsampled.time,
    seriesMap: downsampled.seriesMap as T
  };
};

/**
 * Find the index of the value nearest to `target`.
 */
export const findNearestIndex = (values: number[], target: number | null | undefined): number => {
  if (target === null || target === undefined || values.length === 0) {
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
