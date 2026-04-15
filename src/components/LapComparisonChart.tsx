import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  createLineOptions,
  getCardStyle,
  getTitleStyle,
  resolveThemeTokens
} from "./chartTheme";
import type { LapComparisonChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createCursorLinePlugin, createSectorMarkersPlugin } from "../utils/plugins";
import "../utils/chartSetup";

export const LapComparisonChart = ({
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
}: LapComparisonChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processedDriver1 = useMemo(
    () =>
      processSeriesData<{ speed: number[] }>({
        context: "LapComparisonChart.driver1",
        time: driver1.time,
        seriesMap: { speed: driver1.speed },
        processing
      }),
    [driver1.time, driver1.speed, processing]
  );

  const processedDriver2 = useMemo(
    () =>
      processSeriesData<{ speed: number[] }>({
        context: "LapComparisonChart.driver2",
        time: driver2.time,
        seriesMap: { speed: driver2.speed },
        processing
      }),
    [driver2.time, driver2.speed, processing]
  );

  const overlayData = useMemo(
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

  const deltaPoints = useMemo(() => {
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

  const chartData = useMemo(
    () =>
      mode === "delta"
        ? {
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
              ...(showCursor && cursorPoint
                ? [
                    {
                      label: "Delta Cursor",
                      data: [cursorPoint],
                      borderColor: palette.primary,
                      backgroundColor: palette.primary,
                      showLine: false,
                      pointRadius: 4
                    }
                  ]
                : [])
            ]
          }
        : {
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
              ...(showCursor && cursorPoint
                ? [
                    {
                      label: "Cursor",
                      data: [cursorPoint],
                      borderColor: palette.primary,
                      backgroundColor: palette.primary,
                      showLine: false,
                      pointRadius: 4
                    }
                  ]
                : [])
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

  const options = useMemo(() => {
    const base = createLineOptions(palette, mode === "delta" ? "Delta Speed (km/h)" : "Speed (km/h)");
    return {
      ...base,
      onHover: (_event: unknown, elements: Array<{ datasetIndex: number; index: number }>) => {
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

  const plugins = useMemo(
    () => [
      ...(showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
      createSectorMarkersPlugin(sectorMarkers, palette.grid)
    ],
    [showCursor, cursorTime, palette.mutedText, palette.grid, sectorMarkers]
  );

  return (
    <div className={className} style={getCardStyle(theme, height, styleTokens)}>
      <p style={getTitleStyle(theme, styleTokens)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Line data={chartData} options={options} plugins={plugins} />
      </div>
    </div>
  );
};
