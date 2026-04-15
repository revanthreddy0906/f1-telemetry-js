import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  createLineOptions,
  getCardStyle,
  getTitleStyle,
  resolveThemeTokens
} from "./chartTheme";
import type { ThrottleBrakeChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createCursorLinePlugin } from "../utils/plugins";
import "../utils/chartSetup";

export const ThrottleBrakeChart = ({
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
}: ThrottleBrakeChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processed = useMemo(
    () =>
      processSeriesData<{ throttle: number[]; brake: number[] }>({
        context: "ThrottleBrakeChart",
        time,
        seriesMap: { throttle, brake },
        processing
      }),
    [time, throttle, brake, processing]
  );

  const throttlePoints = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.throttle[index]
      })),
    [processed.time, processed.seriesMap.throttle]
  );

  const brakePoints = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.brake[index]
      })),
    [processed.time, processed.seriesMap.brake]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorThrottle =
    cursorIndex >= 0
      ? { x: processed.time[cursorIndex], y: processed.seriesMap.throttle[cursorIndex] }
      : null;
  const cursorBrake =
    cursorIndex >= 0
      ? { x: processed.time[cursorIndex], y: processed.seriesMap.brake[cursorIndex] }
      : null;

  const chartData = useMemo(
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
        ...(showCursor && cursorThrottle
          ? [
              {
                label: "Throttle Cursor",
                data: [cursorThrottle],
                borderColor: palette.accent,
                backgroundColor: palette.accent,
                showLine: false,
                pointRadius: 4
              }
            ]
          : []),
        ...(showCursor && cursorBrake
          ? [
              {
                label: "Brake Cursor",
                data: [cursorBrake],
                borderColor: palette.danger,
                backgroundColor: palette.danger,
                showLine: false,
                pointRadius: 4
              }
            ]
          : [])
      ]
    }),
    [throttlePoints, brakePoints, palette, cursorThrottle, cursorBrake, showCursor]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "Input (%)", { min: 0, max: 100 });
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

        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);

  const plugins = useMemo(
    () => (showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
    [showCursor, cursorTime, palette.mutedText]
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
