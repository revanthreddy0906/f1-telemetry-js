import type { ChartOptions } from "chart.js";
import type { CSSProperties } from "react";
import type { TelemetryStyleTokens, ThemeMode } from "../types/telemetry";

const DARK_TOKENS: TelemetryStyleTokens = {
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

const LIGHT_TOKENS: TelemetryStyleTokens = {
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

const TELEMETRY_CSS_VARIABLES: Record<keyof TelemetryStyleTokens, string> = {
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

const readCssVariable = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : null;
};

const fromCssVariables = (): Partial<TelemetryStyleTokens> =>
  Object.fromEntries(
    Object.entries(TELEMETRY_CSS_VARIABLES)
      .map(([key, cssVariable]) => [key, readCssVariable(cssVariable)])
      .filter(([, value]) => value !== null)
  ) as Partial<TelemetryStyleTokens>;

export const telemetryCssVariables = TELEMETRY_CSS_VARIABLES;

export const createTelemetryCssVariables = (
  tokens: Partial<TelemetryStyleTokens>
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tokens).flatMap(([key, value]) => {
      if (!value || !(key in TELEMETRY_CSS_VARIABLES)) {
        return [];
      }
      return [[TELEMETRY_CSS_VARIABLES[key as keyof TelemetryStyleTokens], value]];
    })
  );

export const resolveThemeTokens = (
  theme: ThemeMode = "dark",
  overrides?: Partial<TelemetryStyleTokens>
): TelemetryStyleTokens => ({
  ...(theme === "light" ? LIGHT_TOKENS : DARK_TOKENS),
  ...fromCssVariables(),
  ...overrides
});

export const getCardStyle = (
  theme: ThemeMode = "dark",
  height = 320,
  styleTokens?: Partial<TelemetryStyleTokens>
): CSSProperties => {
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

export const getTitleStyle = (
  theme: ThemeMode = "dark",
  styleTokens?: Partial<TelemetryStyleTokens>
): CSSProperties => {
  const palette = resolveThemeTokens(theme, styleTokens);

  return {
    margin: "0 0 12px",
    color: palette.text,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.02em"
  };
};

export const createLineOptions = (
  palette: TelemetryStyleTokens,
  yAxisLabel: string,
  yRange?: { min?: number; max?: number }
): ChartOptions<"line"> => ({
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

export const createTrackMapOptions = (palette: TelemetryStyleTokens): ChartOptions<"scatter"> => ({
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
