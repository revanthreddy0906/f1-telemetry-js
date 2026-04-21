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

// src/performance.ts
var performance_exports = {};
__export(performance_exports, {
  findNearestIndex: () => findNearestIndex,
  processSeriesData: () => processSeriesData,
  processSeriesDataInWorker: () => processSeriesDataInWorker
});
module.exports = __toCommonJS(performance_exports);

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
var normalizeTimeSeries = (time, seriesMap) => {
  if (time.length < 2) {
    return { time, seriesMap };
  }
  const sortedIndices = Array.from({ length: time.length }, (_, index) => index).sort(
    (left, right) => time[left] - time[right]
  );
  const isAlreadySorted = sortedIndices.every((index, sortedPosition) => index === sortedPosition);
  const orderedTime = isAlreadySorted ? time : sortedIndices.map((index) => time[index]);
  const orderedSeries = isAlreadySorted ? seriesMap : Object.fromEntries(
    Object.entries(seriesMap).map(([key, series]) => [key, sortedIndices.map((index) => series[index])])
  );
  const dedupedTime = [];
  const dedupedSeries = Object.fromEntries(
    Object.keys(orderedSeries).map((key) => [key, []])
  );
  const timeToIndex = /* @__PURE__ */ new Map();
  orderedTime.forEach((value, index) => {
    const existingIndex = timeToIndex.get(value);
    if (existingIndex === void 0) {
      dedupedTime.push(value);
      const nextIndex = dedupedTime.length - 1;
      timeToIndex.set(value, nextIndex);
      Object.entries(orderedSeries).forEach(([key, series]) => {
        dedupedSeries[key].push(series[index]);
      });
      return;
    }
    Object.entries(orderedSeries).forEach(([key, series]) => {
      dedupedSeries[key][existingIndex] = series[index];
    });
  });
  return { time: dedupedTime, seriesMap: dedupedSeries };
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
var resolveAdaptiveConfig = (timeLength, processing) => {
  const configuredMaxPoints = processing?.maxPoints;
  const viewportWidth = processing?.adaptive?.viewportWidth;
  const chartType = processing?.adaptive?.chartType ?? "line";
  const chartMultiplier = {
    line: 1.8,
    track: 1.2,
    scatter: 1,
    bar: 1.4
  };
  const viewportDerivedPoints = typeof viewportWidth === "number" && Number.isFinite(viewportWidth) && viewportWidth > 0 ? Math.max(200, Math.floor(viewportWidth * chartMultiplier[chartType])) : void 0;
  const maxPointsCandidates = [configuredMaxPoints, viewportDerivedPoints, timeLength].filter((value) => typeof value === "number" && Number.isFinite(value) && value > 1).map((value) => Math.floor(value));
  const resolvedMaxPoints = maxPointsCandidates.length > 0 ? Math.min(...maxPointsCandidates) : Math.min(1500, timeLength);
  const compressionRatio = timeLength / Math.max(resolvedMaxPoints, 1);
  const strategy = compressionRatio > 3 || chartType === "line" || chartType === "track" ? "min-max" : "every-nth";
  return { strategy, maxPoints: resolvedMaxPoints };
};
var applyDownsampling = (time, seriesMap, processing) => {
  const strategy = processing?.downsampleStrategy ?? "every-nth";
  const adaptive = strategy === "adaptive" ? resolveAdaptiveConfig(time.length, processing) : null;
  const maxPoints = adaptive ? adaptive.maxPoints : processing?.maxPoints;
  if (typeof maxPoints !== "number" || maxPoints < 2 || time.length <= maxPoints) {
    return { time, seriesMap };
  }
  const basisKey = Object.keys(seriesMap)[0];
  const basisSeries = basisKey ? seriesMap[basisKey] : time;
  const indices = (adaptive ? adaptive.strategy : strategy) === "min-max" ? downsampleMinMax(basisSeries, maxPoints) : downsampleEveryNth(time.length, maxPoints);
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
  const normalized = normalizeTimeSeries(aligned.time, aligned.seriesMap);
  const windowed = applyWindow(normalized.time, normalized.seriesMap, processing);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findNearestIndex,
  processSeriesData,
  processSeriesDataInWorker
});
//# sourceMappingURL=performance.cjs.map