import type { ChartOptions } from "chart.js";
import type { CSSProperties } from "react";
import type { ThemeMode } from "../types/telemetry";

type ThemePalette = {
  background: string;
  border: string;
  text: string;
  mutedText: string;
  grid: string;
  primary: string;
  primarySoft: string;
  accent: string;
  danger: string;
};

const darkPalette: ThemePalette = {
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

const lightPalette: ThemePalette = {
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

export const getThemePalette = (theme: ThemeMode = "dark"): ThemePalette =>
  theme === "light" ? lightPalette : darkPalette;

export const getCardStyle = (theme: ThemeMode = "dark", height = 320): CSSProperties => {
  const palette = getThemePalette(theme);

  return {
    height,
    background: palette.background,
    border: `1px solid ${palette.border}`,
    borderRadius: 14,
    padding: 16,
    boxShadow:
      theme === "light" ? "0 8px 24px rgba(15, 23, 42, 0.08)" : "0 8px 30px rgba(0, 0, 0, 0.35)"
  };
};

export const getTitleStyle = (theme: ThemeMode = "dark"): CSSProperties => {
  const palette = getThemePalette(theme);

  return {
    margin: "0 0 12px",
    color: palette.text,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.02em"
  };
};

export const createLineOptions = (
  theme: ThemeMode,
  yAxisLabel: string,
  yRange?: { min?: number; max?: number }
): ChartOptions<"line"> => {
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

export const createTrackMapOptions = (theme: ThemeMode): ChartOptions<"scatter"> => {
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
