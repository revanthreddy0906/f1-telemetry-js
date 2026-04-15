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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  LapComparisonChart: () => LapComparisonChart,
  SpeedChart: () => SpeedChart,
  TelemetryDashboard: () => TelemetryDashboard,
  ThrottleBrakeChart: () => ThrottleBrakeChart,
  TrackMap: () => TrackMap,
  createTelemetryCssVariables: () => createTelemetryCssVariables,
  findNearestIndex: () => findNearestIndex,
  formatTelemetry: () => formatTelemetry,
  processSeriesData: () => processSeriesData,
  telemetryCssVariables: () => telemetryCssVariables,
  validateTelemetry: () => validateTelemetry
});
module.exports = __toCommonJS(index_exports);

// src/components/SpeedChart.tsx
var import_react = require("react");
var import_react_chartjs_2 = require("react-chartjs-2");

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
  shadow: "0 8px 30px rgba(0, 0, 0, 0.35)"
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
  shadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
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
  shadow: "--f1-telemetry-shadow"
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
  ...theme === "light" ? LIGHT_TOKENS : DARK_TOKENS,
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

// src/utils/chartSetup.ts
var import_chart = require("chart.js");
import_chart.Chart.register(import_chart.CategoryScale, import_chart.LinearScale, import_chart.PointElement, import_chart.LineElement, import_chart.Title, import_chart.Tooltip, import_chart.Legend, import_chart.Filler, import_chart.Decimation);

// src/components/SpeedChart.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SpeedChart = (props) => {
  const {
    theme = "dark",
    height = 320,
    className,
    title = "Speed vs Time",
    processing,
    styleTokens,
    showCursor = true,
    cursorTime,
    onCursorTimeChange
  } = props;
  const rawTime = props.data?.time ?? props.time ?? [];
  const rawSpeed = props.data?.speed ?? props.speed ?? [];
  const palette = (0, import_react.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react.useMemo)(
    () => processSeriesData({
      context: "SpeedChart",
      time: rawTime,
      seriesMap: { speed: rawSpeed },
      processing
    }),
    [rawTime, rawSpeed, processing]
  );
  const points = (0, import_react.useMemo)(
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
  const chartData = (0, import_react.useMemo)(
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
        ] : []
      ]
    }),
    [points, palette, cursorPoint, showCursor]
  );
  const options = (0, import_react.useMemo)(() => {
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
  const plugins = (0, import_react.useMemo)(
    () => showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
    [showCursor, cursorTime, palette.mutedText]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className, style: getCardStyle(theme, height, styleTokens), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: getTitleStyle(theme, styleTokens), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_chartjs_2.Line, { data: chartData, options, plugins }) })
  ] });
};

// src/components/ThrottleBrakeChart.tsx
var import_react2 = require("react");
var import_react_chartjs_22 = require("react-chartjs-2");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ThrottleBrakeChart = ({
  time,
  throttle,
  brake,
  theme = "dark",
  height = 320,
  className,
  title = "Throttle & Brake",
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange
}) => {
  const palette = (0, import_react2.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = (0, import_react2.useMemo)(
    () => processSeriesData({
      context: "ThrottleBrakeChart",
      time,
      seriesMap: { throttle, brake },
      processing
    }),
    [time, throttle, brake, processing]
  );
  const throttlePoints = (0, import_react2.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.throttle[index]
    })),
    [processed.time, processed.seriesMap.throttle]
  );
  const brakePoints = (0, import_react2.useMemo)(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.brake[index]
    })),
    [processed.time, processed.seriesMap.brake]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorThrottle = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.throttle[cursorIndex] } : null;
  const cursorBrake = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.brake[cursorIndex] } : null;
  const chartData = (0, import_react2.useMemo)(
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
        ] : []
      ]
    }),
    [throttlePoints, brakePoints, palette, cursorThrottle, cursorBrake, showCursor]
  );
  const options = (0, import_react2.useMemo)(() => {
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
  const plugins = (0, import_react2.useMemo)(
    () => showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
    [showCursor, cursorTime, palette.mutedText]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className, style: getCardStyle(theme, height, styleTokens), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: getTitleStyle(theme, styleTokens), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_chartjs_22.Line, { data: chartData, options, plugins }) })
  ] });
};

// src/components/LapComparisonChart.tsx
var import_react3 = require("react");
var import_react_chartjs_23 = require("react-chartjs-2");
var import_jsx_runtime3 = require("react/jsx-runtime");
var LapComparisonChart = ({
  driver1,
  driver2,
  driver1Label,
  driver2Label,
  theme = "dark",
  height = 320,
  className,
  title = "Lap Comparison",
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  mode = "overlay",
  sectorMarkers,
  deltaLabel = "Delta (driver2 - driver1)"
}) => {
  const palette = (0, import_react3.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processedDriver1 = (0, import_react3.useMemo)(
    () => processSeriesData({
      context: "LapComparisonChart.driver1",
      time: driver1.time,
      seriesMap: { speed: driver1.speed },
      processing
    }),
    [driver1.time, driver1.speed, processing]
  );
  const processedDriver2 = (0, import_react3.useMemo)(
    () => processSeriesData({
      context: "LapComparisonChart.driver2",
      time: driver2.time,
      seriesMap: { speed: driver2.speed },
      processing
    }),
    [driver2.time, driver2.speed, processing]
  );
  const overlayData = (0, import_react3.useMemo)(
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
  const deltaPoints = (0, import_react3.useMemo)(() => {
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
  const chartData = (0, import_react3.useMemo)(
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
        ] : []
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
        ] : []
      ]
    },
    [
      mode,
      deltaLabel,
      deltaPoints,
      palette,
      cursorPoint,
      showCursor,
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
  const options = (0, import_react3.useMemo)(() => {
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
  const plugins = (0, import_react3.useMemo)(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      createSectorMarkersPlugin(sectorMarkers, palette.grid)
    ],
    [showCursor, cursorTime, palette.mutedText, palette.grid, sectorMarkers]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className, style: getCardStyle(theme, height, styleTokens), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: getTitleStyle(theme, styleTokens), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react_chartjs_23.Line, { data: chartData, options, plugins }) })
  ] });
};

// src/components/TrackMap.tsx
var import_react4 = require("react");
var import_react_chartjs_24 = require("react-chartjs-2");
var import_jsx_runtime4 = require("react/jsx-runtime");
var TrackMap = ({
  x,
  y,
  time,
  theme = "dark",
  height = 360,
  className,
  title = "Track Map",
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange
}) => {
  const palette = (0, import_react4.useMemo)(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const timeAxis = (0, import_react4.useMemo)(() => time ?? x.map((_, index) => index), [time, x]);
  const processed = (0, import_react4.useMemo)(
    () => processSeriesData({
      context: "TrackMap",
      time: timeAxis,
      seriesMap: { x, y },
      processing
    }),
    [timeAxis, x, y, processing]
  );
  const points = (0, import_react4.useMemo)(
    () => processed.seriesMap.x.map((xValue, index) => ({
      x: xValue,
      y: processed.seriesMap.y[index]
    })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const data = (0, import_react4.useMemo)(
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
        ] : []
      ]
    }),
    [points, palette, cursorPoint, showCursor]
  );
  const options = (0, import_react4.useMemo)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className, style: getCardStyle(theme, height, styleTokens), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: getTitleStyle(theme, styleTokens), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_chartjs_24.Scatter, { data, options }) })
  ] });
};

// src/components/TelemetryDashboard.tsx
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var TelemetryDashboard = ({
  telemetry,
  comparison,
  lapMode = "overlay",
  sectorMarkers,
  theme = "dark",
  styleTokens,
  processing,
  syncCursor = true,
  className,
  chartHeight = 320,
  trackMapHeight = 360
}) => {
  const [cursorTime, setCursorTime] = (0, import_react5.useState)(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : void 0;
  const driver2 = (0, import_react5.useMemo)(
    () => comparison ?? {
      time: telemetry.time,
      speed: telemetry.speed,
      label: "Comparison"
    },
    [comparison, telemetry.time, telemetry.speed]
  );
  const cssTokenStyle = (0, import_react5.useMemo)(
    () => createTelemetryCssVariables(styleTokens ?? {}),
    [styleTokens]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className,
      style: {
        ...cssTokenStyle,
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          SpeedChart,
          {
            title: "Speed",
            time: telemetry.time,
            speed: telemetry.speed,
            theme,
            processing,
            styleTokens,
            height: chartHeight,
            cursorTime: sharedCursor,
            onCursorTimeChange: onCursorChange,
            showCursor: syncCursor
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          ThrottleBrakeChart,
          {
            title: "Driver Inputs",
            time: telemetry.time,
            throttle: telemetry.throttle,
            brake: telemetry.brake,
            theme,
            processing,
            styleTokens,
            height: chartHeight,
            cursorTime: sharedCursor,
            onCursorTimeChange: onCursorChange,
            showCursor: syncCursor
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          LapComparisonChart,
          {
            title: lapMode === "delta" ? "Lap Delta" : "Lap Comparison",
            driver1: { time: telemetry.time, speed: telemetry.speed, label: "Driver 1" },
            driver2,
            mode: lapMode,
            sectorMarkers,
            theme,
            processing,
            styleTokens,
            height: chartHeight,
            cursorTime: sharedCursor,
            onCursorTimeChange: onCursorChange,
            showCursor: syncCursor
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          TrackMap,
          {
            title: "Track Position",
            x: telemetry.x,
            y: telemetry.y,
            time: telemetry.time,
            theme,
            processing,
            styleTokens,
            height: trackMapHeight,
            cursorTime: sharedCursor,
            onCursorTimeChange: onCursorChange,
            showCursor: syncCursor
          }
        )
      ]
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LapComparisonChart,
  SpeedChart,
  TelemetryDashboard,
  ThrottleBrakeChart,
  TrackMap,
  createTelemetryCssVariables,
  findNearestIndex,
  formatTelemetry,
  processSeriesData,
  telemetryCssVariables,
  validateTelemetry
});
//# sourceMappingURL=index.cjs.map