import { useMemo } from "react";
import type { Plugin } from "chart.js";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { GearChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import { ensureChartSetup } from "../utils/chartSetup";

ensureChartSetup();

const createGearBandPlugin = (enabled: boolean, color: string): Plugin<"line"> => ({
  id: "f1-telemetry-gear-bands",
  beforeDatasetsDraw: (chart) => {
    if (!enabled) {
      return;
    }

    const yScale = chart.scales.y;
    const chartArea = chart.chartArea;
    if (!yScale || !chartArea) {
      return;
    }

    const { ctx } = chart;
    ctx.save();
    ctx.fillStyle = color;

    for (let gear = 0; gear < 8; gear += 1) {
      if (gear % 2 !== 0) {
        continue;
      }
      const top = yScale.getPixelForValue(gear + 0.5);
      const bottom = yScale.getPixelForValue(gear - 0.5);
      const height = bottom - top;
      ctx.fillRect(chartArea.left, top, chartArea.right - chartArea.left, height);
    }

    ctx.restore();
  }
});

export const GearChart = ({
  time,
  gear,
  showGearBands = true,
  theme = "dark",
  height = 320,
  className,
  title = "Gear vs Time",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}: GearChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processed = useMemo(
    () =>
      processSeriesData<{ gear: number[] }>({
        context: "GearChart",
        time,
        seriesMap: { gear },
        processing
      }),
    [time, gear, processing]
  );

  const points = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: Math.max(0, Math.min(8, Math.round(processed.seriesMap.gear[index])))
      })),
    [processed.time, processed.seriesMap.gear]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? points[cursorIndex] : null;

  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        processed.time,
        points.map((point) => point.y),
        palette
      ),
    [showAnnotations, annotations, processed.time, points, palette]
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "Gear",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          stepped: "before" as const,
          tension: 0,
          fill: true
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
          : []),
        ...annotationDatasets
      ]
    }),
    [points, palette, showCursor, cursorPoint, annotationDatasets]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "Gear", { min: 0, max: 8 });
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          min: 0,
          max: 8,
          ticks: {
            stepSize: 1,
            color: palette.mutedText
          }
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

        onCursorTimeChange(points[elements[0].index]?.x ?? null);
      }
    };
  }, [palette, onCursorTimeChange, points]);

  const plugins = useMemo(
    () => [
      createGearBandPlugin(showGearBands, palette.primarySoft),
      ...(showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
      ...(showAnnotations
        ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)]
        : [])
    ],
    [
      showGearBands,
      palette.primarySoft,
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid
    ]
  );

  return (
    <TelemetryCard
      theme={theme}
      height={height}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Telemetry gear chart"
    >
      <ClientChart
        type="line"
        data={chartData}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "Gear over time chart"}
      />
    </TelemetryCard>
  );
};
