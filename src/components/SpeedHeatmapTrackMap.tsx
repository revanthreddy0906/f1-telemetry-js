import { useMemo } from "react";
import type { ChartDataset } from "chart.js";
import { createTrackMapOptions, resolveThemeTokens } from "./chartTheme";
import type { SpeedHeatmapTrackMapProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createTrackAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import { ensureChartSetup } from "../utils/chartSetup";

ensureChartSetup();

const toRgb = (hexColor: string): [number, number, number] => {
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

const mixColor = (left: string, right: string, t: number): string => {
  const [lr, lg, lb] = toRgb(left);
  const [rr, rg, rb] = toRgb(right);
  const blend = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${blend(lr, rr)}, ${blend(lg, rg)}, ${blend(lb, rb)})`;
};

const colorFromScale = (
  value: number,
  min: number,
  max: number,
  scale: { min: string; mid: string; max: string }
): string => {
  if (max <= min) {
    return scale.mid;
  }
  const normalized = (value - min) / (max - min);
  if (normalized <= 0.5) {
    return mixColor(scale.min, scale.mid, normalized / 0.5);
  }
  return mixColor(scale.mid, scale.max, (normalized - 0.5) / 0.5);
};

export const SpeedHeatmapTrackMap = ({
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
}: SpeedHeatmapTrackMapProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const scale = useMemo(
    () => ({
      min: colorScale?.min ?? "#FF4444",
      mid: colorScale?.mid ?? "#FFAA00",
      max: colorScale?.max ?? "#00CC66"
    }),
    [colorScale]
  );

  const timeAxis = useMemo(() => time ?? x.map((_, index) => index), [time, x]);

  const processed = useMemo(
    () =>
      processSeriesData<{ x: number[]; y: number[]; speed: number[] }>({
        context: "SpeedHeatmapTrackMap",
        time: timeAxis,
        seriesMap: { x, y, speed },
        processing
      }),
    [timeAxis, x, y, speed, processing]
  );

  const points = useMemo(
    () =>
      processed.seriesMap.x.map((xValue, index) => ({
        x: xValue,
        y: processed.seriesMap.y[index]
      })),
    [processed.seriesMap.x, processed.seriesMap.y]
  );

  const speedMin = Math.min(...processed.seriesMap.speed, 0);
  const speedMax = Math.max(...processed.seriesMap.speed, 0);

  const segmentDatasets = useMemo(() => {
    const datasets: ChartDataset<"scatter", { x: number; y: number }[]>[] = [];
    const chunk = Math.max(2, segmentSize);

    for (let index = 0; index < points.length - 1; index += chunk) {
      const end = Math.min(index + chunk, points.length - 1);
      const segmentPoints = points.slice(index, end + 1);
      if (segmentPoints.length < 2) {
        continue;
      }

      const segmentSpeeds = processed.seriesMap.speed.slice(index, end + 1);
      const avgSpeed =
        segmentSpeeds.reduce((sum, value) => sum + value, 0) / Math.max(segmentSpeeds.length, 1);
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

  const annotationDatasets = useMemo(
    () =>
      createTrackAnnotationDatasets(
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
        ...segmentDatasets,
        ...(showCursor && cursorPoint
          ? [
              {
                label: cursorSpeed !== null ? `Cursor (${cursorSpeed.toFixed(1)} km/h)` : "Cursor",
                data: [cursorPoint],
                showLine: false,
                borderColor: palette.primary,
                backgroundColor: palette.primary,
                pointRadius: 5
              }
            ]
          : []),
        ...annotationDatasets
      ]
    }),
    [segmentDatasets, showCursor, cursorPoint, cursorSpeed, palette, annotationDatasets]
  );

  const options = useMemo(() => {
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
      onHover: (_event: unknown, elements: Array<{ datasetIndex: number; index: number }>) => {
        if (!onCursorTimeChange) {
          return;
        }

        if (elements.length === 0) {
          onCursorTimeChange(null);
          return;
        }

        const hovered = data.datasets[elements[0].datasetIndex]?.data as Array<{ x: number; y: number }> | undefined;
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

  return (
    <TelemetryCard
      theme={theme}
      height={height}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Telemetry speed heatmap track map"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1 }}>
          <ClientChart
            type="scatter"
            data={data}
            options={options}
            ariaLabel={ariaLabel ?? "Track map with speed heatmap"}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${scale.min} 0%, ${scale.mid} 50%, ${scale.max} 100%)`
            }}
          />
          <div
            style={{
              marginTop: 4,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: palette.mutedText
            }}
          >
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </TelemetryCard>
  );
};
