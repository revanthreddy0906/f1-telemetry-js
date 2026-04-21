import {
  F1_DRIVERS,
  F1_TEAMS,
  FLAG_TYPES,
  RACE_CALENDAR_2025,
  RACE_COMPOUND_ALLOCATIONS,
  TEAM_COLORS,
  TRACKS,
  TYRE_COMPOUNDS,
  classifyTyreCompound,
  computeLapTimes,
  computeSectorTimes,
  computeSpeedDelta,
  computeTimeDelta,
  detectOvertakes,
  exportToCsv,
  exportToJson,
  getDriver,
  getDriverColor,
  getFlag,
  getNextRace,
  getRaceByRound,
  getRaceCompounds,
  getSprintWeekends,
  getTeam,
  getTeamDrivers,
  getTrack,
  getTrackIds,
  getTyreColor,
  interpolateTelemetry,
  mergeTelemetry,
  normalizeDistance
} from "./chunk-M3GRIU7N.js";
import {
  findNearestIndex,
  processSeriesData,
  processSeriesDataInWorker
} from "./chunk-4CUWBBQN.js";
import {
  fetchOpenF1Drivers,
  fetchOpenF1Sessions,
  fetchOpenF1Telemetry,
  fetchOpenF1TelemetryWithDiagnostics,
  formatTelemetry,
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
} from "./chunk-SPFWGXFA.js";
import {
  validateTelemetry
} from "./chunk-HW46UJWW.js";

// src/components/SpeedChart.tsx
import { useMemo as useMemo2 } from "react";

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
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const [isFocused, setIsFocused] = useState(false);
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  return /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsx("p", { style: getTitleStyle(theme, styleTokens), children: title }),
        /* @__PURE__ */ jsx("div", { style: { height: "calc(100% - 26px)" }, children })
      ]
    }
  );
};

// src/components/ClientChart.tsx
import { useEffect, useState as useState2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var ClientChart = (props) => {
  const [charts, setCharts] = useState2(null);
  useEffect(() => {
    let mounted = true;
    import("react-chartjs-2").then((module) => {
      if (mounted) {
        setCharts(module);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!charts) {
    return /* @__PURE__ */ jsx2(
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
    return /* @__PURE__ */ jsx2(
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
    return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
import {
  CategoryScale,
  Chart as ChartJS,
  Decimation,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip
} from "chart.js";
var isChartSetupComplete = false;
var ensureChartSetup = () => {
  if (isChartSetupComplete) {
    return;
  }
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
    Decimation
  );
  isChartSetupComplete = true;
};

// src/components/SpeedChart.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
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
  const palette = useMemo2(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = useMemo2(
    () => processSeriesData({
      context: "SpeedChart",
      time: rawTime,
      seriesMap: { speed: rawSpeed },
      processing
    }),
    [rawTime, rawSpeed, processing]
  );
  const points = useMemo2(
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
  const annotationDatasets = useMemo2(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.speed,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.speed, palette]
  );
  const chartData = useMemo2(
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
  const options = useMemo2(() => {
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
  const plugins = useMemo2(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ jsx3(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry speed chart",
      children: /* @__PURE__ */ jsx3(
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
import { useMemo as useMemo3 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
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
  const palette = useMemo3(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = useMemo3(
    () => processSeriesData({
      context: "ThrottleBrakeChart",
      time,
      seriesMap: { throttle, brake },
      processing
    }),
    [time, throttle, brake, processing]
  );
  const throttlePoints = useMemo3(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.throttle[index]
    })),
    [processed.time, processed.seriesMap.throttle]
  );
  const brakePoints = useMemo3(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.brake[index]
    })),
    [processed.time, processed.seriesMap.brake]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorThrottle = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.throttle[cursorIndex] } : null;
  const cursorBrake = cursorIndex >= 0 ? { x: processed.time[cursorIndex], y: processed.seriesMap.brake[cursorIndex] } : null;
  const annotationDatasets = useMemo3(
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
  const chartData = useMemo3(
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
  const options = useMemo3(() => {
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
  const plugins = useMemo3(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ jsx4(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry throttle and brake chart",
      children: /* @__PURE__ */ jsx4(
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
import { useMemo as useMemo4 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
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
  const palette = useMemo4(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processedDriver1 = useMemo4(
    () => processSeriesData({
      context: "LapComparisonChart.driver1",
      time: driver1.time,
      seriesMap: { speed: driver1.speed },
      processing
    }),
    [driver1.time, driver1.speed, processing]
  );
  const processedDriver2 = useMemo4(
    () => processSeriesData({
      context: "LapComparisonChart.driver2",
      time: driver2.time,
      seriesMap: { speed: driver2.speed },
      processing
    }),
    [driver2.time, driver2.speed, processing]
  );
  const overlayData = useMemo4(
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
  const deltaPoints = useMemo4(() => {
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
  const annotationDatasets = useMemo4(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      annotationTime,
      annotationSeries,
      palette
    ),
    [showAnnotations, annotations, annotationTime, annotationSeries, palette]
  );
  const chartData = useMemo4(
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
  const options = useMemo4(() => {
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
  const plugins = useMemo4(
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
  return /* @__PURE__ */ jsx5(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry lap comparison chart",
      children: /* @__PURE__ */ jsx5(
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
import { useMemo as useMemo5 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
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
  const palette = useMemo5(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const timeAxis = useMemo5(() => time ?? x.map((_, index) => index), [time, x]);
  const processed = useMemo5(
    () => processSeriesData({
      context: "TrackMap",
      time: timeAxis,
      seriesMap: { x, y },
      processing
    }),
    [timeAxis, x, y, processing]
  );
  const points = useMemo5(
    () => processed.seriesMap.x.map((xValue, index) => ({
      x: xValue,
      y: processed.seriesMap.y[index]
    })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const annotationDatasets = useMemo5(
    () => createTrackAnnotationDataset(
      showAnnotations ? annotations : void 0,
      points,
      processed.time,
      palette
    ),
    [showAnnotations, annotations, points, processed.time, palette]
  );
  const data = useMemo5(
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
  const options = useMemo5(() => {
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
  return /* @__PURE__ */ jsx6(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry track map chart",
      children: /* @__PURE__ */ jsx6(
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
import { useMemo as useMemo6, useState as useState3 } from "react";

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
import { Fragment, jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
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
  const [cursorTime, setCursorTime] = useState3(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : void 0;
  const driver2 = useMemo6(
    () => comparison ?? {
      time: telemetry.time,
      speed: telemetry.speed,
      label: "Comparison"
    },
    [comparison, telemetry.time, telemetry.speed]
  );
  const cssTokenStyle = useMemo6(
    () => createTelemetryCssVariables(styleTokens ?? {}),
    [styleTokens]
  );
  const extensionPanels = useMemo6(() => {
    const allPanels = /* @__PURE__ */ new Map();
    getTelemetryPanels().forEach((panel) => allPanels.set(panel.id, panel));
    extensions.forEach((panel) => allPanels.set(panel.id, panel));
    return sortPanels(Array.from(allPanels.values()));
  }, [extensions]);
  const panelContext = useMemo6(
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
  return /* @__PURE__ */ jsxs2(
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
        includeDefaultPanels ? /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx7(
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
          /* @__PURE__ */ jsx7(
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
          /* @__PURE__ */ jsx7(
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
          /* @__PURE__ */ jsx7(
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
        extensionPanels.map((panel) => /* @__PURE__ */ jsx7("div", { children: panel.render(panelContext) }, panel.id))
      ]
    }
  );
};

// src/components/GearChart.tsx
import { useMemo as useMemo7 } from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
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
  const palette = useMemo7(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = useMemo7(
    () => processSeriesData({
      context: "GearChart",
      time,
      seriesMap: { gear },
      processing
    }),
    [time, gear, processing]
  );
  const points = useMemo7(
    () => processed.time.map((value, index) => ({
      x: value,
      y: Math.max(0, Math.min(8, Math.round(processed.seriesMap.gear[index])))
    })),
    [processed.time, processed.seriesMap.gear]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;
  const annotationDatasets = useMemo7(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      points.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, processed.time, points, palette]
  );
  const chartData = useMemo7(
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
  const options = useMemo7(() => {
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
  const plugins = useMemo7(
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
  return /* @__PURE__ */ jsx8(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry gear chart",
      children: /* @__PURE__ */ jsx8(
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
import { useMemo as useMemo8 } from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
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
  const palette = useMemo8(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processed = useMemo8(
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
  const deploymentPoints = useMemo8(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.deployment[index]
    })),
    [processed.time, processed.seriesMap.deployment]
  );
  const harvestPoints = useMemo8(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.harvest[index]
    })),
    [processed.time, processed.seriesMap.harvest]
  );
  const batteryPoints = useMemo8(
    () => processed.time.map((value, index) => ({
      x: value,
      y: processed.seriesMap.battery[index]
    })),
    [processed.time, processed.seriesMap.battery]
  );
  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? deploymentPoints[cursorIndex] : null;
  const annotationDatasets = useMemo8(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.deployment,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.deployment, palette]
  );
  const chartData = useMemo8(
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
  const options = useMemo8(() => {
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
  const plugins = useMemo8(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ jsx9(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry ERS energy chart",
      children: /* @__PURE__ */ jsx9(
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
import { useMemo as useMemo9 } from "react";

// src/utils/tyres.ts
var TYRE_COMPOUND_COLORS = {
  soft: "#FF3333",
  medium: "#FFC700",
  hard: "#FFFFFF",
  intermediate: "#47C747",
  wet: "#3D9BE9"
};

// src/components/TyreStrategyTimeline.tsx
import { jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
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
  const palette = useMemo9(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const lapMarkers = useMemo9(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from(
      { length: markerCount + 1 },
      (_, index) => Math.round(totalLaps * index / markerCount)
    );
  }, [totalLaps]);
  return /* @__PURE__ */ jsx10(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, strategies.length * (height + 12) + 92),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Tyre strategy timeline",
      children: /* @__PURE__ */ jsxs3("div", { style: { display: "grid", gap: 10, height: "100%" }, children: [
        showLapNumbers ? /* @__PURE__ */ jsx10(
          "div",
          {
            style: {
              position: "relative",
              height: 20,
              borderBottom: `1px solid ${palette.grid}`
            },
            children: lapMarkers.map((marker) => /* @__PURE__ */ jsxs3(
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
        strategies.map((strategy) => /* @__PURE__ */ jsxs3("div", { style: { display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }, children: [
          /* @__PURE__ */ jsx10(
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
          /* @__PURE__ */ jsx10(
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
                return /* @__PURE__ */ jsx10(
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
import { useMemo as useMemo10 } from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
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
  const palette = useMemo10(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const processedDrivers = useMemo10(
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
  const reference = useMemo10(
    () => processedDrivers.find((driver) => driver.driver === referenceDriver) ?? processedDrivers.find((driver) => driver.driver.toLowerCase().includes("leader")) ?? processedDrivers[0],
    [processedDrivers, referenceDriver]
  );
  const referenceByLap = useMemo10(() => {
    const map = /* @__PURE__ */ new Map();
    if (!reference) {
      return map;
    }
    reference.laps.forEach((lap, index) => map.set(lap, reference.gaps[index] ?? 0));
    return map;
  }, [reference]);
  const datasets = useMemo10(
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
  const annotationDatasets = useMemo10(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      annotationData.map((point) => point.x),
      annotationData.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, annotationData, palette]
  );
  const data = useMemo10(
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
  const options = useMemo10(() => {
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
  const plugins = useMemo10(
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
  return /* @__PURE__ */ jsx11(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry gap to leader chart",
      children: /* @__PURE__ */ jsx11(
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
import { useMemo as useMemo11 } from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
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
  const palette = useMemo11(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const highlighted = useMemo11(
    () => new Set((highlightDrivers ?? []).map((driver) => driver.trim())),
    [highlightDrivers]
  );
  const processedDrivers = useMemo11(
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
  const datasets = useMemo11(
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
  const annotationDatasets = useMemo11(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      cursorSource.map((point) => point.x),
      cursorSource.map((point) => point.y),
      palette
    ),
    [showAnnotations, annotations, cursorSource, palette]
  );
  const data = useMemo11(
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
  const options = useMemo11(() => {
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
  const plugins = useMemo11(
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
  return /* @__PURE__ */ jsx12(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry position changes chart",
      children: /* @__PURE__ */ jsx12(
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
import { useMemo as useMemo12 } from "react";
import { jsx as jsx13, jsxs as jsxs4 } from "react/jsx-runtime";
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
  const palette = useMemo12(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const sectors = useMemo12(
    () => Array.from(new Set(drivers.flatMap((driver) => driver.sectors.map((sector) => sector.sector)))).sort(
      (left, right) => left - right
    ),
    [drivers]
  );
  const overallBestBySector = useMemo12(() => {
    const result = /* @__PURE__ */ new Map();
    sectors.forEach((sector) => {
      const best = Math.min(
        ...drivers.map((driver) => driver.sectors.find((entry) => entry.sector === sector)?.time ?? Number.POSITIVE_INFINITY)
      );
      result.set(sector, best);
    });
    return result;
  }, [drivers, sectors]);
  return /* @__PURE__ */ jsx13(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, drivers.length * 44 + 84),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Mini sectors comparison grid",
      children: /* @__PURE__ */ jsx13("div", { style: { overflow: "auto", height: "100%" }, children: /* @__PURE__ */ jsxs4("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 4 }, children: [
        /* @__PURE__ */ jsx13("thead", { children: /* @__PURE__ */ jsxs4("tr", { children: [
          /* @__PURE__ */ jsx13(
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
          sectors.map((sector) => /* @__PURE__ */ jsxs4(
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
        /* @__PURE__ */ jsx13("tbody", { children: drivers.map((driver) => {
          const personalBest = Math.min(...driver.sectors.map((sector) => sector.time));
          return /* @__PURE__ */ jsxs4("tr", { children: [
            /* @__PURE__ */ jsx13(
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
                return /* @__PURE__ */ jsx13("td", { children: /* @__PURE__ */ jsx13(
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
              return /* @__PURE__ */ jsx13("td", { children: /* @__PURE__ */ jsx13(
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
import { useMemo as useMemo13 } from "react";
import { jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
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
  const palette = useMemo13(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const scale = useMemo13(
    () => ({
      min: colorScale?.min ?? "#FF4444",
      mid: colorScale?.mid ?? "#FFAA00",
      max: colorScale?.max ?? "#00CC66"
    }),
    [colorScale]
  );
  const timeAxis = useMemo13(() => time ?? x.map((_, index) => index), [time, x]);
  const processed = useMemo13(
    () => processSeriesData({
      context: "SpeedHeatmapTrackMap",
      time: timeAxis,
      seriesMap: { x, y, speed },
      processing
    }),
    [timeAxis, x, y, speed, processing]
  );
  const points = useMemo13(
    () => processed.seriesMap.x.map((xValue, index) => ({
      x: xValue,
      y: processed.seriesMap.y[index]
    })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );
  const speedMin = Math.min(...processed.seriesMap.speed, 0);
  const speedMax = Math.max(...processed.seriesMap.speed, 0);
  const segmentDatasets = useMemo13(() => {
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
  const annotationDatasets = useMemo13(
    () => createTrackAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      points,
      processed.time,
      palette
    ),
    [showAnnotations, annotations, points, processed.time, palette]
  );
  const data = useMemo13(
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
  const options = useMemo13(() => {
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
  return /* @__PURE__ */ jsx14(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry speed heatmap track map",
      children: /* @__PURE__ */ jsxs5("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, children: [
        /* @__PURE__ */ jsx14("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsx14(
          ClientChart,
          {
            type: "scatter",
            data,
            options,
            ariaLabel: ariaLabel ?? "Track map with speed heatmap"
          }
        ) }),
        /* @__PURE__ */ jsxs5("div", { style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsx14(
            "div",
            {
              style: {
                height: 10,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${scale.min} 0%, ${scale.mid} 50%, ${scale.max} 100%)`
              }
            }
          ),
          /* @__PURE__ */ jsxs5(
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
                /* @__PURE__ */ jsx14("span", { children: "Slow" }),
                /* @__PURE__ */ jsx14("span", { children: "Fast" })
              ]
            }
          )
        ] })
      ] })
    }
  );
};

// src/components/RadarChart.tsx
import { useMemo as useMemo14 } from "react";
import { jsx as jsx15 } from "react/jsx-runtime";
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
  const palette = useMemo14(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const keys = useMemo14(() => {
    const allKeys = /* @__PURE__ */ new Set();
    drivers.slice(0, 4).forEach((driver) => {
      Object.keys(driver.metrics).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [drivers]);
  const labels = useMemo14(
    () => keys.map((key) => metricLabels?.[key] ?? key),
    [keys, metricLabels]
  );
  const data = useMemo14(
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
  const options = useMemo14(
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
  return /* @__PURE__ */ jsx15(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Driver radar comparison chart",
      children: /* @__PURE__ */ jsx15(
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
import { useMemo as useMemo15 } from "react";
import { jsx as jsx16, jsxs as jsxs6 } from "react/jsx-runtime";
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
  const palette = useMemo15(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const lapMarkers = useMemo15(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from(
      { length: markerCount + 1 },
      (_, index) => Math.round(totalLaps * index / markerCount)
    );
  }, [totalLaps]);
  const maxDuration = useMemo15(
    () => Math.max(...drivers.flatMap((driver) => driver.stops.map((stop) => stop.duration)), highlightSlow, 5),
    [drivers, highlightSlow]
  );
  return /* @__PURE__ */ jsx16(
    TelemetryCard,
    {
      theme,
      height: Math.max(220, drivers.length * 52 + 84),
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Pit stop timeline",
      children: /* @__PURE__ */ jsxs6("div", { style: { display: "grid", gap: 10, height: "100%" }, children: [
        /* @__PURE__ */ jsx16(
          "div",
          {
            style: {
              position: "relative",
              height: 20,
              borderBottom: `1px solid ${palette.grid}`
            },
            children: lapMarkers.map((marker) => /* @__PURE__ */ jsxs6(
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
        drivers.map((driver) => /* @__PURE__ */ jsxs6("div", { style: { display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }, children: [
          /* @__PURE__ */ jsx16(
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
          /* @__PURE__ */ jsx16(
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
                return /* @__PURE__ */ jsxs6(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: `${left}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    },
                    children: [
                      showDurations ? /* @__PURE__ */ jsxs6(
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
                      /* @__PURE__ */ jsx16(
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
                          children: /* @__PURE__ */ jsx16(
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
import { useMemo as useMemo16 } from "react";
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
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
  const palette = useMemo16(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const metrics = showMetrics ?? DEFAULT_METRICS;
  const processed = useMemo16(
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
    return /* @__PURE__ */ jsx17(
      TelemetryCard,
      {
        theme,
        height: height < 200 ? 200 : height,
        className,
        title,
        styleTokens,
        ariaLabel,
        defaultAriaLabel: "Weather compact widget",
        children: /* @__PURE__ */ jsxs7(
          "div",
          {
            style: {
              display: "grid",
              gap: 8,
              color: palette.text,
              fontSize: 14
            },
            children: [
              /* @__PURE__ */ jsxs7("div", { children: [
                "\u{1F321} Air: ",
                currentValues.air.toFixed(1),
                "\xB0C / Track: ",
                currentValues.track.toFixed(1),
                "\xB0C"
              ] }),
              /* @__PURE__ */ jsxs7("div", { children: [
                "\u{1F4A7} Humidity: ",
                currentValues.humidity.toFixed(0),
                "%"
              ] }),
              /* @__PURE__ */ jsxs7("div", { children: [
                "\u{1F4A8} Wind: ",
                currentValues.wind.toFixed(1),
                " km/h ",
                toCompass(currentValues.windDirection)
              ] }),
              /* @__PURE__ */ jsxs7("div", { children: [
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
  const annotationDatasets = useMemo16(
    () => createLineAnnotationDatasets(
      showAnnotations ? annotations : void 0,
      processed.time,
      processed.seriesMap.airTemp,
      palette
    ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.airTemp, palette]
  );
  const chartData = useMemo16(
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
  const options = useMemo16(() => {
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
  const plugins = useMemo16(
    () => [
      ...showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : [],
      ...showAnnotations ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)] : []
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );
  return /* @__PURE__ */ jsx17(
    TelemetryCard,
    {
      theme,
      height,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Weather conditions widget",
      children: /* @__PURE__ */ jsx17(
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
import { useMemo as useMemo17, useState as useState4 } from "react";
import { jsx as jsx18, jsxs as jsxs8 } from "react/jsx-runtime";
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
var controlButtonStyle = (palette) => ({
  border: `1px solid ${palette.border}`,
  background: palette.primarySoft,
  color: palette.text,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer"
});
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
  ariaLabel
}) => {
  const palette = useMemo17(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const [csvText, setCsvText] = useState4(defaultCsv);
  const [telemetry, setTelemetry] = useState4(null);
  const [validationErrors, setValidationErrors] = useState4([]);
  const parseCsv = () => {
    const parsed = fromCsvTelemetry(csvText);
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
  };
  const chartGridStyle = useMemo17(
    () => ({
      display: "grid",
      gap: 12,
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
    }),
    []
  );
  const containerHeight = Math.max(640, chartHeight * (charts.includes("dashboard") ? 3 : 2));
  return /* @__PURE__ */ jsx18(
    TelemetryCard,
    {
      theme,
      height: containerHeight,
      className,
      title,
      styleTokens,
      ariaLabel,
      defaultAriaLabel: "Telemetry CSV playground",
      children: /* @__PURE__ */ jsxs8("div", { style: { height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 12 }, children: [
        /* @__PURE__ */ jsx18(
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
        /* @__PURE__ */ jsxs8("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx18("button", { type: "button", onClick: parseCsv, style: controlButtonStyle(palette), children: "Parse" }),
          /* @__PURE__ */ jsx18("button", { type: "button", onClick: loadExample, style: controlButtonStyle(palette), children: "Load Example" })
        ] }),
        /* @__PURE__ */ jsxs8("div", { style: { overflow: "auto", paddingRight: 4 }, children: [
          validationErrors.length > 0 ? /* @__PURE__ */ jsxs8(
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
                /* @__PURE__ */ jsx18("strong", { style: { display: "block", marginBottom: 8 }, children: "Unable to parse CSV:" }),
                /* @__PURE__ */ jsx18("ul", { style: { margin: 0, paddingLeft: 18 }, children: validationErrors.map((message, index) => /* @__PURE__ */ jsx18("li", { children: message }, `${message}-${index}`)) })
              ]
            }
          ) : null,
          telemetry ? /* @__PURE__ */ jsxs8("div", { style: chartGridStyle, children: [
            charts.includes("speed") ? /* @__PURE__ */ jsx18(
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
            charts.includes("throttleBrake") ? /* @__PURE__ */ jsx18(
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
            charts.includes("trackMap") ? /* @__PURE__ */ jsx18(
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
            charts.includes("dashboard") ? /* @__PURE__ */ jsx18("div", { style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsx18(
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
          ] }) : /* @__PURE__ */ jsxs8("p", { style: { color: palette.mutedText, margin: 0 }, children: [
            "Paste CSV data and click ",
            /* @__PURE__ */ jsx18("strong", { children: "Parse" }),
            " to preview telemetry charts."
          ] })
        ] })
      ] })
    }
  );
};

// src/hooks/useTelemetry.ts
import { useCallback, useEffect as useEffect2, useRef, useState as useState5 } from "react";
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
  return {
    time: result.time,
    speed: result.seriesMap.speed ?? EMPTY_TELEMETRY.speed,
    throttle: result.seriesMap.throttle ?? EMPTY_TELEMETRY.throttle,
    brake: result.seriesMap.brake ?? EMPTY_TELEMETRY.brake,
    x: result.seriesMap.x ?? EMPTY_TELEMETRY.x,
    y: result.seriesMap.y ?? EMPTY_TELEMETRY.y
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
  const [telemetry, setTelemetryState] = useState5(null);
  const [isLoading, setIsLoading] = useState5(false);
  const [error, setError] = useState5(null);
  const [validation, setValidation] = useState5(null);
  const fetcherRef = useRef(fetcher);
  const requestIdRef = useRef(0);
  fetcherRef.current = fetcher;
  const parseTelemetry = useCallback(
    (rawData) => {
      if (adapter) {
        return adapter(rawData);
      }
      return formatTelemetry(rawData);
    },
    [adapter]
  );
  const applyAndStore = useCallback(
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
  useEffect2(() => {
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
  const refetch = useCallback(() => {
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
  useEffect2(() => {
    if (fetcher) {
      refetch();
    }
  }, [fetcher, refetch]);
  const setTelemetry = useCallback(
    (nextTelemetry) => {
      applyAndStore(nextTelemetry);
    },
    [applyAndStore]
  );
  const reset = useCallback(() => {
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
import { useCallback as useCallback2, useMemo as useMemo18, useState as useState6 } from "react";
var useCursorSync = () => {
  const [cursorTime, setCursorTime] = useState6(null);
  const resetCursor = useCallback2(() => setCursorTime(null), []);
  const cursorProps = useMemo18(
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
import {
  createContext,
  useContext,
  useMemo as useMemo19,
  useState as useState8
} from "react";

// src/hooks/useAutoTheme.ts
import { useEffect as useEffect3, useState as useState7 } from "react";
var useAutoTheme = (fallback = "dark") => {
  const getPreferredTheme = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return fallback;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };
  const [theme, setTheme] = useState7(getPreferredTheme);
  useEffect3(() => {
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
import { jsx as jsx19 } from "react/jsx-runtime";
var TelemetryContext = createContext(null);
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
  const [manualTheme, setManualTheme] = useState8(themeProp);
  const { cursorTime, setCursorTime, cursorProps } = useCursorSync();
  const theme = autoTheme ? detectedTheme : manualTheme;
  const value = useMemo19(
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
  return /* @__PURE__ */ jsx19(TelemetryContext.Provider, { value, children });
};
var useTelemetryContext = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetryContext must be used within a <TelemetryProvider>");
  }
  return context;
};

// src/hooks/useChartExport.ts
import { useCallback as useCallback3, useRef as useRef2 } from "react";
var resolveMimeType = (format) => `image/${format}`;
var useChartExport = () => {
  const chartRef = useRef2(null);
  const getCanvas = useCallback3(() => {
    if (!chartRef.current) {
      return null;
    }
    return chartRef.current.querySelector("canvas");
  }, []);
  const toDataURL = useCallback3(
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
  const toBlob = useCallback3(
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
  const downloadImage = useCallback3(
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

// src/extensions/panels/statsPanel.tsx
import { jsx as jsx20, jsxs as jsxs9 } from "react/jsx-runtime";
var statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12
};
var statLabelStyle = {
  fontSize: 12,
  margin: 0
};
var statValueStyle = {
  margin: "4px 0 0",
  fontSize: 18,
  fontWeight: 700
};
var safeAverage = (values) => values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
var telemetryStatsPanel = {
  id: "f1-telemetry-stats",
  order: 100,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const topSpeed = telemetry.speed.length > 0 ? Math.max(...telemetry.speed) : 0;
    const avgSpeed = safeAverage(telemetry.speed);
    const avgThrottle = safeAverage(telemetry.throttle);
    const maxBrake = telemetry.brake.length > 0 ? Math.max(...telemetry.brake) : 0;
    return /* @__PURE__ */ jsxs9(
      "section",
      {
        style: {
          borderRadius: 14,
          border: `1px solid ${palette.border}`,
          background: palette.background,
          color: palette.text,
          boxShadow: palette.shadow,
          padding: 16
        },
        children: [
          /* @__PURE__ */ jsx20("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Telemetry Stats" }),
          /* @__PURE__ */ jsxs9("div", { style: statGridStyle, children: [
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx20("p", { style: statLabelStyle, children: "Top speed" }),
              /* @__PURE__ */ jsxs9("p", { style: statValueStyle, children: [
                topSpeed.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx20("p", { style: statLabelStyle, children: "Average speed" }),
              /* @__PURE__ */ jsxs9("p", { style: statValueStyle, children: [
                avgSpeed.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx20("p", { style: statLabelStyle, children: "Average throttle" }),
              /* @__PURE__ */ jsxs9("p", { style: statValueStyle, children: [
                avgThrottle.toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsx20("p", { style: statLabelStyle, children: "Max brake" }),
              /* @__PURE__ */ jsxs9("p", { style: statValueStyle, children: [
                maxBrake.toFixed(1),
                "%"
              ] })
            ] })
          ] })
        ]
      }
    );
  }
};

// src/extensions/panels/gearDistributionPanel.tsx
import { jsx as jsx21, jsxs as jsxs10 } from "react/jsx-runtime";
var bands = [
  { label: "0-25%", min: 0, max: 25 },
  { label: "26-50%", min: 26, max: 50 },
  { label: "51-75%", min: 51, max: 75 },
  { label: "76-100%", min: 76, max: 100 }
];
var getBandCount = (values, min, max) => values.filter((value) => value >= min && value <= max).length;
var gearDistributionPanel = {
  id: "f1-telemetry-gear-distribution",
  order: 110,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const counts = bands.map((band) => ({
      ...band,
      count: getBandCount(telemetry.throttle, band.min, band.max)
    }));
    const total = Math.max(1, telemetry.throttle.length);
    return /* @__PURE__ */ jsxs10(
      "section",
      {
        style: {
          borderRadius: 14,
          border: `1px solid ${palette.border}`,
          background: palette.background,
          color: palette.text,
          boxShadow: palette.shadow,
          padding: 16
        },
        children: [
          /* @__PURE__ */ jsx21("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Throttle Distribution" }),
          /* @__PURE__ */ jsx21("p", { style: { margin: "0 0 12px", fontSize: 12, color: palette.mutedText }, children: "Placeholder distribution panel for gear analytics contexts." }),
          /* @__PURE__ */ jsx21("div", { style: { display: "grid", gap: 8 }, children: counts.map((band, index) => {
            const width = Math.max(4, band.count / total * 100);
            return /* @__PURE__ */ jsxs10("div", { children: [
              /* @__PURE__ */ jsxs10("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 }, children: [
                /* @__PURE__ */ jsx21("span", { style: { fontSize: 12 }, children: band.label }),
                /* @__PURE__ */ jsxs10("span", { style: { fontSize: 12, color: palette.mutedText }, children: [
                  (band.count / total * 100).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx21(
                "div",
                {
                  style: {
                    width: "100%",
                    height: 10,
                    borderRadius: 999,
                    background: palette.primarySoft
                  },
                  children: /* @__PURE__ */ jsx21(
                    "div",
                    {
                      style: {
                        width: `${width}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: index % 2 === 0 ? palette.primary : palette.accent
                      }
                    }
                  )
                }
              )
            ] }, band.label);
          }) })
        ]
      }
    );
  }
};

// src/extensions/panels/lapSummaryPanel.tsx
import { jsx as jsx22, jsxs as jsxs11 } from "react/jsx-runtime";
var safeAverage2 = (values) => values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
var lapSummaryPanel = {
  id: "f1-telemetry-lap-summary",
  order: 120,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const bestSpeed = telemetry.speed.length > 0 ? Math.max(...telemetry.speed) : 0;
    const worstSpeed = telemetry.speed.length > 0 ? Math.min(...telemetry.speed) : 0;
    const avgThrottle = safeAverage2(telemetry.throttle);
    const avgBrake = safeAverage2(telemetry.brake);
    return /* @__PURE__ */ jsxs11(
      "section",
      {
        style: {
          borderRadius: 14,
          border: `1px solid ${palette.border}`,
          background: palette.background,
          color: palette.text,
          boxShadow: palette.shadow,
          padding: 16
        },
        children: [
          /* @__PURE__ */ jsx22("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Lap Summary" }),
          /* @__PURE__ */ jsx22(
            "table",
            {
              style: {
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13
              },
              children: /* @__PURE__ */ jsxs11("tbody", { children: [
                /* @__PURE__ */ jsxs11("tr", { children: [
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Best speed" }),
                  /* @__PURE__ */ jsxs11("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    bestSpeed.toFixed(1),
                    " km/h"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs11("tr", { children: [
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Worst speed" }),
                  /* @__PURE__ */ jsxs11("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    worstSpeed.toFixed(1),
                    " km/h"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs11("tr", { children: [
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Throttle" }),
                  /* @__PURE__ */ jsxs11("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    avgThrottle.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs11("tr", { children: [
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Brake" }),
                  /* @__PURE__ */ jsxs11("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    avgBrake.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs11("tr", { children: [
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Samples" }),
                  /* @__PURE__ */ jsx22("td", { style: { padding: "6px 0", textAlign: "right" }, children: telemetry.time.length })
                ] })
              ] })
            }
          )
        ]
      }
    );
  }
};
export {
  EnergyChart,
  F1_DRIVERS,
  F1_TEAMS,
  FLAG_TYPES,
  GapChart,
  GearChart,
  LapComparisonChart,
  MiniSectors,
  PitStopTimeline,
  PositionChart,
  RACE_CALENDAR_2025,
  RACE_COMPOUND_ALLOCATIONS,
  RadarChart,
  SpeedChart,
  SpeedHeatmapTrackMap,
  TEAM_COLORS,
  TRACKS,
  TYRE_COMPOUNDS,
  TelemetryDashboard,
  TelemetryPlayground,
  TelemetryProvider,
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
  fetchOpenF1Drivers,
  fetchOpenF1Sessions,
  fetchOpenF1Telemetry,
  fetchOpenF1TelemetryWithDiagnostics,
  findNearestIndex,
  formatTelemetry,
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
  fromParquetWithDiagnostics,
  gearDistributionPanel,
  getDriver,
  getDriverColor,
  getFlag,
  getNextRace,
  getRaceByRound,
  getRaceCompounds,
  getSprintWeekends,
  getTeam,
  getTeamDrivers,
  getTelemetryPanels,
  getTrack,
  getTrackIds,
  getTyreColor,
  interpolateTelemetry,
  lapSummaryPanel,
  mergeTelemetry,
  normalizeDistance,
  processSeriesData,
  processSeriesDataInWorker,
  registerTelemetryPanel,
  telemetryCssVariables,
  telemetryStatsPanel,
  unregisterTelemetryPanel,
  useAutoTheme,
  useChartExport,
  useCursorSync,
  useTelemetry,
  useTelemetryContext,
  validateTelemetry
};
//# sourceMappingURL=index.js.map