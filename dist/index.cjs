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
  ThrottleBrakeChart: () => ThrottleBrakeChart,
  TrackMap: () => TrackMap,
  formatTelemetry: () => formatTelemetry
});
module.exports = __toCommonJS(index_exports);

// src/components/SpeedChart.tsx
var import_react = require("react");
var import_react_chartjs_2 = require("react-chartjs-2");

// src/components/chartTheme.ts
var darkPalette = {
  background: "#10131a",
  border: "rgba(255,255,255,0.08)",
  text: "#f5f8ff",
  mutedText: "#9da6ba",
  grid: "rgba(255,255,255,0.1)",
  primary: "#56b8ff",
  primarySoft: "rgba(86, 184, 255, 0.2)",
  accent: "#6ee7b7",
  danger: "#ff7f9f"
};
var lightPalette = {
  background: "#ffffff",
  border: "rgba(15,23,42,0.12)",
  text: "#0f172a",
  mutedText: "#475569",
  grid: "rgba(148,163,184,0.35)",
  primary: "#0073ff",
  primarySoft: "rgba(0, 115, 255, 0.15)",
  accent: "#0f9f6e",
  danger: "#dc3f66"
};
var getThemePalette = (theme = "dark") => theme === "light" ? lightPalette : darkPalette;
var getCardStyle = (theme = "dark", height = 320) => {
  const palette = getThemePalette(theme);
  return {
    height,
    background: palette.background,
    border: `1px solid ${palette.border}`,
    borderRadius: 14,
    padding: 16,
    boxShadow: theme === "light" ? "0 8px 24px rgba(15, 23, 42, 0.08)" : "0 8px 30px rgba(0, 0, 0, 0.35)"
  };
};
var getTitleStyle = (theme = "dark") => {
  const palette = getThemePalette(theme);
  return {
    margin: "0 0 12px",
    color: palette.text,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.02em"
  };
};
var createLineOptions = (theme, yAxisLabel, yRange) => {
  const palette = getThemePalette(theme);
  return {
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
  };
};
var createTrackMapOptions = (theme) => {
  const palette = getThemePalette(theme);
  return {
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
  };
};

// src/utils/chartSetup.ts
var import_chart = require("chart.js");
import_chart.Chart.register(import_chart.CategoryScale, import_chart.LinearScale, import_chart.PointElement, import_chart.LineElement, import_chart.Title, import_chart.Tooltip, import_chart.Legend, import_chart.Filler);

// src/components/SpeedChart.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SpeedChart = (props) => {
  const { theme = "dark", height = 320, className, title = "Speed vs Time" } = props;
  const time = props.data?.time ?? props.time ?? [];
  const speed = props.data?.speed ?? props.speed ?? [];
  const palette = (0, import_react.useMemo)(() => getThemePalette(theme), [theme]);
  const points = (0, import_react.useMemo)(() => {
    const length = Math.min(time.length, speed.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: speed[index]
    }));
  }, [time, speed]);
  const chartData = (0, import_react.useMemo)(
    () => ({
      datasets: [
        {
          label: "Speed (km/h)",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.28,
          fill: true
        }
      ]
    }),
    [palette, points]
  );
  const options = (0, import_react.useMemo)(() => createLineOptions(theme, "Speed (km/h)"), [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className, style: getCardStyle(theme, height), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: getTitleStyle(theme), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_chartjs_2.Line, { data: chartData, options }) })
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
  title = "Throttle & Brake"
}) => {
  const palette = (0, import_react2.useMemo)(() => getThemePalette(theme), [theme]);
  const throttlePoints = (0, import_react2.useMemo)(() => {
    const length = Math.min(time.length, throttle.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: throttle[index]
    }));
  }, [time, throttle]);
  const brakePoints = (0, import_react2.useMemo)(() => {
    const length = Math.min(time.length, brake.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: brake[index]
    }));
  }, [time, brake]);
  const data = (0, import_react2.useMemo)(
    () => ({
      datasets: [
        {
          label: "Throttle (%)",
          data: throttlePoints,
          borderColor: palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.2)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "Brake (%)",
          data: brakePoints,
          borderColor: palette.danger,
          backgroundColor: "rgba(255, 127, 159, 0.2)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        }
      ]
    }),
    [palette, throttlePoints, brakePoints]
  );
  const options = (0, import_react2.useMemo)(() => createLineOptions(theme, "Input (%)", { min: 0, max: 100 }), [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className, style: getCardStyle(theme, height), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: getTitleStyle(theme), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_chartjs_22.Line, { data, options }) })
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
  title = "Lap Comparison"
}) => {
  const palette = (0, import_react3.useMemo)(() => getThemePalette(theme), [theme]);
  const driver1Points = (0, import_react3.useMemo)(() => {
    const length = Math.min(driver1.time.length, driver1.speed.length);
    return Array.from({ length }, (_, index) => ({
      x: driver1.time[index],
      y: driver1.speed[index]
    }));
  }, [driver1.speed, driver1.time]);
  const driver2Points = (0, import_react3.useMemo)(() => {
    const length = Math.min(driver2.time.length, driver2.speed.length);
    return Array.from({ length }, (_, index) => ({
      x: driver2.time[index],
      y: driver2.speed[index]
    }));
  }, [driver2.speed, driver2.time]);
  const data = (0, import_react3.useMemo)(
    () => ({
      datasets: [
        {
          label: driver1Label ?? driver1.label ?? "Driver 1",
          data: driver1Points,
          borderColor: driver1.color ?? palette.primary,
          backgroundColor: "rgba(86, 184, 255, 0.22)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: driver2Label ?? driver2.label ?? "Driver 2",
          data: driver2Points,
          borderColor: driver2.color ?? palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.22)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25
        }
      ]
    }),
    [driver1.color, driver1.label, driver1Label, driver1Points, driver2.color, driver2.label, driver2Label, driver2Points, palette.accent, palette.primary]
  );
  const options = (0, import_react3.useMemo)(() => createLineOptions(theme, "Speed (km/h)"), [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className, style: getCardStyle(theme, height), children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: getTitleStyle(theme), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react_chartjs_23.Line, { data, options }) })
  ] });
};

// src/components/TrackMap.tsx
var import_react4 = require("react");
var import_react_chartjs_24 = require("react-chartjs-2");
var import_jsx_runtime4 = require("react/jsx-runtime");
var TrackMap = ({
  x,
  y,
  theme = "dark",
  height = 360,
  className,
  title = "Track Map"
}) => {
  const palette = (0, import_react4.useMemo)(() => getThemePalette(theme), [theme]);
  const points = (0, import_react4.useMemo)(() => {
    const length = Math.min(x.length, y.length);
    return Array.from({ length }, (_, index) => ({
      x: x[index],
      y: y[index]
    }));
  }, [x, y]);
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
          tension: 0.12
        }
      ]
    }),
    [palette, points]
  );
  const options = (0, import_react4.useMemo)(() => createTrackMapOptions(theme), [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className, style: getCardStyle(theme, height), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: getTitleStyle(theme), children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { height: "calc(100% - 26px)" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_chartjs_24.Scatter, { data, options }) })
  ] });
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
  return formatted;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LapComparisonChart,
  SpeedChart,
  ThrottleBrakeChart,
  TrackMap,
  formatTelemetry
});
//# sourceMappingURL=index.cjs.map