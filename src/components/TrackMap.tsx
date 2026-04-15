import { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  createTrackMapOptions,
  getCardStyle,
  getTitleStyle,
  resolveThemeTokens
} from "./chartTheme";
import type { TrackMapProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import "../utils/chartSetup";

export const TrackMap = ({
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
}: TrackMapProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const timeAxis = useMemo(() => time ?? x.map((_, index) => index), [time, x]);

  const processed = useMemo(
    () =>
      processSeriesData<{ x: number[]; y: number[] }>({
        context: "TrackMap",
        time: timeAxis,
        seriesMap: { x, y },
        processing
      }),
    [timeAxis, x, y, processing]
  );

  const points = useMemo(
    () =>
      processed.seriesMap.x.map((xValue, index) => ({
        x: xValue,
        y: processed.seriesMap.y[index]
      })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;

  const data = useMemo(
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
        ...(showCursor && cursorPoint
          ? [
              {
                label: "Cursor Position",
                data: [cursorPoint],
                showLine: false,
                borderColor: palette.accent,
                backgroundColor: palette.accent,
                pointRadius: 5
              }
            ]
          : [])
      ]
    }),
    [points, palette, cursorPoint, showCursor]
  );

  const options = useMemo(() => {
    const base = createTrackMapOptions(palette);
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

  return (
    <div className={className} style={getCardStyle(theme, height, styleTokens)}>
      <p style={getTitleStyle(theme, styleTokens)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};
