import { useMemo } from "react";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { EnergyChartProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import "../utils/chartSetup";

export const EnergyChart = ({
  time,
  ersDeployment,
  ersHarvest,
  batteryLevel,
  showBatteryLevel = true,
  theme = "dark",
  height = 320,
  className,
  title = "ERS Energy",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}: EnergyChartProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const processed = useMemo(
    () =>
      processSeriesData<{ deployment: number[]; harvest: number[]; battery: number[] }>({
        context: "EnergyChart",
        time,
        seriesMap: {
          deployment: ersDeployment,
          harvest: ersHarvest,
          battery: batteryLevel ?? ersDeployment.map(() => 0)
        },
        processing
      }),
    [time, ersDeployment, ersHarvest, batteryLevel, processing]
  );

  const deploymentPoints = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.deployment[index]
      })),
    [processed.time, processed.seriesMap.deployment]
  );

  const harvestPoints = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.harvest[index]
      })),
    [processed.time, processed.seriesMap.harvest]
  );

  const batteryPoints = useMemo(
    () =>
      processed.time.map((value, index) => ({
        x: value,
        y: processed.seriesMap.battery[index]
      })),
    [processed.time, processed.seriesMap.battery]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint = cursorIndex >= 0 ? deploymentPoints[cursorIndex] : null;

  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        processed.time,
        processed.seriesMap.deployment,
        palette
      ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.deployment, palette]
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "ERS Deployment (%)",
          data: deploymentPoints,
          borderColor: palette.danger,
          backgroundColor: "rgba(255, 127, 159, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2,
          fill: true
        },
        {
          label: "ERS Harvest (%)",
          data: harvestPoints,
          borderColor: palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.22)",
          pointRadius: 0,
          pointHitRadius: 8,
          borderWidth: 2,
          tension: 0.2,
          fill: true
        },
        ...(showBatteryLevel
          ? [
              {
                label: "Battery Level (%)",
                data: batteryPoints,
                yAxisID: "y1",
                borderColor: palette.primary,
                backgroundColor: "transparent",
                borderDash: [6, 4],
                pointRadius: 0,
                borderWidth: 2,
                tension: 0.2
              }
            ]
          : []),
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
    [
      deploymentPoints,
      harvestPoints,
      showBatteryLevel,
      batteryPoints,
      showCursor,
      cursorPoint,
      annotationDatasets,
      palette
    ]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "ERS Power (%)", { min: 0, max: 100 });

    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          min: 0,
          max: 100
        },
        y1: {
          type: "linear" as const,
          position: "right" as const,
          min: 0,
          max: 100,
          title: {
            display: true,
            text: "Battery (%)",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText
          },
          grid: {
            drawOnChartArea: false
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

        onCursorTimeChange(processed.time[elements[0].index] ?? null);
      }
    };
  }, [palette, onCursorTimeChange, processed.time]);

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
      defaultAriaLabel="Telemetry ERS energy chart"
    >
      <ClientChart
        type="line"
        data={chartData}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "ERS deployment, harvest, and battery chart"}
      />
    </TelemetryCard>
  );
};
