"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react.ts
var react_exports = {};
__export(react_exports, {
  EnergyChart: () => EnergyChart,
  GapChart: () => GapChart,
  GearChart: () => GearChart,
  LapComparisonChart: () => LapComparisonChart,
  MiniSectors: () => MiniSectors,
  PitStopTimeline: () => PitStopTimeline,
  PositionChart: () => PositionChart,
  RadarChart: () => RadarChart,
  SpeedChart: () => SpeedChart,
  SpeedHeatmapTrackMap: () => SpeedHeatmapTrackMap,
  TelemetryDashboard: () => TelemetryDashboard,
  TelemetryPlayground: () => TelemetryPlayground,
  TelemetryProvider: () => TelemetryProvider,
  ThrottleBrakeChart: () => ThrottleBrakeChart,
  TrackMap: () => TrackMap,
  TyreStrategyTimeline: () => TyreStrategyTimeline,
  WeatherWidget: () => WeatherWidget,
  createLineAnnotationDatasets: () => createLineAnnotationDatasets,
  createTelemetryCssVariables: () => createTelemetryCssVariables,
  createTrackAnnotationDataset: () => createTrackAnnotationDataset,
  createTrackAnnotationDatasets: () => createTrackAnnotationDatasets,
  telemetryCssVariables: () => telemetryCssVariables,
  useAutoTheme: () => useAutoTheme,
  useChartExport: () => useChartExport,
  useCursorSync: () => useCursorSync,
  useTelemetry: () => useTelemetry,
  useTelemetryContext: () => useTelemetryContext
});
module.exports = __toCommonJS(react_exports);

// src/components/SpeedChart.tsx
var import_react3 = require("react");

// src/components/chartTheme.ts
var DARK_TOKENS = {
  background: "#10131a",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#f5f8ff",
  mutedText: "#9da6ba",
  grid: "rgba(255, 255, 255, 0.1)",
  primary: "#56b8ff",
  primarySoft: "rgba(86, 184, 255, 0.2)",
  accent: "#6ee7b7",
  danger: "#ff7f9f",
  shadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
  focusRing: "0 0 0 3px rgba(86, 184, 255, 0.35)"
};
var LIGHT_TOKENS = {
  background: "#ffffff",
  border: "rgba(15, 23, 42, 0.12)",
  text: "#0f172a",
  mutedText: "#475569",
  grid: "rgba(148, 163, 184, 0.35)",
  primary: "#0073ff",
  primarySoft: "rgba(0, 115, 255, 0.15)",
  accent: "#0f9f6e",
  danger: "#dc3f66",
  shadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  focusRing: "0 0 0 3px rgba(0, 115, 255, 0.22)"
};
var HIGH_CONTRAST_TOKENS = {
  background: "#000000",
  border: "#ffffff",
  text: "#ffffff",
  mutedText: "#e5e7eb",
  grid: "rgba(255, 255, 255, 0.4)",
  primary: "#00e5ff",
  primarySoft: "rgba(0, 229, 255, 0.25)",
  accent: "#c8ff00",
  danger: "#ff4d4d",
  shadow: "0 0 0 2px #ffffff",
  focusRing: "0 0 0 3px rgba(255, 255, 255, 0.9)"
};
var TELEMETRY_CSS_VARIABLES = {
  background: "--f1-telemetry-background",
  border: "--f1-telemetry-border",
  text: "--f1-telemetry-text",
  mutedText: "--f1-telemetry-muted-text",
  grid: "--f1-telemetry-grid",
  primary: "--f1-telemetry-primary",
  primarySoft: "--f1-telemetry-primary-soft",
  accent: "--f1-telemetry-accent",
  danger: "--f1-telemetry-danger",
  shadow: "--f1-telemetry-shadow",
  focusRing: "--f1-telemetry-focus-ring"
};
var readCssVariable = (name) => {
  if (typeof document === "undefined") {
    return null;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : null;
};
var fromCssVariables = () => Object.fromEntries(
  Object.entries(TELEMETRY_CSS_VARIABLES).map(([key, cssVariable]) => [key, readCssVariable(cssVariable)]).filter(([, value]) => value !== null)
);
var telemetryCssVariables = TELEMETRY_CSS_VARIABLES;
var createTelemetryCssVariables = (tokens) => Object.fromEntries(
  Object.entries(tokens).flatMap(([key, value]) => {
    if (!value || !(key in TELEMETRY_CSS_VARIABLES)) {
      return [];
    }
    return [[TELEMETRY_CSS_VARIABLES[key], value]];
  })
);
var resolveThemeTokens = (theme = "dark", overrides) => ({
  ...theme === "light" ? LIGHT_TOKENS : theme === "high-contrast" ? HIGH_CONTRAST_TOKENS : DARK_TOKENS,
  ...fromCssVariables(),
  ...overrides
});
var getCardStyle = (theme = "dark", height = 320, styleTokens) => {
  const palette = resolveThemeTokens(theme, styleTokens);
  return {
    height,
    background: palette.background,
    border: `1px solid ${palette.border}`,
    borderRadius: 14,
    padding: 16,
    boxShadow: palette.shadow
  };
};
var getTitleStyle = (theme = "dark", styleTokens) => {
  const palette = resolveThemeTokens(theme, styleTokens);
  return {
    margin: "0 0 12px",
    color: palette.text,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.02em"
  };
};
var createLineOptions = (palette, yAxisLabel, yRange) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: {
    mode: "nearest",
    intersect: false
  },
  plugins: {
    legend: {
      labels: {
        color: palette.text
      }
    },
    tooltip: {
      displayColors: true
    }
  },
  scales: {
    x: {
      type: "linear",
      title: {
        display: true,
        text: "Time (s)",
        color: palette.mutedText
      },
      ticks: {
        color: palette.mutedText
      },
      grid: {
        color: palette.grid
      }
    },
    y: {
      title: {
        display: true,
        text: yAxisLabel,
        color: palette.mutedText
      },
      ticks: {
        color: palette.mutedText
      },
      grid: {
        color: palette.grid
      },
      ...yRange
    }
  }
});
var createTrackMapOptions = (palette) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      labels: {
        color: palette.text
      }
    }
  },
  scales: {
    x: {
      type: "linear",
      title: {
        display: true,
        text: "X coordinate",
        color: palette.mutedText
      },
      ticks: {
        color: palette.mutedText
      },
      grid: {
        color: palette.grid
      }
    },
    y: {
      type: "linear",
      title: {
        display: true,
        text: "Y coordinate",
        color: palette.mutedText
      },
      ticks: {
        color: palette.mutedText
      },
      grid: {
        color: palette.grid
      }
    }
  }
});

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

// src/utils/plugins.ts
var createCursorLinePlugin = (cursorTime, color) => ({
  id: "f1-telemetry-cursor-line",
  afterDatasetsDraw: (chart) => {
    if (cursorTime === null || cursorTime === void 0) {
      return;
    }
    const xScale = chart.scales.x;
    const chartArea = chart.chartArea;
    if (!xScale || !chartArea) {
      return;
    }
    const x = xScale.getPixelForValue(cursorTime);
    if (!Number.isFinite(x) || x < chartArea.left || x > chartArea.right) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  }
});
var createSectorMarkersPlugin = (markers, color) => ({
  id: "f1-telemetry-sector-markers",
  beforeDatasetsDraw: (chart) => {
    if (!markers || markers.length === 0) {
      return;
    }
    const xScale = chart.scales.x;
    const chartArea = chart.chartArea;
    if (!xScale || !chartArea) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    markers.forEach((marker) => {
      const x = xScale.getPixelForValue(marker);
      if (!Number.isFinite(x) || x < chartArea.left || x > chartArea.right) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();
    });
    ctx.restore();
  }
});
var annotationLabelFor = (annotation) => {
  if (annotation.label) {
    return annotation.label;
  }
  if (annotation.type === "corner") {
    return "Corner";
  }
  if (annotation.type === "drs") {
    return "DRS";
  }
  return "Incident";
};
var createAnnotationMarkersPlugin = (annotations, color, textColor) => ({
  id: "f1-telemetry-annotations",
  afterDatasetsDraw: (chart) => {
    if (!annotations || annotations.length === 0) {
      return;
    }
    const xScale = chart.scales.x;
    const chartArea = chart.chartArea;
    if (!xScale || !chartArea) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = textColor;
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    annotations.forEach((annotation) => {
      if (annotation.time === void 0) {
        return;
      }
      const x = xScale.getPixelForValue(annotation.time);
      if (!Number.isFinite(x) || x < chartArea.left || x > chartArea.right) {
        return;
      }
      ctx.beginPath();
      ctx.setLineDash([2, 3]);
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      const label = annotationLabelFor(annotation);
      ctx.fillText(label, x + 4, chartArea.top + 4);
    });
    ctx.restore();
  }
});

// src/utils/annotations.ts
var TYPE_COLORS = {
  corner: "primary",
  drs: "accent",
  incident: "danger"
};
var TYPE_LABELS = {
  corner: "Corners",
  drs: "DRS Zones",
  incident: "Incidents"
};
var createLineAnnotationDatasets = (annotations, time, valueSeries, palette) => {
  if (!annotations || annotations.length === 0 || time.length === 0) {
    return [];
  }
  const grouped = /* @__PURE__ */ new Map();
  annotations.forEach((annotation) => {
    const annotationTime = annotation.time;
    if (annotationTime === void 0) {
      return;
    }
    const index = findNearestIndex(time, annotationTime);
    if (index < 0) {
      return;
    }
    const points = grouped.get(annotation.type) ?? [];
    points.push({
      x: time[index],
      y: valueSeries[index]
    });
    grouped.set(annotation.type, points);
  });
  return Array.from(grouped.entries()).map(([type, points]) => {
    const color = palette[TYPE_COLORS[type]];
    const pointStyle = type === "corner" ? "triangle" : type === "drs" ? "rectRounded" : "crossRot";
    return {
      label: TYPE_LABELS[type],
      data: points,
      showLine: false,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointStyle,
      borderColor: color,
      backgroundColor: color
    };
  });
};
var createTrackAnnotationDataset = (annotations, trackPoints, time, palette) => {
  if (!annotations || annotations.length === 0) {
    return [];
  }
  const byType = /* @__PURE__ */ new Map();
  annotations.forEach((annotation) => {
    if (typeof annotation.x === "number" && typeof annotation.y === "number") {
      const points = byType.get(annotation.type) ?? [];
      points.push({ x: annotation.x, y: annotation.y });
      byType.set(annotation.type, points);
      return;
    }
    if (typeof annotation.time === "number" && time.length > 0) {
      const index = findNearestIndex(time, annotation.time);
      if (index >= 0 && trackPoints[index]) {
        const points = byType.get(annotation.type) ?? [];
        points.push(trackPoints[index]);
        byType.set(annotation.type, points);
      }
    }
  });
  return Array.from(byType.entries()).map(([type, points]) => {
    const color = palette[TYPE_COLORS[type]];
    const pointStyle = type === "corner" ? "triangle" : type === "drs" ? "rectRounded" : "crossRot";
    return {
      label: TYPE_LABELS[type],
      data: points,
      showLine: false,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointStyle,
      borderColor: color,
      backgroundColor: color
    };
  });
};
var createTrackAnnotationDatasets = createTrackAnnotationDataset;

// src/components/TelemetryCard.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var TelemetryCard = ({
  theme = "dark",
  height = 320,
  className,
  title,
  styleTokens,
  ariaLabel,
  defaultAriaLabel,
  children
}) => {
  const [isFocused, setIsFocused] = (0, import_react.useState)(false);
  const palette = (0, import_react.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "section",
    {
      role: "figure",
      "aria-label": ariaLabel ?? defaultAriaLabel,
      tabIndex: 0,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      className,
      style: {
        ...getCardStyle(theme, height, styleTokens),
        boxShadow: isFocused ? `${palette.shadow}, ${palette.focusRing}` : palette.shadow,
        outline: "none"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: getTitleStyle(theme, styleTokens), children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "calc(100% - 26px)" }, children })
      ]
    }
  );
};

// src/components/ClientChart.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ClientChart = (props) => {
  const [charts, setCharts] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    let mounted = true;
    import("react-chartjs-2").then((module2) => {
      if (mounted) {
        setCharts(module2);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!charts) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        role: "img",
        "aria-label": props.ariaLabel ?? "Loading telemetry chart",
        style: {
          width: "100%",
          height: "100%",
          borderRadius: 10,
          background: "rgba(127, 127, 127, 0.08)"
        }
      }
    );
  }
  if (props.type === "line") {
    const Line = charts.Line;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Line,
      {
        data: props.data,
        options: props.options,
        plugins: props.plugins,
        "aria-label": props.ariaLabel
      }
    );
  }
  if (props.type === "radar") {
    const Radar = charts.Radar;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Radar,
      {
        data: props.data,
        options: props.options,
        plugins: props.plugins,
        "aria-label": props.ariaLabel
      }
    );
  }
  const Scatter = charts.Scatter;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    Scatter,
    {
      data: props.data,
      options: props.options,
      plugins: props.plugins,
      "aria-label": props.ariaLabel
    }
  );
};

// src/utils/chartSetup.ts
var import_chart = require("chart.js");
var isChartSetupComplete = false;
var ensureChartSetup = () => {
  if (isChartSetupComplete) {
    return;
  }
  import_chart.Chart.register(
    import_chart.CategoryScale,
    import_chart.LinearScale,
    import_chart.PointElement,
    import_chart.LineElement,
    import_chart.RadarController,
    import_chart.RadialLinearScale,
    import_chart.Title,
    import_chart.Tooltip,
    import_chart.Legend,
    import_chart.Filler,
    import_chart.Decimation
  );
  isChartSetupComplete = true;
};

// src/components/SpeedChart.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
ensureChartSetup();
var SpeedChart = (props) => {
  const {
    theme = "dark",
    height = 320,
    className,
    title = "Speed vs Time",
    ariaLabel,
    processing,
    styleTokens,
    showCursor = true,
    cursorTime,
    onCursorTimeChange,
    annotations,
    showAnnotations = true
  } = props;
  const rawTime = props.data?.time ?? props.time ?? [];
  const rawSpeed = props.data?.speed ?? props.speed ?? [];
  const palette = (0, import_react3.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react3.useMemo)(
    () => processSeriesData({
      context: "SpeedChart",
      time: rawTime,
      seriesMap: { speed: rawSpeed },
      processing
    }),
    [rawTime, rawSpeed, processing]
  );
  const points = (0, import_react3.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.speed[index]
    })),
    [processed.time, processed.seriesMap.speed]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? {
    x: processed.time[cursorIndex],
    y: processed.seriesMap.speed[cursorIndex]
  } : null;
  const annotationDatasets = (0, import_react3.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.speed,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.speed, palette]
  );
  const chartData = (0, import_react3.useMemo)(
    () => ({
      datasets: [
        {
          label: "Speed (km/h)",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.28,
          fill: true
        },
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            pointRadius: 4,
            pointHoverRadius: 4,
            showLine: false
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [points, palette, cursorPoint, showCursor, annotationDatasets]
  );
  const options = (0, import_react3.useMemo)(() => {
    const base = createLineOptions(palette, "Speed (km/h)");
    return {
      ...base,
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        const point = points[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, onCursorTimeChange, points]);
  const plugins = (0, import_react3.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry speed chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Speed over time line chart"
        }
      )
    }
  );
};

// src/components/ThrottleBrakeChart.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
ensureChartSetup();
var ThrottleBrakeChart = ({
  time,
  throttle,
  brake,
  theme = "dark",
  height = 320,
  className,
  title = "Throttle & Brake",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react4.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react4.useMemo)(
    () => processSeriesData({
      context: "ThrottleBrakeChart",
      time,
      seriesMap: { throttle, brake },
      processing
    }),
    [time, throttle, brake, processing]
  );
  const throttlePoints = (0, import_react4.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.throttle[index]
    })),
    [processed.time, processed.seriesMap.throttle]
  );
  const brakePoints = (0, import_react4.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.brake[index]
    })),
    [processed.time, processed.seriesMap.brake]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorThrottle = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.throttle[cursorIndex] } : null;
  const cursorBrake = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.brake[cursorIndex] } : null;
  const annotationDatasets = (0, import_react4.useMemo)(
    () => [
      ...createLineAnnotationDatasets(
        showAnnotations ? annotations : void 0,
        processed.time,
        processed.seriesMap.throttle,
        palette
      ),
      ...createLineAnnotationDatasets(
        showAnnotations ? annotations : void 0,
        processed.time,
        processed.seriesMap.brake,
        palette
      )
    ],
    [
      showAnnotations,
      annotations,
      processed.time,
      processed.seriesMap.throttle,
      processed.seriesMap.brake,
      palette
    ]
  );
  const chartData = (0, import_react4.useMemo)(
    () => ({
      datasets: [
        {
          label: "Throttle (%)",
          data: throttlePoints,
          borderColor: palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.2)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "Brake (%)",
          data: brakePoints,
          borderColor: palette.danger,
          backgroundColor: "rgba(255, 127, 159, 0.2)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2
        },
        ...showCursor && cursorThrottle ? [
          {
            label: "Throttle Cursor",
            data: [cursorThrottle],
            borderColor: palette.accent,
            backgroundColor: palette.accent,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...showCursor && cursorBrake ? [
          {
            label: "Brake Cursor",
            data: [cursorBrake],
            borderColor: palette.danger,
            backgroundColor: palette.danger,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [throttlePoints, brakePoints, palette, cursorThrottle, cursorBrake, showCursor, annotationDatasets]
  );
  const options = (0, import_react4.useMemo)(() => {
    const base = createLineOptions(palette, "Input (%)", { min: 0, max: 100 });
    return {
      ...base,
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);
  const plugins = (0, import_react4.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry throttle and brake chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Throttle and brake line chart"
        }
      )
    }
  );
};

// src/components/LapComparisonChart.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
ensureChartSetup();
var LapComparisonChart = ({
  driver1,
  driver2,
  driver1Label,
  driver2Label,
  theme = "dark",
  height = 320,
  className,
  title = "Lap Comparison",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  mode = "overlay",
  sectorMarkers,
  deltaLabel = "Delta (driver2 - driver1)",
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react5.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processedDriver1 = (0, import_react5.useMemo)(
    () => processSeriesData({
      context: "LapComparisonChart.driver1",
      time: driver1.time,
      seriesMap: { speed: driver1.speed },
      processing
    }),
    [driver1.time, driver1.speed, processing]
  );
  const processedDriver2 = (0, import_react5.useMemo)(
    () => processSeriesData({
      context: "LapComparisonChart.driver2",
      time: driver2.time,
      seriesMap: { speed: driver2.speed },
      processing
    }),
    [driver2.time, driver2.speed, processing]
  );
  const overlayData = (0, import_react5.useMemo)(
    () => ({
      driver1: processedDriver1.time.map((value, index) => ({
        x: value,
        y: processedDriver1.seriesMap.speed[index]
      })),
      driver2: processedDriver2.time.map((value, index) => ({
        x: value,
        y: processedDriver2.seriesMap.speed[index]
      }))
    }),
    [processedDriver1.time, processedDriver1.seriesMap.speed, processedDriver2.time, processedDriver2.seriesMap.speed]
  );
  const deltaPoints = (0, import_react5.useMemo)(() => {
    const length = Math.min(processedDriver1.time.length, processedDriver2.time.length);
    return Array.from({ length }, (_, index) => ({
      x: processedDriver1.time[index],
      y: processedDriver2.seriesMap.speed[index] - processedDriver1.seriesMap.speed[index]
    }));
  }, [processedDriver1.time, processedDriver1.seriesMap.speed, processedDriver2.time, processedDriver2.seriesMap.speed]);
  const cursorSeries = mode === "delta" ? deltaPoints : overlayData.driver1;
  const cursorIndex = findNearestIndex(
    cursorSeries.map((point) => point.x),
    cursorTime
  );
  const cursorPoint = cursorIndex >= 0 ? cursorSeries[cursorIndex] : null;
  const annotationSeries = mode === "delta" ? deltaPoints.map((point) => point.y) : processedDriver1.seriesMap.speed;
  const annotationTime = mode === "delta" ? deltaPoints.map((point) => point.x) : processedDriver1.time;
  const annotationDatasets = (0, import_react5.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      annotationTime,
      annotationSeries,
      palette
    ),
    [showAnnotations, annotations, annotationTime, annotationSeries, palette]
  );
  const chartData = (0, import_react5.useMemo)(
    () => mode === "delta" ? {
      datasets: [
        {
          label: deltaLabel,
          data: deltaPoints,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.22,
          fill: true
        },
        ...showCursor && cursorPoint ? [
          {
            label: "Delta Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    } : {
      datasets: [
        {
          label: driver1Label ?? driver1.label ?? "Driver 1",
          data: overlayData.driver1,
          borderColor: driver1.color ?? palette.primary,
          backgroundColor: "rgba(86, 184, 255, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: driver2Label ?? driver2.label ?? "Driver 2",
          data: overlayData.driver2,
          borderColor: driver2.color ?? palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.25
        },
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    },
    [
      mode,
      deltaLabel,
      deltaPoints,
      palette,
      cursorPoint,
      showCursor,
      annotationDatasets,
      driver1Label,
      driver1.label,
      driver1.color,
      overlayData.driver1,
      driver2Label,
      driver2.label,
      driver2.color,
      overlayData.driver2
    ]
  );
  const options = (0, import_react5.useMemo)(() => {
    const base = createLineOptions(palette, mode === "delta" ? "Delta Speed (km/h)" : "Speed (km/h)");
    return {
      ...base,
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        const source = mode === "delta" ? deltaPoints : overlayData.driver1;
        onCursorTimeChange(source[elements[0].index]?.x ?? null);
      }
    };
  }, [palette, mode, onCursorTimeChange, deltaPoints, overlayData.driver1]);
  const plugins = (0, import_react5.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      createSectorMarkersPlugin(sectorMarkers, palette.grid),
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [
      showCursor,
      cursorTime,
      palette.mutedText,
      palette.grid,
      sectorMarkers,
      showAnnotations,
      annotations
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry lap comparison chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Lap comparison line chart"
        }
      )
    }
  );
};

// src/components/TrackMap.tsx
var import_react6 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
ensureChartSetup();
var TrackMap = ({
  x,
  y,
  time,
  theme = "dark",
  height = 360,
  className,
  title = "Track Map",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react6.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const timeAxis = (0, import_react6.useMemo)(() => time ?? x.map((_, index) => index), [time, x]);
  const processed = (0, import_react6.useMemo)(
    () => processSeriesData({
      context: "TrackMap",
      time: timeAxis,
      seriesMap: { x, y },
      processing
    }),
    [timeAxis, x, y, processing]
  );
  const points = (0, import_react6.useMemo)(
    () => processed.seriesMap.x.map((xValue, index) => ({
      x: xValue,
      y: processed.seriesMap.y[index]
    })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const annotationDatasets = (0, import_react6.useMemo)(
    () => createTrackAnnotationDataset(
      showAnnotations ? annotations : void 0,
      points,
      processed.time,
      palette
    ),
    [showAnnotations, annotations, points, processed.time, palette]
  );
  const data = (0, import_react6.useMemo)(
    () => ({
      datasets: [
        {
          label: "Car Position",
          data: points,
          showLine: true,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          borderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 8,
          tension: 0.12
        },
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor Position",
            data: [cursorPoint],
            showLine: false,
            borderColor: palette.accent,
            backgroundColor: palette.accent,
            pointRadius: 5
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [points, palette, cursorPoint, showCursor, annotationDatasets]
  );
  const options = (0, import_react6.useMemo)(() => {
    const base = createTrackMapOptions(palette);
    return {
      ...base,
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry track map chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        ClientChart,
        {
          type: "scatter",
          data,
          options,
          ariaLabel: ariaLabel ?? "Track map scatter chart"
        }
      )
    }
  );
};

// src/components/TelemetryDashboard.tsx
var import_react7 = require("react");

// src/extensions/registry.ts
var panelRegistry = /* @__PURE__ */ new Map();
var getTelemetryPanels = () => Array.from(panelRegistry.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

// src/components/TelemetryDashboard.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var LAYOUT_STORAGE_PREFIX = "f1-telemetry-layout";
var sortPanels = (panels) => [...panels].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
var clampWidth = (value) => {
  if (value <= 1) {
    return 1;
  }
  if (value >= 3) {
    return 3;
  }
  return 2;
};
var defaultPanelWidth = (panelId) => panelId === "default-track-map" || panelId === "default-lap-comparison" ? 2 : 1;
var createLayoutFromIds = (panelIds, input) => {
  const inputItems = input?.items ?? [];
  const fromInput = new Map(inputItems.map((item) => [item.id, item]));
  const items = panelIds.map((id, index) => {
    const existing = fromInput.get(id);
    return {
      id,
      order: typeof existing?.order === "number" ? existing.order : index,
      width: clampWidth(existing?.width ?? defaultPanelWidth(id)),
      hidden: existing?.hidden ?? false
    };
  });
  items.sort((left, right) => left.order - right.order);
  return {
    items: items.map((item, index) => ({ ...item, order: index }))
  };
};
var getLayoutStorageKey = (key) => `${LAYOUT_STORAGE_PREFIX}:${key}`;
var getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return null;
  }
  return storage;
};
var loadLayout = (key, panelIds, fallback) => {
  const safeFallback = createLayoutFromIds(panelIds, fallback);
  const storage = getStorage();
  if (!storage) {
    return safeFallback;
  }
  try {
    const raw = storage.getItem(getLayoutStorageKey(key));
    if (!raw) {
      return safeFallback;
    }
    const parsed = JSON.parse(raw);
    return createLayoutFromIds(panelIds, parsed);
  } catch {
    return safeFallback;
  }
};
var controlButtonStyle = (border, background, text) => ({
  border: `1px solid ${border}`,
  background,
  color: text,
  borderRadius: 8,
  padding: "4px 8px",
  fontSize: 12,
  cursor: "pointer"
});
var TelemetryDashboard = ({
  telemetry,
  comparison,
  lapMode = "overlay",
  sectorMarkers,
  annotations,
  theme = "dark",
  styleTokens,
  processing,
  syncCursor = true,
  className,
  chartHeight = 320,
  trackMapHeight = 360,
  panelGap = 16,
  minPanelWidth = 320,
  includeDefaultPanels = true,
  extensions = [],
  enableLayoutEditor = true,
  persistLayout = true,
  layoutStorageKey = "default",
  defaultLayout,
  onLayoutChange
}) => {
  const [cursorTime, setCursorTime] = (0, import_react7.useState)(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : void 0;
  const palette = (0, import_react7.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const driver2 = (0, import_react7.useMemo)(
    () => comparison ?? {
      time: telemetry.time,
      speed: telemetry.speed,
      label: "Comparison"
    },
    [comparison, telemetry.time, telemetry.speed]
  );
  const extensionPanels = (0, import_react7.useMemo)(() => {
    const allPanels = /* @__PURE__ */ new Map();
    getTelemetryPanels().forEach((panel) => allPanels.set(panel.id, panel));
    extensions.forEach((panel) => allPanels.set(panel.id, panel));
    return sortPanels(Array.from(allPanels.values()));
  }, [extensions]);
  const panelDefinitions = (0, import_react7.useMemo)(() => {
    const definitions = [];
    if (includeDefaultPanels) {
      definitions.push(
        {
          id: "default-speed",
          title: "Speed",
          render: (context) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            SpeedChart,
            {
              title: "Speed",
              time: context.telemetry.time,
              speed: context.telemetry.speed,
              theme: context.theme,
              processing: context.processing,
              styleTokens: context.styleTokens,
              annotations: context.annotations,
              height: chartHeight,
              cursorTime: context.cursorTime,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          )
        },
        {
          id: "default-inputs",
          title: "Driver Inputs",
          render: (context) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            ThrottleBrakeChart,
            {
              title: "Driver Inputs",
              time: context.telemetry.time,
              throttle: context.telemetry.throttle,
              brake: context.telemetry.brake,
              theme: context.theme,
              processing: context.processing,
              styleTokens: context.styleTokens,
              annotations: context.annotations,
              height: chartHeight,
              cursorTime: context.cursorTime,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          )
        },
        {
          id: "default-lap-comparison",
          title: lapMode === "delta" ? "Lap Delta" : "Lap Comparison",
          render: (context) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            LapComparisonChart,
            {
              title: context.lapMode === "delta" ? "Lap Delta" : "Lap Comparison",
              driver1: { time: context.telemetry.time, speed: context.telemetry.speed, label: "Driver 1" },
              driver2: context.comparison ?? driver2,
              mode: context.lapMode,
              sectorMarkers: context.sectorMarkers,
              annotations: context.annotations,
              theme: context.theme,
              processing: context.processing,
              styleTokens: context.styleTokens,
              height: chartHeight,
              cursorTime: context.cursorTime,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          )
        },
        {
          id: "default-track-map",
          title: "Track Position",
          render: (context) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            TrackMap,
            {
              title: "Track Position",
              x: context.telemetry.x,
              y: context.telemetry.y,
              time: context.telemetry.time,
              annotations: context.annotations,
              theme: context.theme,
              processing: context.processing,
              styleTokens: context.styleTokens,
              height: trackMapHeight,
              cursorTime: context.cursorTime,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          )
        }
      );
    }
    extensionPanels.forEach((panel) => {
      definitions.push({
        id: panel.id,
        title: panel.title ?? panel.id,
        extension: panel,
        render: (context) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, { children: panel.render(context) })
      });
    });
    return definitions;
  }, [
    includeDefaultPanels,
    extensionPanels,
    chartHeight,
    trackMapHeight,
    syncCursor,
    onCursorChange,
    lapMode,
    driver2
  ]);
  const panelIds = (0, import_react7.useMemo)(() => panelDefinitions.map((panel) => panel.id), [panelDefinitions]);
  const [layout, setLayout] = (0, import_react7.useState)(
    () => persistLayout ? loadLayout(layoutStorageKey, panelIds, defaultLayout) : createLayoutFromIds(panelIds, defaultLayout)
  );
  (0, import_react7.useEffect)(() => {
    setLayout((current) => createLayoutFromIds(panelIds, current.items.length > 0 ? current : defaultLayout));
  }, [panelIds, defaultLayout]);
  (0, import_react7.useEffect)(() => {
    const storage = getStorage();
    if (!persistLayout || !storage) {
      onLayoutChange?.(layout);
      return;
    }
    storage.setItem(getLayoutStorageKey(layoutStorageKey), JSON.stringify(layout));
    onLayoutChange?.(layout);
  }, [layout, persistLayout, layoutStorageKey, onLayoutChange]);
  const channelValuesRef = (0, import_react7.useRef)(/* @__PURE__ */ new Map());
  const channelListenersRef = (0, import_react7.useRef)(/* @__PURE__ */ new Map());
  const shared = (0, import_react7.useMemo)(
    () => ({
      publish: (channel, payload) => {
        channelValuesRef.current.set(channel, payload);
        const listeners = channelListenersRef.current.get(channel);
        listeners?.forEach((listener) => listener(payload));
      },
      read: (channel) => channelValuesRef.current.get(channel),
      subscribe: (channel, listener) => {
        const listeners = channelListenersRef.current.get(channel) ?? /* @__PURE__ */ new Set();
        listeners.add(listener);
        channelListenersRef.current.set(channel, listeners);
        return () => {
          const nextListeners = channelListenersRef.current.get(channel);
          if (!nextListeners) {
            return;
          }
          nextListeners.delete(listener);
          if (nextListeners.size === 0) {
            channelListenersRef.current.delete(channel);
          }
        };
      }
    }),
    []
  );
  const basePanelContext = (0, import_react7.useMemo)(
    () => ({
      telemetry,
      comparison: driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      setCursorTime,
      shared
    }),
    [telemetry, driver2, lapMode, sectorMarkers, annotations, theme, styleTokens, processing, shared]
  );
  const createPanelContext = (0, import_react7.useCallback)(
    (panelId) => ({
      panelId,
      ...basePanelContext,
      cursorTime: sharedCursor
    }),
    [basePanelContext, sharedCursor]
  );
  const createLifecycleContext = (0, import_react7.useCallback)(
    (panelId) => ({
      panelId,
      ...basePanelContext,
      cursorTime: null
    }),
    [basePanelContext]
  );
  (0, import_react7.useEffect)(() => {
    extensionPanels.forEach((panel) => {
      panel.onMount?.(createLifecycleContext(panel.id));
    });
    return () => {
      extensionPanels.forEach((panel) => {
        panel.onUnmount?.(createLifecycleContext(panel.id));
      });
    };
  }, [extensionPanels, createLifecycleContext]);
  const definitionById = (0, import_react7.useMemo)(
    () => new Map(panelDefinitions.map((definition) => [definition.id, definition])),
    [panelDefinitions]
  );
  const orderedItems = (0, import_react7.useMemo)(
    () => [...layout.items].sort((left, right) => left.order - right.order),
    [layout.items]
  );
  const visibleItems = orderedItems.filter((item) => !item.hidden && definitionById.has(item.id));
  const updateLayoutItems = (0, import_react7.useCallback)(
    (updater) => {
      setLayout((current) => ({
        items: updater([...current.items]).map((item, index) => ({
          ...item,
          order: index
        }))
      }));
    },
    []
  );
  const moveItem = (id, delta) => {
    updateLayoutItems((items) => {
      const index = items.findIndex((item2) => item2.id === id);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= items.length) {
        return items;
      }
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };
  const resizeItem = (id, delta) => {
    updateLayoutItems(
      (items) => items.map(
        (item) => item.id === id ? {
          ...item,
          width: clampWidth(item.width + delta)
        } : item
      )
    );
  };
  const toggleItemVisibility = (id) => {
    updateLayoutItems(
      (items) => items.map((item) => item.id === id ? { ...item, hidden: !item.hidden } : item)
    );
  };
  const resetLayout = () => {
    setLayout(createLayoutFromIds(panelIds, defaultLayout));
  };
  const renderContextAction = (action, context, key) => {
    if (action.isVisible && !action.isVisible(context)) {
      return null;
    }
    const disabled = action.isDisabled?.(context) ?? false;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        type: "button",
        onClick: () => action.onSelect(context),
        disabled,
        style: controlButtonStyle(palette.border, palette.primarySoft, palette.text),
        children: action.label
      },
      key
    );
  };
  const cssTokenStyle = (0, import_react7.useMemo)(
    () => createTelemetryCssVariables(styleTokens ?? {}),
    [styleTokens]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "grid", gap: panelGap }, children: [
    enableLayoutEditor ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "section",
      {
        style: {
          ...cssTokenStyle,
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          background: palette.background,
          color: palette.text,
          boxShadow: palette.shadow,
          padding: 12
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: "Layout Editor" }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: resetLayout, style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: "Reset Layout" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { display: "grid", gap: 8 }, children: orderedItems.map((item) => {
            const definition = definitionById.get(item.id);
            if (!definition) {
              return null;
            }
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto auto auto",
                  gap: 6,
                  alignItems: "center"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { fontSize: 13 }, children: definition.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: () => moveItem(item.id, -1), style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: "Up" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: () => moveItem(item.id, 1), style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: "Down" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: () => resizeItem(item.id, -1), style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: "-" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: () => resizeItem(item.id, 1), style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: "+" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", onClick: () => toggleItemVisibility(item.id), style: controlButtonStyle(palette.border, palette.primarySoft, palette.text), children: item.hidden ? "Show" : "Hide" })
                ]
              },
              `editor-${item.id}`
            );
          }) })
        ]
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        className,
        style: {
          ...cssTokenStyle,
          display: "grid",
          gap: panelGap,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minPanelWidth}px, 1fr))`
        },
        children: visibleItems.map((item) => {
          const definition = definitionById.get(item.id);
          if (!definition) {
            return null;
          }
          const context = createPanelContext(item.id);
          const actions = definition.extension?.contextMenuActions ?? [];
          return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { gridColumn: `span ${item.width}` }, children: [
            actions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }, children: actions.map((action) => renderContextAction(action, context, `${item.id}:${action.id}`)) }) : null,
            definition.render(context)
          ] }, item.id);
        })
      }
    ),
    visibleItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { style: { color: palette.mutedText, margin: 0 }, children: "No dashboard panels are visible. Use Layout Editor to show panels." }) : null
  ] });
};

// src/components/GearChart.tsx
var import_react8 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
ensureChartSetup();
var createGearBandPlugin = (enabled, color) => ({
  id: "f1-telemetry-gear-bands",
  beforeDatasetsDraw: (chart) => {
    if (!enabled) {
      return;
    }
    const yScale = chart.scales.y;
    const chartArea = chart.chartArea;
    if (!yScale || !chartArea) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.fillStyle = color;
    for (let gear = 0; gear < 8; gear += 1) {
      if (gear % 2 !== 0) {
        continue;
      }
      const top = yScale.getPixelForValue(gear + 0.5);
      const bottom = yScale.getPixelForValue(gear - 0.5);
      const height = bottom - top;
      ctx.fillRect(chartArea.left, top, chartArea.right - chartArea.left, height);
    }
    ctx.restore();
  }
});
var GearChart = ({
  time,
  gear,
  showGearBands = true,
  theme = "dark",
  height = 320,
  className,
  title = "Gear vs Time",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react8.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react8.useMemo)(
    () => processSeriesData({
      context: "GearChart",
      time,
      seriesMap: { gear },
      processing
    }),
    [time, gear, processing]
  );
  const points = (0, import_react8.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: Math.max(0, Math.min(8, Math.round(processed.seriesMap.gear[index])))
    })),
    [processed.time, processed.seriesMap.gear]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const annotationDatasets = (0, import_react8.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      points.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, processed.time, points, palette]
  );
  const chartData = (0, import_react8.useMemo)(
    () => ({
      datasets: [
        {
          label: "Gear",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          stepped: "before",
          tension: 0,
          fill: true
        },
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [points, palette, showCursor, cursorPoint, annotationDatasets]
  );
  const options = (0, import_react8.useMemo)(() => {
    const base = createLineOptions(palette, "Gear", { min: 0, max: 8 });
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          min: 0,
          max: 8,
          ticks: {
            stepSize: 1,
            color: palette.mutedText
          }
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        onCursorTimeChange(points[elements[0].index]?.x ?? null);
      }
    };
  }, [palette, onCursorTimeChange, points]);
  const plugins = (0, import_react8.useMemo)(
    () => [
      createGearBandPlugin(showGearBands, palette.primarySoft),
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [
      showGearBands,
      palette.primarySoft,
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry gear chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Gear over time chart"
        }
      )
    }
  );
};

// src/components/EnergyChart.tsx
var import_react9 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
ensureChartSetup();
var EnergyChart = ({
  time,
  ersDeployment,
  ersHarvest,
  batteryLevel,
  showBatteryLevel = true,
  theme = "dark",
  height = 320,
  className,
  title = "ERS Energy",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react9.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react9.useMemo)(
    () => processSeriesData({
      context: "EnergyChart",
      time,
      seriesMap: {
        deployment: ersDeployment,
        harvest: ersHarvest,
        battery: batteryLevel ?? ersDeployment.map(() => 0)
      },
      processing
    }),
    [time, ersDeployment, ersHarvest, batteryLevel, processing]
  );
  const deploymentPoints = (0, import_react9.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.deployment[index]
    })),
    [processed.time, processed.seriesMap.deployment]
  );
  const harvestPoints = (0, import_react9.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.harvest[index]
    })),
    [processed.time, processed.seriesMap.harvest]
  );
  const batteryPoints = (0, import_react9.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.battery[index]
    })),
    [processed.time, processed.seriesMap.battery]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? deploymentPoints[cursorIndex] : null;
  const annotationDatasets = (0, import_react9.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.deployment,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.deployment, palette]
  );
  const chartData = (0, import_react9.useMemo)(
    () => ({
      datasets: [
        {
          label: "ERS Deployment (%)",
          data: deploymentPoints,
          borderColor: palette.danger,
          backgroundColor: "rgba(255, 127, 159, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2,
          fill: true
        },
        {
          label: "ERS Harvest (%)",
          data: harvestPoints,
          borderColor: palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2,
          fill: true
        },
        ...showBatteryLevel ? [
          {
            label: "Battery Level (%)",
            data: batteryPoints,
            yAxisID: "y1",
            borderColor: palette.primary,
            backgroundColor: "transparent",
            borderDash: [6, 4],
            pointRadius: 0,
            borderWidth: 2,
            tension: 0.2
          }
        ] : [],
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [
      deploymentPoints,
      harvestPoints,
      showBatteryLevel,
      batteryPoints,
      showCursor,
      cursorPoint,
      annotationDatasets,
      palette
    ]
  );
  const options = (0, import_react9.useMemo)(() => {
    const base = createLineOptions(palette, "ERS Power (%)", { min: 0, max: 100 });
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          min: 0,
          max: 100
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: 100,
          title: {
            display: true,
            text: "Battery (%)",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);
  const plugins = (0, import_react9.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry ERS energy chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "ERS deployment, harvest, and battery chart"
        }
      )
    }
  );
};

// src/components/TyreStrategyTimeline.tsx
var import_react10 = require("react");

// src/utils/tyres.ts
var TYRE_COMPOUND_COLORS = {
  soft: "#FF3333",
  medium: "#FFC700",
  hard: "#FFFFFF",
  intermediate: "#47C747",
  wet: "#3D9BE9"
};

// src/components/TyreStrategyTimeline.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var TyreStrategyTimeline = ({
  strategies,
  totalLaps,
  theme = "dark",
  className,
  styleTokens,
  height = 36,
  showLapNumbers = true,
  title = "Tyre Strategy Timeline",
  ariaLabel
}) => {
  const palette = (0, import_react10.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const lapMarkers = (0, import_react10.useMemo)(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from(
      { length: markerCount + 1 },
      (_, index) => Math.round(totalLaps * index / markerCount)
    );
  }, [totalLaps]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, strategies.length * (height + 12) + 92),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Tyre strategy timeline",
      children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "grid", gap: 10, height: "100%" }, children: [
        showLapNumbers ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "div",
          {
            style: {
              position: "relative",
              height: 20,
              borderBottom: `1px solid ${palette.grid}`
            },
            children: lapMarkers.map((marker) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
              "span",
              {
                style: {
                  position: "absolute",
                  left: `${marker / totalLaps * 100}%`,
                  transform: "translateX(-50%)",
                  fontSize: 11,
                  color: palette.mutedText
                },
                children: [
                  "L",
                  marker
                ]
              },
              marker
            ))
          }
        ) : null,
        strategies.map((strategy) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "div",
            {
              style: {
                color: strategy.color ?? palette.text,
                fontWeight: 600,
                fontSize: 12,
                alignSelf: "center"
              },
              children: strategy.driver
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "div",
            {
              style: {
                position: "relative",
                height,
                borderRadius: 8,
                border: `1px solid ${palette.border}`,
                overflow: "hidden",
                background: "rgba(148,163,184,0.06)"
              },
              children: strategy.stints.map((stint, index) => {
                const start = Math.max(1, stint.startLap);
                const end = Math.max(start, stint.endLap);
                const left = (start - 1) / totalLaps * 100;
                const width = (end - start + 1) / totalLaps * 100;
                return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: 0,
                      left: `${left}%`,
                      width: `${width}%`,
                      height: "100%",
                      background: TYRE_COMPOUND_COLORS[stint.compound],
                      color: stint.compound === "hard" ? "#111827" : "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRight: `1px solid rgba(0,0,0,0.2)`
                    },
                    children: stint.label ?? stint.compound
                  },
                  `${strategy.driver}-${stint.compound}-${start}-${end}-${index}`
                );
              })
            }
          )
        ] }, strategy.driver))
      ] })
    }
  );
};

// src/components/GapChart.tsx
var import_react11 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
ensureChartSetup();
var createDriverLabelPlugin = (showLabels, color) => ({
  id: "f1-telemetry-gap-driver-labels",
  afterDatasetsDraw: (chart) => {
    if (!showLabels) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden || meta.data.length === 0) {
        return;
      }
      const abbreviation = (dataset.label ?? "").slice(0, 3).toUpperCase();
      const point = meta.data[meta.data.length - 1];
      if (!point) {
        return;
      }
      ctx.fillText(abbreviation, point.x + 6, point.y);
    });
    ctx.restore();
  }
});
var GapChart = ({
  drivers,
  referenceDriver,
  invertAxis = true,
  showDriverLabels = true,
  theme = "dark",
  height = 320,
  className,
  title = "Gap to Leader",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react11.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processedDrivers = (0, import_react11.useMemo)(
    () => drivers.map((driver) => {
      const laps = driver.data.map((point) => point.lap);
      const gaps = driver.data.map((point) => point.gap);
      const processed = processSeriesData({
        context: `GapChart.${driver.driver}`,
        time: laps,
        seriesMap: { gap: gaps },
        processing
      });
      return {
        ...driver,
        laps: processed.time,
        gaps: processed.seriesMap.gap
      };
    }),
    [drivers, processing]
  );
  const reference = (0, import_react11.useMemo)(
    () => processedDrivers.find((driver) => driver.driver === referenceDriver) ?? processedDrivers.find((driver) => driver.driver.toLowerCase().includes("leader")) ?? processedDrivers[0],
    [processedDrivers, referenceDriver]
  );
  const referenceByLap = (0, import_react11.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    if (!reference) {
      return map;
    }
    reference.laps.forEach((lap, index) => map.set(lap, reference.gaps[index] ?? 0));
    return map;
  }, [reference]);
  const datasets = (0, import_react11.useMemo)(
    () => processedDrivers.map((driver, index) => {
      const color = driver.color ?? [palette.primary, palette.accent, palette.danger, "#FFC700"][index % 4];
      const points = driver.laps.map((lap, lapIndex) => ({
        x: lap,
        y: (driver.gaps[lapIndex] ?? 0) - (referenceByLap.get(lap) ?? 0)
      }));
      return {
        label: driver.driver,
        data: points,
        borderColor: color,
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 8,
        tension: 0.2
      };
    }),
    [processedDrivers, referenceByLap, palette]
  );
  const cursorSource = datasets[0]?.data ?? [];
  const cursorIndex = findNearestIndex(
    cursorSource.map((point) => point.x),
    cursorTime
  );
  const cursorTimePoint = cursorIndex >= 0 ? cursorSource[cursorIndex] : null;
  const annotationData = datasets[0]?.data ?? [];
  const annotationDatasets = (0, import_react11.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      annotationData.map((point) => point.x),
      annotationData.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, annotationData, palette]
  );
  const data = (0, import_react11.useMemo)(
    () => ({
      datasets: [
        ...datasets,
        ...showCursor && cursorTimePoint ? [
          {
            label: "Cursor",
            data: [cursorTimePoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [datasets, showCursor, cursorTimePoint, palette, annotationDatasets]
  );
  const options = (0, import_react11.useMemo)(() => {
    const base = createLineOptions(palette, "Gap to Leader (s)");
    return {
      ...base,
      scales: {
        ...base.scales,
        x: {
          ...base.scales?.x,
          ticks: {
            color: palette.mutedText,
            precision: 0
          },
          title: {
            display: true,
            text: "Lap",
            color: palette.mutedText
          }
        },
        y: {
          ...base.scales?.y,
          reverse: invertAxis
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        const point = datasets[elements[0].datasetIndex]?.data[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, invertAxis, onCursorTimeChange, datasets]);
  const plugins = (0, import_react11.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : [],
      createDriverLabelPlugin(showDriverLabels, palette.text)
    ],
    [
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid,
      showDriverLabels,
      palette.text
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry gap to leader chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        ClientChart,
        {
          type: "line",
          data,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Gap to leader line chart"
        }
      )
    }
  );
};

// src/components/PositionChart.tsx
var import_react12 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
ensureChartSetup();
var withAlpha = (color, alpha) => {
  const hex = color.replace("#", "");
  if (hex.length !== 6) {
    return color;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
var createPositionLabelsPlugin = (highlighted, enabled, color) => ({
  id: "f1-telemetry-position-labels",
  afterDatasetsDraw: (chart) => {
    if (!enabled) {
      return;
    }
    const { ctx } = chart;
    ctx.save();
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const label = dataset.label ?? "";
      if (!highlighted.has(label)) {
        return;
      }
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden || meta.data.length === 0) {
        return;
      }
      const point = meta.data[meta.data.length - 1];
      if (!point) {
        return;
      }
      ctx.fillText(label.slice(0, 3).toUpperCase(), point.x + 5, point.y);
    });
    ctx.restore();
  }
});
var PositionChart = ({
  drivers,
  totalLaps,
  highlightDrivers,
  showDriverLabels = true,
  theme = "dark",
  height = 320,
  className,
  title = "Position Changes",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react12.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const highlighted = (0, import_react12.useMemo)(
    () => new Set((highlightDrivers ?? []).map((driver) => driver.trim())),
    [highlightDrivers]
  );
  const processedDrivers = (0, import_react12.useMemo)(
    () => drivers.map((driver) => {
      const laps = Array.from({ length: Math.min(driver.positions.length, totalLaps) }, (_, index) => index + 1);
      const positions = driver.positions.slice(0, totalLaps);
      const processed = processSeriesData({
        context: `PositionChart.${driver.driver}`,
        time: laps,
        seriesMap: { position: positions },
        processing
      });
      return {
        ...driver,
        laps: processed.time,
        positions: processed.seriesMap.position
      };
    }),
    [drivers, totalLaps, processing]
  );
  const datasets = (0, import_react12.useMemo)(
    () => processedDrivers.map((driver, index) => {
      const highlight = highlighted.size === 0 ? true : highlighted.has(driver.driver);
      const color = driver.color ?? [palette.primary, palette.accent, palette.danger, "#FFC700"][index % 4];
      const borderColor = highlight ? color : withAlpha(color, 0.5);
      return {
        label: driver.driver,
        data: driver.laps.map((lap, lapIndex) => ({
          x: lap,
          y: Math.max(1, Math.round(driver.positions[lapIndex] ?? 20))
        })),
        borderColor,
        backgroundColor: "transparent",
        borderWidth: highlight ? 3 : 1.5,
        pointRadius: highlight ? 2 : 0,
        pointHoverRadius: highlight ? 4 : 0,
        tension: 0,
        stepped: "before"
      };
    }),
    [processedDrivers, highlighted, palette]
  );
  const cursorSource = datasets[0]?.data ?? [];
  const cursorIndex = findNearestIndex(
    cursorSource.map((point) => point.x),
    cursorTime
  );
  const cursorPoint = cursorIndex >= 0 ? cursorSource[cursorIndex] : null;
  const annotationDatasets = (0, import_react12.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      cursorSource.map((point) => point.x),
      cursorSource.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, cursorSource, palette]
  );
  const data = (0, import_react12.useMemo)(
    () => ({
      datasets: [
        ...datasets,
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [datasets, showCursor, cursorPoint, palette, annotationDatasets]
  );
  const options = (0, import_react12.useMemo)(() => {
    const maxPosition = Math.max(
      20,
      ...processedDrivers.map((driver) => Math.max(...driver.positions.map((position) => Math.round(position || 0)), 1))
    );
    const base = createLineOptions(palette, "Position", { min: 1, max: maxPosition });
    return {
      ...base,
      scales: {
        ...base.scales,
        x: {
          ...base.scales?.x,
          min: 1,
          max: totalLaps,
          title: {
            display: true,
            text: "Lap",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText,
            precision: 0
          }
        },
        y: {
          ...base.scales?.y,
          reverse: true,
          min: 1,
          max: maxPosition,
          ticks: {
            color: palette.mutedText,
            stepSize: 1
          }
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        const point = datasets[elements[0].datasetIndex]?.data[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, processedDrivers, totalLaps, onCursorTimeChange, datasets]);
  const plugins = (0, import_react12.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : [],
      createPositionLabelsPlugin(highlighted, showDriverLabels, palette.text)
    ],
    [
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid,
      highlighted,
      showDriverLabels,
      palette.text
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry position changes chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        ClientChart,
        {
          type: "line",
          data,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Race position change spaghetti chart"
        }
      )
    }
  );
};

// src/components/MiniSectors.tsx
var import_react13 = require("react");
var import_jsx_runtime13 = require("react/jsx-runtime");
var colorForSector = (mode, ratio, isOverallBest) => {
  if (isOverallBest) {
    return "#A855F7";
  }
  if (ratio <= 1) {
    return "#22C55E";
  }
  if (ratio > 1.07) {
    return "#F97316";
  }
  if (mode === "previous-lap" && ratio > 1.04) {
    return "#EF4444";
  }
  return "#EAB308";
};
var MiniSectors = ({
  drivers,
  comparisonMode = "overall-best",
  theme = "dark",
  className,
  styleTokens,
  title = "Mini Sectors",
  ariaLabel
}) => {
  const palette = (0, import_react13.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const sectors = (0, import_react13.useMemo)(
    () => Array.from(new Set(drivers.flatMap((driver) => driver.sectors.map((sector) => sector.sector)))).sort(
      (left, right) => left - right
    ),
    [drivers]
  );
  const overallBestBySector = (0, import_react13.useMemo)(() => {
    const result = /* @__PURE__ */ new Map();
    sectors.forEach((sector) => {
      const best = Math.min(
        ...drivers.map((driver) => driver.sectors.find((entry) => entry.sector === sector)?.time ?? Number.POSITIVE_INFINITY)
      );
      result.set(sector, best);
    });
    return result;
  }, [drivers, sectors]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, drivers.length * 44 + 84),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Mini sectors comparison grid",
      children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { overflow: "auto", height: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 4 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "th",
            {
              style: {
                textAlign: "left",
                color: palette.mutedText,
                fontSize: 11,
                padding: "4px 6px"
              },
              children: "Driver"
            }
          ),
          sectors.map((sector) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
            "th",
            {
              style: {
                textAlign: "center",
                color: palette.mutedText,
                fontSize: 11,
                padding: "4px 6px"
              },
              children: [
                "S",
                sector
              ]
            },
            sector
          ))
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("tbody", { children: drivers.map((driver) => {
          const personalBest = Math.min(...driver.sectors.map((sector) => sector.time));
          return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("tr", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "td",
              {
                style: {
                  color: driver.color ?? palette.text,
                  fontWeight: 600,
                  fontSize: 12,
                  padding: "6px"
                },
                children: driver.driver
              }
            ),
            sectors.map((sector, sectorIndex) => {
              const current = driver.sectors.find((entry) => entry.sector === sector)?.time;
              if (current === void 0) {
                return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "div",
                  {
                    style: {
                      borderRadius: 6,
                      border: `1px solid ${palette.border}`,
                      height: 30
                    }
                  }
                ) }, `${driver.driver}-${sector}`);
              }
              const previous = driver.sectors[sectorIndex - 1]?.time ?? current;
              const baseline = comparisonMode === "previous-lap" ? previous : comparisonMode === "personal-best" ? personalBest : overallBestBySector.get(sector) ?? current;
              const ratio = baseline > 0 ? current / baseline : 1;
              const isOverallBest = current <= (overallBestBySector.get(sector) ?? current);
              const cellColor = colorForSector(comparisonMode, ratio, isOverallBest);
              return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "div",
                {
                  style: {
                    borderRadius: 6,
                    minWidth: 54,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#111827",
                    background: cellColor
                  },
                  children: current.toFixed(3)
                }
              ) }, `${driver.driver}-${sector}`);
            })
          ] }, driver.driver);
        }) })
      ] }) })
    }
  );
};

// src/components/SpeedHeatmapTrackMap.tsx
var import_react14 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
ensureChartSetup();
var toRgb = (hexColor) => {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return [255, 255, 255];
  }
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16)
  ];
};
var mixColor = (left, right, t) => {
  const [lr, lg, lb] = toRgb(left);
  const [rr, rg, rb] = toRgb(right);
  const blend = (a, b) => Math.round(a + (b - a) * t);
  return `rgb(${blend(lr, rr)}, ${blend(lg, rg)}, ${blend(lb, rb)})`;
};
var colorFromScale = (value, min, max, scale) => {
  if (max <= min) {
    return scale.mid;
  }
  const normalized = (value - min) / (max - min);
  if (normalized <= 0.5) {
    return mixColor(scale.min, scale.mid, normalized / 0.5);
  }
  return mixColor(scale.mid, scale.max, (normalized - 0.5) / 0.5);
};
var SpeedHeatmapTrackMap = ({
  x,
  y,
  speed,
  time,
  colorScale,
  segmentSize = 5,
  theme = "dark",
  height = 380,
  className,
  title = "Speed Heatmap",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react14.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const scale = (0, import_react14.useMemo)(
    () => ({
      min: colorScale?.min ?? "#FF4444",
      mid: colorScale?.mid ?? "#FFAA00",
      max: colorScale?.max ?? "#00CC66"
    }),
    [colorScale]
  );
  const timeAxis = (0, import_react14.useMemo)(() => time ?? x.map((_, index) => index), [time, x]);
  const processed = (0, import_react14.useMemo)(
    () => processSeriesData({
      context: "SpeedHeatmapTrackMap",
      time: timeAxis,
      seriesMap: { x, y, speed },
      processing
    }),
    [timeAxis, x, y, speed, processing]
  );
  const points = (0, import_react14.useMemo)(
    () => processed.seriesMap.x.map((xValue, index) => ({
      x: xValue,
      y: processed.seriesMap.y[index]
    })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );
  const speedMin = Math.min(...processed.seriesMap.speed, 0);
  const speedMax = Math.max(...processed.seriesMap.speed, 0);
  const segmentDatasets = (0, import_react14.useMemo)(() => {
    const datasets = [];
    const chunk = Math.max(2, segmentSize);
    for (let index = 0; index < points.length - 1; index += chunk) {
      const end = Math.min(index + chunk, points.length - 1);
      const segmentPoints = points.slice(index, end + 1);
      if (segmentPoints.length < 2) {
        continue;
      }
      const segmentSpeeds = processed.seriesMap.speed.slice(index, end + 1);
      const avgSpeed = segmentSpeeds.reduce((sum, value) => sum + value, 0) / Math.max(segmentSpeeds.length, 1);
      const color = colorFromScale(avgSpeed, speedMin, speedMax, scale);
      datasets.push({
        label: `Segment ${index + 1}`,
        data: segmentPoints,
        showLine: true,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1
      });
    }
    return datasets;
  }, [points, processed.seriesMap.speed, segmentSize, scale, speedMin, speedMax]);
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const cursorSpeed = cursorIndex >= 0 ? processed.seriesMap.speed[cursorIndex] : null;
  const annotationDatasets = (0, import_react14.useMemo)(
    () => createTrackAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      points,
      processed.time,
      palette
    ),
    [showAnnotations, annotations, points, processed.time, palette]
  );
  const data = (0, import_react14.useMemo)(
    () => ({
      datasets: [
        ...segmentDatasets,
        ...showCursor && cursorPoint ? [
          {
            label: cursorSpeed !== null ? `Cursor (${cursorSpeed.toFixed(1)} km/h)` : "Cursor",
            data: [cursorPoint],
            showLine: false,
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            pointRadius: 5
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [segmentDatasets, showCursor, cursorPoint, cursorSpeed, palette, annotationDatasets]
  );
  const options = (0, import_react14.useMemo)(() => {
    const base = createTrackMapOptions(palette);
    return {
      ...base,
      plugins: {
        ...base.plugins,
        legend: {
          ...base.plugins?.legend,
          display: false
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        const hovered = data.datasets[elements[0].datasetIndex]?.data;
        const point = hovered?.[elements[0].index];
        if (!point) {
          return;
        }
        const nearest = findNearestIndex(
          points.map((candidate) => candidate.x + candidate.y),
          point.x + point.y
        );
        onCursorTimeChange(processed.time[nearest] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, data.datasets, points, processed.time]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry speed heatmap track map",
      children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { flex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          ClientChart,
          {
            type: "scatter",
            data,
            options,
            ariaLabel: ariaLabel ?? "Track map with speed heatmap"
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "div",
            {
              style: {
                height: 10,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${scale.min} 0%, ${scale.mid} 50%, ${scale.max} 100%)`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
            "div",
            {
              style: {
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: palette.mutedText
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: "Slow" }),
                /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { children: "Fast" })
              ]
            }
          )
        ] })
      ] })
    }
  );
};

// src/components/RadarChart.tsx
var import_react15 = require("react");
var import_jsx_runtime15 = require("react/jsx-runtime");
ensureChartSetup();
var hexToRgba = (hexColor, opacity) => {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return hexColor;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
var RadarChart = ({
  drivers,
  metricLabels,
  theme = "dark",
  height = 380,
  className,
  styleTokens,
  ariaLabel,
  fillOpacity = 0.2,
  title = "Driver Comparison"
}) => {
  const palette = (0, import_react15.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const keys = (0, import_react15.useMemo)(() => {
    const allKeys = /* @__PURE__ */ new Set();
    drivers.slice(0, 4).forEach((driver) => {
      Object.keys(driver.metrics).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [drivers]);
  const labels = (0, import_react15.useMemo)(
    () => keys.map((key) => metricLabels?.[key] ?? key),
    [keys, metricLabels]
  );
  const data = (0, import_react15.useMemo)(
    () => ({
      labels,
      datasets: drivers.slice(0, 4).map((driver, index) => {
        const borderColor = driver.color ?? [palette.primary, palette.accent, palette.danger, "#FFC700"][index % 4];
        return {
          label: driver.driver,
          data: keys.map((key) => driver.metrics[key] ?? 0),
          borderColor,
          backgroundColor: hexToRgba(borderColor, fillOpacity),
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: borderColor
        };
      })
    }),
    [labels, drivers, keys, fillOpacity, palette]
  );
  const options = (0, import_react15.useMemo)(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          angleLines: {
            color: palette.grid
          },
          grid: {
            color: palette.grid
          },
          pointLabels: {
            color: palette.text
          },
          ticks: {
            color: palette.mutedText,
            backdropColor: "transparent"
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: palette.text
          }
        }
      }
    }),
    [palette]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Driver radar comparison chart",
      children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        ClientChart,
        {
          type: "radar",
          data,
          options,
          ariaLabel: ariaLabel ?? "Driver radar metrics chart"
        }
      )
    }
  );
};

// src/components/PitStopTimeline.tsx
var import_react16 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
var PitStopTimeline = ({
  drivers,
  totalLaps,
  theme = "dark",
  className,
  styleTokens,
  showDurations = true,
  highlightSlow = 5,
  title = "Pit Stop Timeline",
  ariaLabel
}) => {
  const palette = (0, import_react16.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const lapMarkers = (0, import_react16.useMemo)(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from(
      { length: markerCount + 1 },
      (_, index) => Math.round(totalLaps * index / markerCount)
    );
  }, [totalLaps]);
  const maxDuration = (0, import_react16.useMemo)(
    () => Math.max(...drivers.flatMap((driver) => driver.stops.map((stop) => stop.duration)), highlightSlow, 5),
    [drivers, highlightSlow]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, drivers.length * 52 + 84),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Pit stop timeline",
      children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { style: { display: "grid", gap: 10, height: "100%" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "div",
          {
            style: {
              position: "relative",
              height: 20,
              borderBottom: `1px solid ${palette.grid}`
            },
            children: lapMarkers.map((marker) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
              "span",
              {
                style: {
                  position: "absolute",
                  left: `${marker / totalLaps * 100}%`,
                  transform: "translateX(-50%)",
                  fontSize: 11,
                  color: palette.mutedText
                },
                children: [
                  "L",
                  marker
                ]
              },
              marker
            ))
          }
        ),
        drivers.map((driver) => /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            "div",
            {
              style: {
                color: driver.color ?? palette.text,
                fontWeight: 600,
                fontSize: 12,
                alignSelf: "center"
              },
              children: driver.driver
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
            "div",
            {
              style: {
                position: "relative",
                height: 40,
                borderRadius: 8,
                border: `1px solid ${palette.border}`,
                background: "rgba(148,163,184,0.05)"
              },
              children: driver.stops.map((stop, index) => {
                const left = stop.lap / totalLaps * 100;
                const size = 12 + Math.max(0, stop.duration - 1.8) / maxDuration * 18;
                const slow = stop.duration > highlightSlow;
                return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: `${left}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    },
                    children: [
                      showDurations ? /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: -16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: 10,
                            color: palette.mutedText,
                            whiteSpace: "nowrap"
                          },
                          children: [
                            stop.duration.toFixed(1),
                            "s"
                          ]
                        }
                      ) : null,
                      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                        "div",
                        {
                          style: {
                            width: size,
                            height: size,
                            transform: "rotate(45deg)",
                            borderRadius: 3,
                            background: driver.color ?? palette.primarySoft,
                            border: `2px solid ${slow ? palette.danger : palette.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          },
                          children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
                            "span",
                            {
                              style: {
                                width: 7,
                                height: 7,
                                borderRadius: 999,
                                background: stop.tyreCompoundOut ? TYRE_COMPOUND_COLORS[stop.tyreCompoundOut] : palette.accent,
                                transform: "rotate(-45deg)",
                                border: "1px solid rgba(0,0,0,0.5)"
                              }
                            }
                          )
                        }
                      )
                    ]
                  },
                  `${driver.driver}-${stop.lap}-${index}`
                );
              })
            }
          )
        ] }, driver.driver))
      ] })
    }
  );
};

// src/components/WeatherWidget.tsx
var import_react17 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
ensureChartSetup();
var DEFAULT_METRICS = [
  "airTemp",
  "trackTemp",
  "humidity",
  "windSpeed",
  "rainfall"
];
var toCompass = (degrees) => {
  if (degrees === void 0 || !Number.isFinite(degrees)) {
    return "--";
  }
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360 + 360) % 360 / 45) % 8;
  return directions[index];
};
var rainfallStatus = (value) => {
  if (value <= 0) {
    return "Dry";
  }
  if (value < 0.7) {
    return "Light Rain";
  }
  return "Heavy Rain";
};
var WeatherWidget = ({
  data,
  showMetrics,
  compactMode = false,
  theme = "dark",
  height = 320,
  className,
  title = "Weather Conditions",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}) => {
  const palette = (0, import_react17.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const metrics = showMetrics ?? DEFAULT_METRICS;
  const processed = (0, import_react17.useMemo)(
    () => processSeriesData({
      context: "WeatherWidget",
      time: data.map((point) => point.time),
      seriesMap: {
        airTemp: data.map((point) => point.airTemp ?? 0),
        trackTemp: data.map((point) => point.trackTemp ?? 0),
        humidity: data.map((point) => point.humidity ?? 0),
        windSpeed: data.map((point) => point.windSpeed ?? 0),
        rainfall: data.map((point) => point.rainfall ?? 0)
      },
      processing
    }),
    [data, processing]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? {
    x: processed.time[cursorIndex],
    y: processed.seriesMap.airTemp[cursorIndex]
  } : null;
  const activeIndex = cursorIndex >= 0 ? cursorIndex : processed.time.length - 1;
  const currentValues = {
    air: processed.seriesMap.airTemp[activeIndex] ?? 0,
    track: processed.seriesMap.trackTemp[activeIndex] ?? 0,
    humidity: processed.seriesMap.humidity[activeIndex] ?? 0,
    wind: processed.seriesMap.windSpeed[activeIndex] ?? 0,
    rainfall: processed.seriesMap.rainfall[activeIndex] ?? 0,
    windDirection: data[activeIndex]?.windDirection
  };
  if (compactMode) {
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      TelemetryCard,
      {
        theme,
        height: height < 200 ? 200 : height,
        className,
        title,
        styleTokens,
        ariaLabel,
        defaultAriaLabel: "Weather compact widget",
        children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
          "div",
          {
            style: {
              display: "grid",
              gap: 8,
              color: palette.text,
              fontSize: 14
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                "\u{1F321} Air: ",
                currentValues.air.toFixed(1),
                "\xB0C / Track: ",
                currentValues.track.toFixed(1),
                "\xB0C"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                "\u{1F4A7} Humidity: ",
                currentValues.humidity.toFixed(0),
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                "\u{1F4A8} Wind: ",
                currentValues.wind.toFixed(1),
                " km/h ",
                toCompass(currentValues.windDirection)
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
                "\u{1F327} ",
                rainfallStatus(currentValues.rainfall)
              ] })
            ]
          }
        )
      }
    );
  }
  const airPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.airTemp[index] }));
  const trackPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.trackTemp[index] }));
  const humidityPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.humidity[index] }));
  const windPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.windSpeed[index] }));
  const rainfallBars = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.rainfall[index] }));
  const annotationDatasets = (0, import_react17.useMemo)(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.airTemp,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.airTemp, palette]
  );
  const chartData = (0, import_react17.useMemo)(
    () => ({
      datasets: [
        ...metrics.includes("airTemp") ? [
          {
            label: "Air Temp (\xB0C)",
            data: airPoints,
            borderColor: palette.danger,
            backgroundColor: "rgba(255, 127, 159, 0.16)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2
          }
        ] : [],
        ...metrics.includes("trackTemp") ? [
          {
            label: "Track Temp (\xB0C)",
            data: trackPoints,
            borderColor: "#FF8A00",
            backgroundColor: "rgba(255, 138, 0, 0.16)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2
          }
        ] : [],
        ...metrics.includes("humidity") ? [
          {
            label: "Humidity (%)",
            data: humidityPoints,
            yAxisID: "y1",
            borderColor: palette.primary,
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2
          }
        ] : [],
        ...metrics.includes("windSpeed") ? [
          {
            label: "Wind Speed (km/h)",
            data: windPoints,
            yAxisID: "y2",
            borderColor: palette.accent,
            backgroundColor: "transparent",
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.2
          }
        ] : [],
        ...metrics.includes("rainfall") ? [
          {
            label: "Rainfall",
            data: rainfallBars,
            yAxisID: "y2",
            borderColor: "#3D9BE9",
            backgroundColor: "rgba(61, 155, 233, 0.25)",
            borderWidth: 4,
            pointRadius: 0,
            stepped: "before",
            fill: true,
            tension: 0
          }
        ] : [],
        ...showCursor && cursorPoint ? [
          {
            label: "Cursor",
            data: [cursorPoint],
            borderColor: palette.primary,
            backgroundColor: palette.primary,
            showLine: false,
            pointRadius: 4
          }
        ] : [],
        ...annotationDatasets
      ]
    }),
    [
      metrics,
      airPoints,
      trackPoints,
      humidityPoints,
      windPoints,
      rainfallBars,
      showCursor,
      cursorPoint,
      annotationDatasets,
      palette
    ]
  );
  const options = (0, import_react17.useMemo)(() => {
    const base = createLineOptions(palette, "Temperature (\xB0C)");
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          title: {
            display: true,
            text: "Temperature (\xB0C)",
            color: palette.mutedText
          }
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: 100,
          title: {
            display: true,
            text: "Humidity (%)",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText
          },
          grid: {
            drawOnChartArea: false
          }
        },
        y2: {
          type: "linear",
          position: "right",
          offset: true,
          min: 0,
          title: {
            display: true,
            text: "Wind / Rain",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      onHover: (_event, elements) => {
        if (!onCursorTimeChange) {
          return;
        }
        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }
        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);
  const plugins = (0, import_react17.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Weather conditions widget",
      children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        ClientChart,
        {
          type: "line",
          data: chartData,
          options,
          plugins,
          ariaLabel: ariaLabel ?? "Weather multi-metric chart"
        }
      )
    }
  );
};

// src/components/TelemetryPlayground.tsx
var import_react18 = require("react");

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

// src/components/TelemetryPlayground.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var EXAMPLE_ROWS = 60;
var EXAMPLE_CSV = (() => {
  const rows = ["time,speed,throttle,brake,x,y"];
  for (let index = 0; index < EXAMPLE_ROWS; index += 1) {
    const time = index * 0.18;
    const phase = index / 7.5;
    const speed = 205 + Math.sin(phase) * 42 - (index % 18 > 12 ? 55 : 0);
    const throttle = Math.max(0, Math.min(100, 70 + Math.sin(phase * 1.8) * 35 - (index % 18 > 12 ? 45 : 0)));
    const brake = index % 18 > 12 ? Math.max(0, Math.min(100, 62 + Math.cos(phase * 1.2) * 20)) : 0;
    const x = Math.cos(time / 1.6) * 165 + Math.sin(time / 0.85) * 24;
    const y = Math.sin(time / 1.6) * 108 + Math.cos(time / 0.72) * 18;
    rows.push(
      [
        time.toFixed(3),
        speed.toFixed(3),
        throttle.toFixed(3),
        brake.toFixed(3),
        x.toFixed(3),
        y.toFixed(3)
      ].join(",")
    );
  }
  return rows.join("\n");
})();
var TELEMETRY_FIELDS = ["time", "speed", "throttle", "brake", "x", "y"];
var controlButtonStyle2 = (palette) => ({
  border: `1px solid ${palette.border}`,
  background: palette.primarySoft,
  color: palette.text,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer"
});
var parseSimpleCsv = (csvText) => csvText.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0).map((line) => line.split(",").map((entry) => entry.trim()));
var toNumber2 = (value) => {
  if (value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
var applyMappingTransform = (csvText, fieldMapping, options) => {
  const table = parseSimpleCsv(csvText);
  if (table.length < 2) {
    return {
      csv: "time,speed,throttle,brake,x,y",
      previewRows: [],
      issues: ["CSV must include a header row and at least one sample row for wizard mapping."]
    };
  }
  const [headers, ...rows] = table;
  const headerIndex = new Map(headers.map((header, index) => [header, index]));
  const issues = [];
  TELEMETRY_FIELDS.forEach((field) => {
    const selectedHeader = fieldMapping[field];
    if (!selectedHeader || !headerIndex.has(selectedHeader)) {
      issues.push(`Map "${field}" to a valid CSV column.`);
    }
  });
  const mappedRows = rows.map((row) => {
    const mapped = {
      time: "",
      speed: "",
      throttle: "",
      brake: "",
      x: "",
      y: ""
    };
    TELEMETRY_FIELDS.forEach((field) => {
      const selectedHeader = fieldMapping[field];
      const selectedIndex = selectedHeader ? headerIndex.get(selectedHeader) : void 0;
      mapped[field] = selectedIndex === void 0 ? "" : row[selectedIndex] ?? "";
    });
    return mapped;
  });
  if (options.normalizeTime) {
    const firstTime = mappedRows.map((row) => toNumber2(row.time)).find((value) => value !== null);
    if (firstTime !== void 0) {
      mappedRows.forEach((row) => {
        const time = toNumber2(row.time);
        if (time !== null) {
          row.time = (time - firstTime).toFixed(6);
        }
      });
    }
  }
  if (options.clampInputs) {
    mappedRows.forEach((row) => {
      const throttle = toNumber2(row.throttle);
      const brake = toNumber2(row.brake);
      if (throttle !== null) {
        row.throttle = Math.max(0, Math.min(100, throttle)).toFixed(6);
      }
      if (brake !== null) {
        row.brake = Math.max(0, Math.min(100, brake)).toFixed(6);
      }
    });
  }
  const outputRows = [
    "time,speed,throttle,brake,x,y",
    ...mappedRows.map((row) => TELEMETRY_FIELDS.map((field) => row[field]).join(","))
  ];
  return {
    csv: outputRows.join("\n"),
    previewRows: mappedRows.slice(0, 5).map((row) => TELEMETRY_FIELDS.map((field) => row[field])),
    issues
  };
};
var TelemetryPlayground = ({
  theme = "dark",
  styleTokens,
  className,
  defaultCsv = EXAMPLE_CSV,
  charts = ["speed", "throttleBrake", "trackMap"],
  chartHeight = 260,
  processing,
  onTelemetryParsed,
  title = "Telemetry Playground",
  ariaLabel,
  showImportWizard = true
}) => {
  const palette = (0, import_react18.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const [csvText, setCsvText] = (0, import_react18.useState)(defaultCsv);
  const [telemetry, setTelemetry] = (0, import_react18.useState)(null);
  const [validationErrors, setValidationErrors] = (0, import_react18.useState)([]);
  const [normalizeTime, setNormalizeTime] = (0, import_react18.useState)(true);
  const [clampInputs, setClampInputs] = (0, import_react18.useState)(true);
  const headers = (0, import_react18.useMemo)(() => {
    const [firstRow] = parseSimpleCsv(csvText);
    return firstRow ?? [];
  }, [csvText]);
  const [fieldMapping, setFieldMapping] = (0, import_react18.useState)({
    time: "time",
    speed: "speed",
    throttle: "throttle",
    brake: "brake",
    x: "x",
    y: "y"
  });
  const mappingTransform = (0, import_react18.useMemo)(
    () => applyMappingTransform(csvText, fieldMapping, { normalizeTime, clampInputs }),
    [csvText, fieldMapping, normalizeTime, clampInputs]
  );
  const parseCsv = () => {
    const parseIssues = showImportWizard ? mappingTransform.issues : [];
    if (parseIssues.length > 0) {
      setTelemetry(null);
      setValidationErrors(parseIssues);
      return;
    }
    const parsed = fromCsvTelemetry(showImportWizard ? mappingTransform.csv : csvText);
    const validation = validateTelemetry(parsed, "TelemetryPlayground");
    if (!validation.isValid) {
      setTelemetry(null);
      setValidationErrors(validation.issues.map((issue) => issue.message));
      return;
    }
    setValidationErrors([]);
    setTelemetry(parsed);
    onTelemetryParsed?.(parsed);
  };
  const loadExample = () => {
    setCsvText(EXAMPLE_CSV);
    setValidationErrors([]);
    setFieldMapping({
      time: "time",
      speed: "speed",
      throttle: "throttle",
      brake: "brake",
      x: "x",
      y: "y"
    });
  };
  const chartGridStyle = (0, import_react18.useMemo)(
    () => ({
      display: "grid",
      gap: 12,
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
    }),
    []
  );
  const containerHeight = Math.max(760, chartHeight * (charts.includes("dashboard") ? 3 : 2));
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
    TelemetryCard,
    {
      theme,
      height: containerHeight,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry CSV playground",
      children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: { height: "100%", display: "grid", gridTemplateRows: "auto auto auto 1fr", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          "textarea",
          {
            "aria-label": "Telemetry CSV input",
            value: csvText,
            onChange: (event) => setCsvText(event.target.value),
            spellCheck: false,
            style: {
              width: "100%",
              minHeight: 160,
              resize: "vertical",
              borderRadius: 10,
              border: `1px solid ${palette.border}`,
              background: palette.background,
              color: palette.text,
              padding: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              fontSize: 12
            }
          }
        ),
        showImportWizard ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          "section",
          {
            style: {
              borderRadius: 10,
              border: `1px solid ${palette.border}`,
              background: palette.background,
              padding: 12,
              display: "grid",
              gap: 10
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("strong", { style: { fontSize: 13 }, children: "Import Wizard" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }, children: TELEMETRY_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { style: { display: "grid", gap: 4, fontSize: 12 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { children: field }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
                  "select",
                  {
                    "aria-label": `Map field ${field}`,
                    value: fieldMapping[field],
                    onChange: (event) => setFieldMapping((current) => ({
                      ...current,
                      [field]: event.target.value
                    })),
                    style: {
                      borderRadius: 8,
                      border: `1px solid ${palette.border}`,
                      background: palette.background,
                      color: palette.text,
                      padding: "6px 8px"
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("option", { value: "", children: "(unmapped)" }),
                      headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("option", { value: header, children: header }, `${field}-${header}`))
                    ]
                  }
                )
              ] }, field)) }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    "input",
                    {
                      type: "checkbox",
                      checked: normalizeTime,
                      onChange: (event) => setNormalizeTime(event.target.checked)
                    }
                  ),
                  "Normalize time from first sample"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    "input",
                    {
                      type: "checkbox",
                      checked: clampInputs,
                      onChange: (event) => setClampInputs(event.target.checked)
                    }
                  ),
                  "Clamp throttle/brake to 0-100"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("strong", { style: { fontSize: 12 }, children: "Preview (first 5 transformed rows)" }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { overflowX: "auto", marginTop: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("tr", { children: TELEMETRY_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    "th",
                    {
                      style: { textAlign: "left", padding: "4px 6px", borderBottom: `1px solid ${palette.border}` },
                      children: field
                    },
                    `preview-header-${field}`
                  )) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("tbody", { children: mappingTransform.previewRows.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("tr", { children: row.map((value, columnIndex) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                    "td",
                    {
                      style: { padding: "4px 6px", borderBottom: `1px solid ${palette.border}` },
                      children: value
                    },
                    `preview-cell-${rowIndex}-${columnIndex}`
                  )) }, `preview-row-${rowIndex}`)) })
                ] }) })
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("button", { type: "button", onClick: parseCsv, style: controlButtonStyle2(palette), children: "Parse" }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("button", { type: "button", onClick: loadExample, style: controlButtonStyle2(palette), children: "Load Example" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: { overflow: "auto", paddingRight: 4 }, children: [
          validationErrors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
            "div",
            {
              role: "alert",
              style: {
                borderRadius: 10,
                border: `1px solid ${palette.danger}`,
                background: palette.primarySoft,
                color: palette.text,
                padding: 12,
                marginBottom: 12
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("strong", { style: { display: "block", marginBottom: 8 }, children: "Unable to parse CSV:" }),
                /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("ul", { style: { margin: 0, paddingLeft: 18 }, children: validationErrors.map((message, index) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("li", { children: message }, `${message}-${index}`)) })
              ]
            }
          ) : null,
          telemetry ? /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { style: chartGridStyle, children: [
            charts.includes("speed") ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              SpeedChart,
              {
                time: telemetry.time,
                speed: telemetry.speed,
                theme,
                styleTokens,
                processing,
                height: chartHeight
              }
            ) : null,
            charts.includes("throttleBrake") ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              ThrottleBrakeChart,
              {
                time: telemetry.time,
                throttle: telemetry.throttle,
                brake: telemetry.brake,
                theme,
                styleTokens,
                processing,
                height: chartHeight
              }
            ) : null,
            charts.includes("trackMap") ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              TrackMap,
              {
                x: telemetry.x,
                y: telemetry.y,
                time: telemetry.time,
                theme,
                styleTokens,
                processing,
                height: chartHeight
              }
            ) : null,
            charts.includes("dashboard") ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              TelemetryDashboard,
              {
                telemetry,
                theme,
                styleTokens,
                processing,
                chartHeight,
                trackMapHeight: chartHeight
              }
            ) }) : null
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("p", { style: { color: palette.mutedText, margin: 0 }, children: [
            "Paste CSV data and click ",
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("strong", { children: "Parse" }),
            " to preview telemetry charts."
          ] })
        ] })
      ] })
    }
  );
};

// src/hooks/useTelemetry.ts
var import_react19 = require("react");
var EMPTY_TELEMETRY = {
  time: [],
  speed: [],
  throttle: [],
  brake: [],
  x: [],
  y: []
};
var processTelemetry = (telemetry, processing) => {
  if (!processing) {
    return telemetry;
  }
  const result = processSeriesData({
    context: "useTelemetry",
    time: telemetry.time,
    seriesMap: {
      speed: telemetry.speed,
      throttle: telemetry.throttle,
      brake: telemetry.brake,
      x: telemetry.x,
      y: telemetry.y
    },
    processing
  });
  const processedChannels = telemetry.channels ? Object.fromEntries(
    Object.entries(telemetry.channels).map(([channel, values]) => {
      const channelResult = processSeriesData({
        context: `useTelemetry.channels.${channel}`,
        time: telemetry.time,
        seriesMap: {
          values: values ?? []
        },
        processing
      });
      return [channel, channelResult.seriesMap.values ?? []];
    })
  ) : void 0;
  const processedEvents = telemetry.events ? telemetry.events.filter((event) => {
    const start = processing.window?.startTime;
    const end = processing.window?.endTime;
    if (typeof start === "number" && event.time < start) {
      return false;
    }
    if (typeof end === "number" && event.time > end) {
      return false;
    }
    return true;
  }) : void 0;
  return {
    time: result.time,
    speed: result.seriesMap.speed ?? EMPTY_TELEMETRY.speed,
    throttle: result.seriesMap.throttle ?? EMPTY_TELEMETRY.throttle,
    brake: result.seriesMap.brake ?? EMPTY_TELEMETRY.brake,
    x: result.seriesMap.x ?? EMPTY_TELEMETRY.x,
    y: result.seriesMap.y ?? EMPTY_TELEMETRY.y,
    channels: processedChannels,
    events: processedEvents,
    timeReference: telemetry.timeReference
  };
};
var useTelemetry = (options = {}) => {
  const {
    data,
    adapter,
    fetcher,
    validate: shouldValidate = true,
    validationMode = "strict",
    processing
  } = options;
  const [telemetry, setTelemetryState] = (0, import_react19.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react19.useState)(false);
  const [error, setError] = (0, import_react19.useState)(null);
  const [validation, setValidation] = (0, import_react19.useState)(null);
  const fetcherRef = (0, import_react19.useRef)(fetcher);
  const requestIdRef = (0, import_react19.useRef)(0);
  fetcherRef.current = fetcher;
  const parseTelemetry = (0, import_react19.useCallback)(
    (rawData) => {
      if (adapter) {
        return adapter(rawData);
      }
      return formatTelemetry(rawData);
    },
    [adapter]
  );
  const applyAndStore = (0, import_react19.useCallback)(
    (nextTelemetry) => {
      const processed = processTelemetry(nextTelemetry, processing);
      setTelemetryState(processed);
      setError(null);
      if (shouldValidate) {
        setValidation(validateTelemetry(processed, "useTelemetry", { mode: validationMode }));
      } else {
        setValidation(null);
      }
    },
    [processing, shouldValidate, validationMode]
  );
  (0, import_react19.useEffect)(() => {
    if (data === void 0 || data === null) {
      return;
    }
    try {
      const parsed = parseTelemetry(data);
      applyAndStore(parsed);
    } catch (err) {
      setTelemetryState(null);
      setValidation(null);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [data, parseTelemetry, applyAndStore]);
  const refetch = (0, import_react19.useCallback)(() => {
    const runFetcher = fetcherRef.current;
    if (!runFetcher) {
      return;
    }
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);
    runFetcher().then((rawData) => {
      if (requestIdRef.current !== requestId) {
        return;
      }
      const parsed = parseTelemetry(rawData);
      applyAndStore(parsed);
    }).catch((err) => {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setTelemetryState(null);
      setValidation(null);
      setError(err instanceof Error ? err : new Error(String(err)));
    }).finally(() => {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    });
  }, [parseTelemetry, applyAndStore]);
  (0, import_react19.useEffect)(() => {
    if (fetcher) {
      refetch();
    }
  }, [fetcher, refetch]);
  const setTelemetry = (0, import_react19.useCallback)(
    (nextTelemetry) => {
      applyAndStore(nextTelemetry);
    },
    [applyAndStore]
  );
  const reset = (0, import_react19.useCallback)(() => {
    setTelemetryState(null);
    setIsLoading(false);
    setError(null);
    setValidation(null);
  }, []);
  return {
    telemetry,
    isLoading,
    error,
    validation,
    setTelemetry,
    refetch,
    reset
  };
};

// src/hooks/useCursorSync.ts
var import_react20 = require("react");
var useCursorSync = () => {
  const [cursorTime, setCursorTime] = (0, import_react20.useState)(null);
  const resetCursor = (0, import_react20.useCallback)(() => setCursorTime(null), []);
  const cursorProps = (0, import_react20.useMemo)(
    () => ({
      showCursor: true,
      cursorTime,
      onCursorTimeChange: setCursorTime
    }),
    [cursorTime]
  );
  return { cursorTime, setCursorTime, cursorProps, resetCursor };
};

// src/hooks/TelemetryProvider.tsx
var import_react22 = require("react");

// src/hooks/useAutoTheme.ts
var import_react21 = require("react");
var useAutoTheme = (fallback = "dark") => {
  const getPreferredTheme = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return fallback;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };
  const [theme, setTheme] = (0, import_react21.useState)(getPreferredTheme);
  (0, import_react21.useEffect)(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateTheme = (matchesLight) => setTheme(matchesLight ? "light" : "dark");
    updateTheme(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      const handler = (event) => updateTheme(event.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    if (typeof mediaQuery.addListener === "function") {
      const legacyHandler = (event) => updateTheme(event.matches);
      mediaQuery.addListener(legacyHandler);
      return () => mediaQuery.removeListener(legacyHandler);
    }
  }, [fallback]);
  return theme;
};

// src/hooks/TelemetryProvider.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
var TelemetryContext = (0, import_react22.createContext)(null);
var TelemetryProvider = ({
  children,
  initialData,
  fetcher,
  adapter,
  theme: themeProp = "dark",
  autoTheme = false,
  processing,
  styleTokens
}) => {
  const telemetryState = useTelemetry({
    data: initialData,
    fetcher,
    adapter,
    processing
  });
  const detectedTheme = useAutoTheme(themeProp);
  const [manualTheme, setManualTheme] = (0, import_react22.useState)(themeProp);
  const { cursorTime, setCursorTime, cursorProps } = useCursorSync();
  const theme = autoTheme ? detectedTheme : manualTheme;
  const value = (0, import_react22.useMemo)(
    () => ({
      telemetry: telemetryState.telemetry,
      setTelemetry: telemetryState.setTelemetry,
      isLoading: telemetryState.isLoading,
      error: telemetryState.error,
      validation: telemetryState.validation,
      theme,
      setTheme: setManualTheme,
      cursorTime,
      setCursorTime,
      cursorProps,
      processing,
      styleTokens
    }),
    [
      telemetryState.telemetry,
      telemetryState.setTelemetry,
      telemetryState.isLoading,
      telemetryState.error,
      telemetryState.validation,
      theme,
      cursorTime,
      setCursorTime,
      cursorProps,
      processing,
      styleTokens
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(TelemetryContext.Provider, { value, children });
};
var useTelemetryContext = () => {
  const context = (0, import_react22.useContext)(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetryContext must be used within a <TelemetryProvider>");
  }
  return context;
};

// src/hooks/useChartExport.ts
var import_react23 = require("react");
var resolveMimeType = (format) => `image/${format}`;
var useChartExport = () => {
  const chartRef = (0, import_react23.useRef)(null);
  const getCanvas = (0, import_react23.useCallback)(() => {
    if (!chartRef.current) {
      return null;
    }
    return chartRef.current.querySelector("canvas");
  }, []);
  const toDataURL = (0, import_react23.useCallback)(
    (options = {}) => {
      const sourceCanvas = getCanvas();
      if (!sourceCanvas) {
        return null;
      }
      const {
        format = "png",
        quality = 0.92,
        backgroundColor,
        scale = 2
      } = options;
      const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = Math.max(1, Math.floor(sourceCanvas.width * safeScale));
      exportCanvas.height = Math.max(1, Math.floor(sourceCanvas.height * safeScale));
      const context = exportCanvas.getContext("2d");
      if (!context) {
        return null;
      }
      if (backgroundColor) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }
      context.scale(safeScale, safeScale);
      context.drawImage(sourceCanvas, 0, 0);
      return exportCanvas.toDataURL(resolveMimeType(format), quality);
    },
    [getCanvas]
  );
  const toBlob = (0, import_react23.useCallback)(
    async (options = {}) => {
      const dataUrl = toDataURL(options);
      if (!dataUrl) {
        return null;
      }
      const response = await fetch(dataUrl);
      return response.blob();
    },
    [toDataURL]
  );
  const downloadImage = (0, import_react23.useCallback)(
    (options = {}) => {
      const { filename = "f1-telemetry-chart", format = "png" } = options;
      const dataUrl = toDataURL(options);
      if (!dataUrl) {
        return;
      }
      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    },
    [toDataURL]
  );
  return { chartRef, toDataURL, toBlob, downloadImage };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EnergyChart,
  GapChart,
  GearChart,
  LapComparisonChart,
  MiniSectors,
  PitStopTimeline,
  PositionChart,
  RadarChart,
  SpeedChart,
  SpeedHeatmapTrackMap,
  TelemetryDashboard,
  TelemetryPlayground,
  TelemetryProvider,
  ThrottleBrakeChart,
  TrackMap,
  TyreStrategyTimeline,
  WeatherWidget,
  createLineAnnotationDatasets,
  createTelemetryCssVariables,
  createTrackAnnotationDataset,
  createTrackAnnotationDatasets,
  telemetryCssVariables,
  useAutoTheme,
  useChartExport,
  useCursorSync,
  useTelemetry,
  useTelemetryContext
});
//# sourceMappingURL=react.cjs.map