import { useMemo } from "react";
import type { Plugin } from "chart.js";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { PositionChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import "../utils/chartSetup";

const withAlpha = (color: string, alpha: number): string => {
  const hex = color.replace("#", "");
  if (hex.length !== 6) {
    return color;
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createPositionLabelsPlugin = (
  highlighted: Set<string>,
  enabled: boolean,
  color: string
): Plugin<"line"> => ({
  id: "f1-telemetry-position-labels",
  afterDatasetsDraw: (chart) => {
    if (!enabled) {
      return;
    }

    const { ctx } = chart;
    ctx.save();
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const label = dataset.label ?? "";
      if (!highlighted.has(label)) {
        return;
      }

      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden || meta.data.length === 0) {
        return;
      }
      const point = meta.data[meta.data.length - 1];
      if (!point) {
        return;
      }

      ctx.fillText(label.slice(0, 3).toUpperCase(), point.x + 5, point.y);
    });

    ctx.restore();
  }
});

export const PositionChart = ({
  drivers,
  totalLaps,
  highlightDrivers,
  showDriverLabels = true,
  theme = "dark",
  height = 320,
  className,
  title = "Position Changes",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}: PositionChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const highlighted = useMemo(
    () => new Set((highlightDrivers ?? []).map((driver) => driver.trim())),
    [highlightDrivers]
  );

  const processedDrivers = useMemo(
    () =>
      drivers.map((driver) => {
        const laps = Array.from({ length: Math.min(driver.positions.length, totalLaps) }, (_, index) => index + 1);
        const positions = driver.positions.slice(0, totalLaps);
        const processed = processSeriesData<{ position: number[] }>({
          context: `PositionChart.${driver.driver}`,
          time: laps,
          seriesMap: { position: positions },
          processing
        });

        return {
          ...driver,
          laps: processed.time,
          positions: processed.seriesMap.position
        };
      }),
    [drivers, totalLaps, processing]
  );

  const datasets = useMemo(
    () =>
      processedDrivers.map((driver, index) => {
        const highlight = highlighted.size === 0 ? true : highlighted.has(driver.driver);
        const color = driver.color ?? [palette.primary, palette.accent, palette.danger, "#FFC700"][index % 4];
        const borderColor = highlight ? color : withAlpha(color, 0.5);

        return {
          label: driver.driver,
          data: driver.laps.map((lap, lapIndex) => ({
            x: lap,
            y: Math.max(1, Math.round(driver.positions[lapIndex] ?? 20))
          })),
          borderColor,
          backgroundColor: "transparent",
          borderWidth: highlight ? 3 : 1.5,
          pointRadius: highlight ? 2 : 0,
          pointHoverRadius: highlight ? 4 : 0,
          tension: 0,
          stepped: "before" as const
        };
      }),
    [processedDrivers, highlighted, palette]
  );

  const cursorSource = datasets[0]?.data ?? [];
  const cursorIndex = findNearestIndex(
    cursorSource.map((point) => point.x),
    cursorTime
  );
  const cursorPoint = cursorIndex >= 0 ? cursorSource[cursorIndex] : null;

  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        cursorSource.map((point) => point.x),
        cursorSource.map((point) => point.y),
        palette
      ),
    [showAnnotations, annotations, cursorSource, palette]
  );

  const data = useMemo(
    () => ({
      datasets: [
        ...datasets,
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
    [datasets, showCursor, cursorPoint, palette, annotationDatasets]
  );

  const options = useMemo(() => {
    const maxPosition = Math.max(
      20,
      ...processedDrivers.map((driver) => Math.max(...driver.positions.map((position) => Math.round(position || 0)), 1))
    );
    const base = createLineOptions(palette, "Position", { min: 1, max: maxPosition });
    return {
      ...base,
      scales: {
        ...base.scales,
        x: {
          ...base.scales?.x,
          min: 1,
          max: totalLaps,
          title: {
            display: true,
            text: "Lap",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText,
            precision: 0
          }
        },
        y: {
          ...base.scales?.y,
          reverse: true,
          min: 1,
          max: maxPosition,
          ticks: {
            color: palette.mutedText,
            stepSize: 1
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

        const point = datasets[elements[0].datasetIndex]?.data[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, processedDrivers, totalLaps, onCursorTimeChange, datasets]);

  const plugins = useMemo(
    () => [
      ...(showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
      ...(showAnnotations
        ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)]
        : []),
      createPositionLabelsPlugin(highlighted, showDriverLabels, palette.text)
    ],
    [
      showCursor,
      cursorTime,
      palette.mutedText,
      showAnnotations,
      annotations,
      palette.grid,
      highlighted,
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
      defaultAriaLabel="Telemetry position changes chart"
    >
      <ClientChart
        type="line"
        data={data}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "Race position change spaghetti chart"}
      />
    </TelemetryCard>
  );
};
