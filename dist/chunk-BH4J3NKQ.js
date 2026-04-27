import {
  processSeriesData
} from "./chunk-CBFO23W6.js";

// src/utils/workerProcessing.ts
var WORKER_SOURCE = `
const toFiniteNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};
const sanitizeNumericArray = (input) => {
  if (!Array.isArray(input)) return [];
  const values = [];
  input.forEach((value) => {
    const parsed = toFiniteNumber(value);
    if (parsed !== null) values.push(parsed);
  });
  return values;
};
const alignSeriesLengths = (time, seriesMap) => {
  const entries = Object.entries(seriesMap);
  const lengths = [time.length, ...entries.map(([, series]) => series.length)];
  const minLength = Math.min(...lengths);
  return {
    time: time.slice(0, minLength),
    seriesMap: Object.fromEntries(entries.map(([key, series]) => [key, series.slice(0, minLength)]))
  };
};
const normalizeTimeSeries = (time, seriesMap) => {
  if (time.length < 2) return { time, seriesMap };
  const indices = Array.from({ length: time.length }, (_, index) => index).sort((a, b) => time[a] - time[b]);
  const orderedTime = indices.map((index) => time[index]);
  const orderedSeries = Object.fromEntries(
    Object.entries(seriesMap).map(([key, series]) => [key, indices.map((index) => series[index])])
  );
  const dedupedTime = [];
  const dedupedSeries = Object.fromEntries(Object.keys(orderedSeries).map((key) => [key, []]));
  const timeToIndex = new Map();
  orderedTime.forEach((value, index) => {
    const existing = timeToIndex.get(value);
    if (existing === undefined) {
      const next = dedupedTime.push(value) - 1;
      timeToIndex.set(value, next);
      Object.entries(orderedSeries).forEach(([key, series]) => dedupedSeries[key].push(series[index]));
      return;
    }
    Object.entries(orderedSeries).forEach(([key, series]) => {
      dedupedSeries[key][existing] = series[index];
    });
  });
  return { time: dedupedTime, seriesMap: dedupedSeries };
};
const applyWindow = (time, seriesMap, processing) => {
  const start = processing?.window?.startTime ?? Number.NEGATIVE_INFINITY;
  const end = processing?.window?.endTime ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(start) && !Number.isFinite(end)) return { time, seriesMap };
  const selected = [];
  time.forEach((value, index) => {
    if (value >= start && value <= end) selected.push(index);
  });
  return {
    time: selected.map((index) => time[index]),
    seriesMap: Object.fromEntries(
      Object.entries(seriesMap).map(([key, series]) => [key, selected.map((index) => series[index])])
    )
  };
};
const uniqueSorted = (indices) => [...new Set(indices)].sort((a, b) => a - b);
const pickByIndices = (values, indices) => indices.map((index) => values[index]);
const downsampleEveryNth = (length, maxPoints) => {
  if (length <= maxPoints) return Array.from({ length }, (_, index) => index);
  const step = Math.ceil(length / maxPoints);
  const indices = [0];
  for (let index = step; index < length - 1; index += step) indices.push(index);
  indices.push(length - 1);
  return uniqueSorted(indices);
};
const downsampleMinMax = (basis, maxPoints) => {
  if (basis.length <= maxPoints || maxPoints < 4) return downsampleEveryNth(basis.length, maxPoints);
  const targetBuckets = maxPoints - 2;
  const bucketSize = (basis.length - 2) / targetBuckets;
  const indices = [0];
  for (let bucket = 0; bucket < targetBuckets; bucket += 1) {
    const start = 1 + Math.floor(bucket * bucketSize);
    const endExclusive = Math.min(1 + Math.floor((bucket + 1) * bucketSize), basis.length - 1);
    if (start >= endExclusive) continue;
    let minIndex = start;
    let maxIndex = start;
    for (let index = start + 1; index < endExclusive; index += 1) {
      if (basis[index] < basis[minIndex]) minIndex = index;
      if (basis[index] > basis[maxIndex]) maxIndex = index;
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
const resolveAdaptiveConfig = (timeLength, processing) => {
  const configuredMaxPoints = processing?.maxPoints;
  const viewportWidth = processing?.adaptive?.viewportWidth;
  const chartType = processing?.adaptive?.chartType ?? "line";
  const chartMultiplier = { line: 1.8, track: 1.2, scatter: 1.0, bar: 1.4 };
  const viewportDerivedPoints =
    typeof viewportWidth === "number" && Number.isFinite(viewportWidth) && viewportWidth > 0
      ? Math.max(200, Math.floor(viewportWidth * chartMultiplier[chartType]))
      : undefined;
  const candidates = [configuredMaxPoints, viewportDerivedPoints, timeLength]
    .filter((value) => typeof value === "number" && Number.isFinite(value) && value > 1)
    .map((value) => Math.floor(value));
  const maxPoints = candidates.length > 0 ? Math.min(...candidates) : Math.min(1500, timeLength);
  const compressionRatio = timeLength / Math.max(maxPoints, 1);
  const strategy = compressionRatio > 3 || chartType === "line" || chartType === "track" ? "min-max" : "every-nth";
  return { strategy, maxPoints };
};
const applyDownsampling = (time, seriesMap, processing) => {
  const strategy = processing?.downsampleStrategy ?? "every-nth";
  const adaptive = strategy === "adaptive" ? resolveAdaptiveConfig(time.length, processing) : null;
  const maxPoints = adaptive ? adaptive.maxPoints : processing?.maxPoints;
  if (typeof maxPoints !== "number" || maxPoints < 2 || time.length <= maxPoints) return { time, seriesMap };
  const basisKey = Object.keys(seriesMap)[0];
  const basisSeries = basisKey ? seriesMap[basisKey] : time;
  const indices =
    (adaptive ? adaptive.strategy : strategy) === "min-max"
      ? downsampleMinMax(basisSeries, maxPoints)
      : downsampleEveryNth(time.length, maxPoints);
  return {
    time: pickByIndices(time, indices),
    seriesMap: Object.fromEntries(Object.entries(seriesMap).map(([key, series]) => [key, pickByIndices(series, indices)]))
  };
};
self.onmessage = (event) => {
  try {
    const payload = event.data;
    const sanitizedTime = sanitizeNumericArray(payload.time);
    const sanitizedSeries = Object.fromEntries(
      Object.entries(payload.seriesMap).map(([key, values]) => [key, sanitizeNumericArray(values)])
    );
    const aligned = alignSeriesLengths(sanitizedTime, sanitizedSeries);
    const normalized = normalizeTimeSeries(aligned.time, aligned.seriesMap);
    const windowed = applyWindow(normalized.time, normalized.seriesMap, payload.processing);
    const downsampled = applyDownsampling(windowed.time, windowed.seriesMap, payload.processing);
    self.postMessage({ ok: true, result: { time: downsampled.time, seriesMap: downsampled.seriesMap } });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
`;
var canUseWorker = () => typeof Worker !== "undefined" && typeof Blob !== "undefined" && typeof URL !== "undefined";
var processOnMainThread = (payload) => processSeriesData({
  context: payload.context,
  time: payload.time,
  seriesMap: payload.seriesMap,
  processing: payload.processing
});
var processSeriesDataInWorker = async (payload, options = {}) => {
  if (!canUseWorker()) {
    return processOnMainThread(payload);
  }
  const workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(workerUrl);
  const timeoutMs = typeof options.timeoutMs === "number" && options.timeoutMs > 0 ? options.timeoutMs : 8e3;
  try {
    const result = await new Promise((resolve, reject) => {
      const timeoutId = globalThis.setTimeout(() => {
        reject(new Error("worker-timeout"));
      }, timeoutMs);
      worker.onmessage = (event) => {
        globalThis.clearTimeout(timeoutId);
        if (!event.data?.ok || !event.data.result) {
          reject(new Error(event.data?.error ?? "worker-processing-failed"));
          return;
        }
        resolve(event.data.result);
      };
      worker.onerror = (event) => {
        globalThis.clearTimeout(timeoutId);
        reject(event.error ?? new Error("worker-processing-failed"));
      };
      worker.postMessage(payload);
    });
    return result;
  } catch {
    return processOnMainThread(payload);
  } finally {
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
  }
};

export {
  processSeriesDataInWorker
};
//# sourceMappingURL=chunk-BH4J3NKQ.js.map