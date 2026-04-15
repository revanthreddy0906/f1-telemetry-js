import { useMemo } from "react";
import { createTrackMapOptions, resolveThemeTokens } from "./chartTheme";
import type { TrackMapProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createTrackAnnotationDataset } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import { ensureChartSetup } from "../utils/chartSetup";

ensureChartSetup();

export const TrackMap = ({
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

  const annotationDatasets = useMemo(
    () =>
      createTrackAnnotationDataset(
        showAnnotations ? annotations : undefined,
        points,
        processed.time,
        palette
      ),
    [showAnnotations, annotations, points, processed.time, palette]
  );

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
          : []),
        ...annotationDatasets
      ]
    }),
    [points, palette, cursorPoint, showCursor, annotationDatasets]
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
    <TelemetryCard
      theme={theme}
      height={height}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Telemetry track map chart"
    >
      <ClientChart
        type="scatter"
        data={data}
        options={options}
        ariaLabel={ariaLabel ?? "Track map scatter chart"}
      />
    </TelemetryCard>
  );
};
