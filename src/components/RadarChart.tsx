import { useMemo } from "react";
import { resolveThemeTokens } from "./chartTheme";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import type { RadarChartProps } from "../types/telemetry";
import "../utils/chartSetup";

const hexToRgba = (hexColor: string, opacity: number): string => {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return hexColor;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const RadarChart = ({
  drivers,
  metricLabels,
  theme = "dark",
  height = 380,
  className,
  styleTokens,
  ariaLabel,
  fillOpacity = 0.2,
  title = "Driver Comparison"
}: RadarChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const keys = useMemo(() => {
    const allKeys = new Set<string>();
    drivers.slice(0, 4).forEach((driver) => {
      Object.keys(driver.metrics).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [drivers]);

  const labels = useMemo(
    () => keys.map((key) => metricLabels?.[key] ?? key),
    [keys, metricLabels]
  );

  const data = useMemo(
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

  const options = useMemo(
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

  return (
    <TelemetryCard
      theme={theme}
      height={height}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Driver radar comparison chart"
    >
      <ClientChart
        type="radar"
        data={data}
        options={options}
        ariaLabel={ariaLabel ?? "Driver radar metrics chart"}
      />
    </TelemetryCard>
  );
};
