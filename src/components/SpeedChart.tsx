import { useMemo } from "react";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { SpeedChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import { ensureChartSetup } from "../utils/chartSetup";

ensureChartSetup();

export const SpeedChart = (props: SpeedChartProps) => {
  const {
    theme = "dark",
    height = 320,
    className,
    title = "Speed vs Time",
    ariaLabel,
    processing,
    styleTokens,
    showCursor = true,
    cursorTime,
    onCursorTimeChange,
    annotations,
    showAnnotations = true
  } = props;

  const rawTime = props.data?.time ?? props.time ?? [];
  const rawSpeed = props.data?.speed ?? props.speed ?? [];

  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processed = useMemo(
    () =>
      processSeriesData<{ speed: number[] }>({
        context: "SpeedChart",
        time: rawTime,
        seriesMap: { speed: rawSpeed },
        processing
      }),
    [rawTime, rawSpeed, processing]
  );

  const points = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.speed[index]
      })),
    [processed.time, processed.seriesMap.speed]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint =
    cursorIndex >= 0
      ? {
          x: processed.time[cursorIndex],
          y: processed.seriesMap.speed[cursorIndex]
        }
      : null;

  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        processed.time,
        processed.seriesMap.speed,
        palette
      ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.speed, palette]
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "Speed (km/h)",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.28,
          fill: true
        },
        ...(showCursor && cursorPoint
          ? [
              {
                label: "Cursor",
                data: [cursorPoint],
                borderColor: palette.primary,
                backgroundColor: palette.primary,
                pointRadius: 4,
                pointHoverRadius: 4,
                showLine: false
              }
            ]
          : []),
        ...annotationDatasets
      ]
    }),
    [points, palette, cursorPoint, showCursor, annotationDatasets]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "Speed (km/h)");

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

        const point = points[elements[0].index];
        onCursorTimeChange(point?.x ?? null);
      }
    };
  }, [palette, onCursorTimeChange, points]);

  const plugins = useMemo(
    () => [
      ...(showCursor ? [createCursorLinePlugin(cursorTime, palette.mutedText)] : []),
      ...(showAnnotations
        ? [createAnnotationMarkersPlugin(annotations, palette.grid, palette.mutedText)]
        : [])
    ],
    [showCursor, cursorTime, palette.mutedText, showAnnotations, annotations, palette.grid]
  );

  return (
    <TelemetryCard
      theme={theme}
      height={height}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Telemetry speed chart"
    >
      <ClientChart
        type="line"
        data={chartData}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "Speed over time line chart"}
      />
    </TelemetryCard>
  );
};
