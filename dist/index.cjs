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

// src/index.ts
var index_exports = {};
__export(index_exports, {
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
  ThrottleBrakeChart: () => ThrottleBrakeChart,
  TrackMap: () => TrackMap,
  TyreStrategyTimeline: () => TyreStrategyTimeline,
  WeatherWidget: () => WeatherWidget,
  classifyTyreCompound: () => classifyTyreCompound,
  clearTelemetryPanels: () => clearTelemetryPanels,
  computeLapTimes: () => computeLapTimes,
  computeSectorTimes: () => computeSectorTimes,
  computeSpeedDelta: () => computeSpeedDelta,
  computeTimeDelta: () => computeTimeDelta,
  createLineAnnotationDatasets: () => createLineAnnotationDatasets,
  createTelemetryCssVariables: () => createTelemetryCssVariables,
  createTrackAnnotationDataset: () => createTrackAnnotationDataset,
  createTrackAnnotationDatasets: () => createTrackAnnotationDatasets,
  detectOvertakes: () => detectOvertakes,
  exportToCsv: () => exportToCsv,
  exportToJson: () => exportToJson,
  findNearestIndex: () => findNearestIndex,
  formatTelemetry: () => formatTelemetry,
  fromCsvTelemetry: () => fromCsvTelemetry,
  fromFastF1Telemetry: () => fromFastF1Telemetry,
  fromOpenF1Telemetry: () => fromOpenF1Telemetry,
  getTelemetryPanels: () => getTelemetryPanels,
  interpolateTelemetry: () => interpolateTelemetry,
  mergeTelemetry: () => mergeTelemetry,
  normalizeDistance: () => normalizeDistance,
  processSeriesData: () => processSeriesData,
  registerTelemetryPanel: () => registerTelemetryPanel,
  telemetryCssVariables: () => telemetryCssVariables,
  unregisterTelemetryPanel: () => unregisterTelemetryPanel,
  validateTelemetry: () => validateTelemetry
});
module.exports = __toCommonJS(index_exports);

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

// src/components/SpeedChart.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
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
var registerTelemetryPanel = (extension) => {
  if (!extension.id) {
    throw new Error("Telemetry panel extension must include a non-empty id.");
  }
  panelRegistry.set(extension.id, extension);
};
var unregisterTelemetryPanel = (id) => {
  panelRegistry.delete(id);
};
var clearTelemetryPanels = () => {
  panelRegistry.clear();
};
var getTelemetryPanels = () => Array.from(panelRegistry.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

// src/components/TelemetryDashboard.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var sortPanels = (panels) => panels.sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
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
  extensions = []
}) => {
  const [cursorTime, setCursorTime] = (0, import_react7.useState)(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : void 0;
  const driver2 = (0, import_react7.useMemo)(
    () => comparison ?? {
      time: telemetry.time,
      speed: telemetry.speed,
      label: "Comparison"
    },
    [comparison, telemetry.time, telemetry.speed]
  );
  const cssTokenStyle = (0, import_react7.useMemo)(
    () => createTelemetryCssVariables(styleTokens ?? {}),
    [styleTokens]
  );
  const extensionPanels = (0, import_react7.useMemo)(() => {
    const allPanels = /* @__PURE__ */ new Map();
    getTelemetryPanels().forEach((panel) => allPanels.set(panel.id, panel));
    extensions.forEach((panel) => allPanels.set(panel.id, panel));
    return sortPanels(Array.from(allPanels.values()));
  }, [extensions]);
  const panelContext = (0, import_react7.useMemo)(
    () => ({
      telemetry,
      comparison: driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      cursorTime: sharedCursor,
      setCursorTime
    }),
    [
      telemetry,
      driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      sharedCursor
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className,
      style: {
        ...cssTokenStyle,
        display: "grid",
        gap: panelGap,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minPanelWidth}px, 1fr))`
      },
      children: [
        includeDefaultPanels ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            SpeedChart,
            {
              title: "Speed",
              time: telemetry.time,
              speed: telemetry.speed,
              theme,
              processing,
              styleTokens,
              annotations,
              height: chartHeight,
              cursorTime: sharedCursor,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            ThrottleBrakeChart,
            {
              title: "Driver Inputs",
              time: telemetry.time,
              throttle: telemetry.throttle,
              brake: telemetry.brake,
              theme,
              processing,
              styleTokens,
              annotations,
              height: chartHeight,
              cursorTime: sharedCursor,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            LapComparisonChart,
            {
              title: lapMode === "delta" ? "Lap Delta" : "Lap Comparison",
              driver1: { time: telemetry.time, speed: telemetry.speed, label: "Driver 1" },
              driver2,
              mode: lapMode,
              sectorMarkers,
              annotations,
              theme,
              processing,
              styleTokens,
              height: chartHeight,
              cursorTime: sharedCursor,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            TrackMap,
            {
              title: "Track Position",
              x: telemetry.x,
              y: telemetry.y,
              time: telemetry.time,
              annotations,
              theme,
              processing,
              styleTokens,
              height: trackMapHeight,
              cursorTime: sharedCursor,
              onCursorTimeChange: onCursorChange,
              showCursor: syncCursor
            }
          )
        ] }) : null,
        extensionPanels.map((panel) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: panel.render(panelContext) }, panel.id))
      ]
    }
  );
};

// src/components/GearChart.tsx
var import_react8 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  ThrottleBrakeChart,
  TrackMap,
  TyreStrategyTimeline,
  WeatherWidget,
  classifyTyreCompound,
  clearTelemetryPanels,
  computeLapTimes,
  computeSectorTimes,
  computeSpeedDelta,
  computeTimeDelta,
  createLineAnnotationDatasets,
  createTelemetryCssVariables,
  createTrackAnnotationDataset,
  createTrackAnnotationDatasets,
  detectOvertakes,
  exportToCsv,
  exportToJson,
  findNearestIndex,
  formatTelemetry,
  fromCsvTelemetry,
  fromFastF1Telemetry,
  fromOpenF1Telemetry,
  getTelemetryPanels,
  interpolateTelemetry,
  mergeTelemetry,
  normalizeDistance,
  processSeriesData,
  registerTelemetryPanel,
  telemetryCssVariables,
  unregisterTelemetryPanel,
  validateTelemetry
});
//# sourceMappingURL=index.cjs.map