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

// src/extensions.ts
var extensions_exports = {};
__export(extensions_exports, {
  TELEMETRY_EXTENSION_API_VERSION: () => TELEMETRY_EXTENSION_API_VERSION,
  assertTelemetryExtensionCompatible: () => assertTelemetryExtensionCompatible,
  clearTelemetryPanels: () => clearTelemetryPanels,
  gearDistributionPanel: () => gearDistributionPanel,
  getTelemetryPanels: () => getTelemetryPanels,
  lapSummaryPanel: () => lapSummaryPanel,
  normalizeTelemetryPanelExtension: () => normalizeTelemetryPanelExtension,
  overtakeTimelinePanel: () => overtakeTimelinePanel,
  registerTelemetryPanel: () => registerTelemetryPanel,
  sectorPaceEvolutionPanel: () => sectorPaceEvolutionPanel,
  stintDegradationPanel: () => stintDegradationPanel,
  telemetryStatsPanel: () => telemetryStatsPanel,
  unregisterTelemetryPanel: () => unregisterTelemetryPanel
});
module.exports = __toCommonJS(extensions_exports);

// src/extensions/contracts.ts
var TELEMETRY_EXTENSION_API_VERSION = "2.0.0";
var getMajorVersion = (value) => {
  const [major] = value.split(".");
  const parsed = Number(major);
  return Number.isFinite(parsed) ? parsed : 0;
};
var assertTelemetryExtensionCompatible = (extension) => {
  const extensionApiVersion = extension.apiVersion ?? TELEMETRY_EXTENSION_API_VERSION;
  if (getMajorVersion(extensionApiVersion) !== getMajorVersion(TELEMETRY_EXTENSION_API_VERSION)) {
    throw new Error(
      `Telemetry extension "${extension.id}" is incompatible with API ${TELEMETRY_EXTENSION_API_VERSION}.`
    );
  }
};
var normalizeTelemetryPanelExtension = (extension) => {
  assertTelemetryExtensionCompatible(extension);
  return {
    ...extension,
    apiVersion: extension.apiVersion ?? TELEMETRY_EXTENSION_API_VERSION
  };
};

// src/extensions/registry.ts
var panelRegistry = /* @__PURE__ */ new Map();
var registerTelemetryPanel = (extension) => {
  if (!extension.id) {
    throw new Error("Telemetry panel extension must include a non-empty id.");
  }
  panelRegistry.set(extension.id, normalizeTelemetryPanelExtension(extension));
};
var unregisterTelemetryPanel = (id) => {
  panelRegistry.delete(id);
};
var clearTelemetryPanels = () => {
  panelRegistry.clear();
};
var getTelemetryPanels = () => Array.from(panelRegistry.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

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
var resolveThemeTokens = (theme = "dark", overrides) => ({
  ...theme === "light" ? LIGHT_TOKENS : theme === "high-contrast" ? HIGH_CONTRAST_TOKENS : DARK_TOKENS,
  ...fromCssVariables(),
  ...overrides
});

// src/extensions/panels/statsPanel.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Telemetry Stats" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: statGridStyle, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statLabelStyle, children: "Top speed" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: statValueStyle, children: [
                topSpeed.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statLabelStyle, children: "Average speed" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: statValueStyle, children: [
                avgSpeed.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statLabelStyle, children: "Average throttle" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: statValueStyle, children: [
                avgThrottle.toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: statLabelStyle, children: "Max brake" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: statValueStyle, children: [
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
var import_jsx_runtime2 = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Throttle Distribution" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { margin: "0 0 12px", fontSize: 12, color: palette.mutedText }, children: "Placeholder distribution panel for gear analytics contexts." }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "grid", gap: 8 }, children: counts.map((band, index) => {
            const width = Math.max(4, band.count / total * 100);
            return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 12 }, children: band.label }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 12, color: palette.mutedText }, children: [
                  (band.count / total * 100).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  style: {
                    width: "100%",
                    height: 10,
                    borderRadius: 999,
                    background: palette.primarySoft
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_jsx_runtime3 = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Lap Summary" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "table",
            {
              style: {
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tbody", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Best speed" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    bestSpeed.toFixed(1),
                    " km/h"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Worst speed" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    worstSpeed.toFixed(1),
                    " km/h"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Throttle" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    avgThrottle.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Brake" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                    avgBrake.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Samples" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0", textAlign: "right" }, children: telemetry.time.length })
                ] })
              ] })
            }
          )
        ]
      }
    );
  }
};

// src/extensions/panels/stintDegradationPanel.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var average = (values) => values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
var splitIntoStints = (values) => {
  if (values.length === 0) {
    return [[], [], []];
  }
  const third = Math.max(1, Math.floor(values.length / 3));
  return [
    values.slice(0, third),
    values.slice(third, third * 2),
    values.slice(third * 2)
  ];
};
var stintDegradationPanel = {
  id: "f1-telemetry-stint-degradation",
  title: "Stint Degradation",
  order: 130,
  channels: ["degradation-summary"],
  onMount: (context) => {
    context.shared.publish("degradation-summary", {
      samples: context.telemetry.speed.length
    });
  },
  contextMenuActions: [
    {
      id: "publish-stint-samples",
      label: "Publish samples",
      onSelect: (context) => {
        context.shared.publish("degradation-summary", {
          samples: context.telemetry.speed.length
        });
      }
    }
  ],
  render: ({ telemetry, comparison, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const [early, mid, late] = splitIntoStints(telemetry.speed);
    const earlyAvg = average(early);
    const midAvg = average(mid);
    const lateAvg = average(late);
    const degradation = earlyAvg > 0 ? (earlyAvg - lateAvg) / earlyAvg * 100 : 0;
    const [comparisonEarly, comparisonMid, comparisonLate] = splitIntoStints(comparison?.speed ?? []);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Stint Degradation" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tbody", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Early stint avg speed" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                earlyAvg.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Mid stint avg speed" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                midAvg.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Late stint avg speed" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                lateAvg.toFixed(1),
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Degradation" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                degradation.toFixed(2),
                "%"
              ] })
            ] }),
            comparison ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Comparison late stint avg" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                average(comparisonLate).toFixed(1),
                " km/h (",
                comparison.label ?? "Comparison",
                ")"
              ] })
            ] }) : null,
            comparison && comparisonEarly.length > 0 && comparisonMid.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: "Comparison early/mid avg" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                average(comparisonEarly).toFixed(1),
                " / ",
                average(comparisonMid).toFixed(1),
                " km/h"
              ] })
            ] }) : null
          ] }) })
        ]
      }
    );
  }
};

// src/extensions/panels/sectorPaceEvolutionPanel.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var average2 = (values) => values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
var sectorPaceEvolutionPanel = {
  id: "f1-telemetry-sector-pace-evolution",
  title: "Sector Pace Evolution",
  order: 140,
  channels: ["sector-pace"],
  contextMenuActions: [
    {
      id: "publish-sector-pace",
      label: "Publish pace",
      onSelect: (context) => {
        const sectorMarkers = context.sectorMarkers ?? [];
        context.shared.publish("sector-pace", {
          sectors: Math.max(1, sectorMarkers.length + 1)
        });
      }
    }
  ],
  render: ({ telemetry, comparison, sectorMarkers, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const markers = [...sectorMarkers ?? []].sort((left, right) => left - right);
    const bounds = [telemetry.time[0] ?? 0, ...markers, telemetry.time[telemetry.time.length - 1] ?? 0];
    const sectors = Array.from({ length: Math.max(1, bounds.length - 1) }, (_, index) => {
      const start = bounds[index];
      const end = bounds[index + 1];
      const primaryValues = telemetry.speed.filter((_2, sampleIndex) => {
        const time = telemetry.time[sampleIndex];
        return time >= start && time <= end;
      });
      const comparisonValues = comparison ? comparison.speed.filter((_2, sampleIndex) => {
        const time = comparison.time[sampleIndex];
        return time >= start && time <= end;
      }) : [];
      const primaryAvg = average2(primaryValues);
      const comparisonAvg = average2(comparisonValues);
      return {
        sector: index + 1,
        primaryAvg,
        comparisonAvg,
        delta: comparison ? primaryAvg - comparisonAvg : null
      };
    });
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Sector Pace Evolution" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { style: { textAlign: "left", paddingBottom: 6 }, children: "Sector" }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { style: { textAlign: "right", paddingBottom: 6 }, children: "Primary" }),
              comparison ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { style: { textAlign: "right", paddingBottom: 6 }, children: "Comparison" }) : null,
              comparison ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("th", { style: { textAlign: "right", paddingBottom: 6 }, children: "Delta" }) : null
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("tbody", { children: sectors.map((sector) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("td", { style: { padding: "6px 0", color: palette.mutedText }, children: [
                "S",
                sector.sector
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                sector.primaryAvg.toFixed(1),
                " km/h"
              ] }),
              comparison ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                sector.comparisonAvg.toFixed(1),
                " km/h"
              ] }) : null,
              comparison ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("td", { style: { padding: "6px 0", textAlign: "right" }, children: [
                (sector.delta ?? 0) >= 0 ? "+" : "",
                (sector.delta ?? 0).toFixed(1),
                " km/h"
              ] }) : null
            ] }, `sector-${sector.sector}`)) })
          ] })
        ]
      }
    );
  }
};

// src/extensions/panels/overtakeTimelinePanel.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var normalizeEvent = (event) => ({
  time: event.time,
  label: event.description ?? event.type
});
var inferOvertakes = (primaryTime, primarySpeed, comparisonSpeed) => {
  const inferred = [];
  if (primaryTime.length < 2 || comparisonSpeed.length < 2) {
    return inferred;
  }
  const length = Math.min(primaryTime.length, primarySpeed.length, comparisonSpeed.length);
  for (let index = 1; index < length; index += 1) {
    const previousDelta = primarySpeed[index - 1] - comparisonSpeed[index - 1];
    const currentDelta = primarySpeed[index] - comparisonSpeed[index];
    if (previousDelta <= 0 && currentDelta > 0) {
      inferred.push({
        time: primaryTime[index],
        label: "Inferred overtake"
      });
    }
  }
  return inferred;
};
var overtakeTimelinePanel = {
  id: "f1-telemetry-overtake-timeline",
  title: "Overtake Timeline",
  order: 150,
  channels: ["overtake-events"],
  contextMenuActions: [
    {
      id: "publish-overtake-events",
      label: "Publish events",
      onSelect: (context) => {
        const eventCount = (context.telemetry.events ?? []).filter(
          (event) => event.type.toLowerCase().includes("overtake")
        ).length;
        context.shared.publish("overtake-events", { count: eventCount });
      }
    }
  ],
  render: ({ telemetry, comparison, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const explicitEvents = (telemetry.events ?? []).filter((event) => event.type.toLowerCase().includes("overtake") || event.type.toLowerCase().includes("pass")).map(normalizeEvent);
    const inferredEvents = explicitEvents.length === 0 && comparison ? inferOvertakes(telemetry.time, telemetry.speed, comparison.speed) : [];
    const events = explicitEvents.length > 0 ? explicitEvents : inferredEvents;
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h4", { style: { margin: "0 0 12px", fontSize: 15 }, children: "Overtake Timeline" }),
          events.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("ol", { style: { margin: 0, paddingLeft: 18, display: "grid", gap: 8, fontSize: 13 }, children: events.map((event, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("strong", { style: { marginRight: 6 }, children: [
              "t=",
              event.time.toFixed(2),
              "s"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { color: palette.mutedText }, children: event.label })
          ] }, `overtake-${event.time}-${index}`)) }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { margin: 0, color: palette.mutedText, fontSize: 13 }, children: "No explicit overtake events were found in this telemetry session." })
        ]
      }
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TELEMETRY_EXTENSION_API_VERSION,
  assertTelemetryExtensionCompatible,
  clearTelemetryPanels,
  gearDistributionPanel,
  getTelemetryPanels,
  lapSummaryPanel,
  normalizeTelemetryPanelExtension,
  overtakeTimelinePanel,
  registerTelemetryPanel,
  sectorPaceEvolutionPanel,
  stintDegradationPanel,
  telemetryStatsPanel,
  unregisterTelemetryPanel
});
//# sourceMappingURL=extensions.cjs.map