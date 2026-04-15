import { useMemo } from "react";
import type { Plugin } from "chart.js";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { GapChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import "../utils/chartSetup";

const createDriverLabelPlugin = (
  showLabels: boolean,
  color: string
): Plugin<"line"> => ({
  id: "f1-telemetry-gap-driver-labels",
  afterDatasetsDraw: (chart) => {
    if (!showLabels) {
      return;
    }

    const { ctx } = chart;
    ctx.save();
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden || meta.data.length === 0) {
        return;
      }

      const abbreviation = (dataset.label ?? "").slice(0, 3).toUpperCase();
      const point = meta.data[meta.data.length - 1];
      if (!point) {
        return;
      }
      ctx.fillText(abbreviation, point.x + 6, point.y);
    });

    ctx.restore();
  }
});

export const GapChart = ({
  drivers,
  referenceDriver,
  invertAxis = true,
  showDriverLabels = true,
  theme = "dark",
  height = 320,
  className,
  title = "Gap to Leader",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}: GapChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processedDrivers = useMemo(
    () =>
      drivers.map((driver) => {
        const laps = driver.data.map((point) => point.lap);
        const gaps = driver.data.map((point) => point.gap);
        const processed = processSeriesData<{ gap: number[] }>({
          context: `GapChart.${driver.driver}`,
          time: laps,
          seriesMap: { gap: gaps },
          processing
        });

        return {
          ...driver,
          laps: processed.time,
          gaps: processed.seriesMap.gap
        };
      }),
    [drivers, processing]
  );

  const reference = useMemo(
    () =>
      processedDrivers.find((driver) => driver.driver === referenceDriver) ??
      processedDrivers.find((driver) => driver.driver.toLowerCase().includes("leader")) ??
      processedDrivers[0],
    [processedDrivers, referenceDriver]
  );

  const referenceByLap = useMemo(() => {
    const map = new Map<number, number>();
    if (!reference) {
      return map;
    }
    reference.laps.forEach((lap, index) => map.set(lap, reference.gaps[index] ?? 0));
    return map;
  }, [reference]);

  const datasets = useMemo(
    () =>
      processedDrivers.map((driver, index) => {
        const color = driver.color ?? [palette.primary, palette.accent, palette.danger, "#FFC700"][index % 4];
        const points = driver.laps.map((lap, lapIndex) => ({
          x: lap,
          y: (driver.gaps[lapIndex] ?? 0) - (referenceByLap.get(lap) ?? 0)
        }));
        return {
          label: driver.driver,
          data: points,
          borderColor: color,
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 8,
          tension: 0.2
        };
      }),
    [processedDrivers, referenceByLap, palette]
  );

  const cursorSource = datasets[0]?.data ?? [];
  const cursorIndex = findNearestIndex(
    cursorSource.map((point) => point.x),
    cursorTime
  );
  const cursorTimePoint = cursorIndex >= 0 ? cursorSource[cursorIndex] : null;

  const annotationData = datasets[0]?.data ?? [];
  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        annotationData.map((point) => point.x),
        annotationData.map((point) => point.y),
        palette
      ),
    [showAnnotations, annotations, annotationData, palette]
  );

  const data = useMemo(
    () => ({
      datasets: [
        ...datasets,
        ...(showCursor && cursorTimePoint
          ? [
              {
                label: "Cursor",
                data: [cursorTimePoint],
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
    [datasets, showCursor, cursorTimePoint, palette, annotationDatasets]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "Gap to Leader (s)");
    return {
      ...base,
      scales: {
        ...base.scales,
        x: {
          ...base.scales?.x,
          ticks: {
            color: palette.mutedText,
            precision: 0
          },
          title: {
            display: true,
            text: "Lap",
            color: palette.mutedText
          }
        },
        y: {
          ...base.scales?.y,
          reverse: invertAxis
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

        const point = datasets[elements[0].datasetIndex]?.data[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, invertAxis, onCursorTimeChange, datasets]);

  const plugins = useMemo(
    () => [
      ...(showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
      ...(showAnnotations
        ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)]
        : []),
      createDriverLabelPlugin(showDriverLabels, palette.text)
    ],
    [
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid,
      showDriverLabels,
      palette.text
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
      defaultAriaLabel="Telemetry gap to leader chart"
    >
      <ClientChart
        type="line"
        data={data}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "Gap to leader line chart"}
      />
    </TelemetryCard>
  );
};
