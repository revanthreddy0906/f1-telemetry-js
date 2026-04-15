import { useMemo } from "react";
import { createLineOptions, resolveThemeTokens } from "./chartTheme";
import type { WeatherMetric, WeatherWidgetProps } from "../types/telemetry";
import { findNearestIndex, processSeriesData } from "../utils/processing";
import { createAnnotationMarkersPlugin, createCursorLinePlugin } from "../utils/plugins";
import { createLineAnnotationDatasets } from "../utils/annotations";
import { TelemetryCard } from "./TelemetryCard";
import { ClientChart } from "./ClientChart";
import { ensureChartSetup } from "../utils/chartSetup";

ensureChartSetup();

const DEFAULT_METRICS: WeatherMetric[] = [
  "airTemp",
  "trackTemp",
  "humidity",
  "windSpeed",
  "rainfall"
];

const toCompass = (degrees: number | undefined): string => {
  if (degrees === undefined || !Number.isFinite(degrees)) {
    return "--";
  }
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
};

const rainfallStatus = (value: number): string => {
  if (value <= 0) {
    return "Dry";
  }
  if (value < 0.7) {
    return "Light Rain";
  }
  return "Heavy Rain";
};

export const WeatherWidget = ({
  data,
  showMetrics,
  compactMode = false,
  theme = "dark",
  height = 320,
  className,
  title = "Weather Conditions",
  ariaLabel,
  processing,
  styleTokens,
  showCursor = true,
  cursorTime,
  onCursorTimeChange,
  annotations,
  showAnnotations = true
}: WeatherWidgetProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const metrics = showMetrics ?? DEFAULT_METRICS;

  const processed = useMemo(
    () =>
      processSeriesData<{
        airTemp: number[];
        trackTemp: number[];
        humidity: number[];
        windSpeed: number[];
        rainfall: number[];
      }>({
        context: "WeatherWidget",
        time: data.map((point) => point.time),
        seriesMap: {
          airTemp: data.map((point) => point.airTemp ?? 0),
          trackTemp: data.map((point) => point.trackTemp ?? 0),
          humidity: data.map((point) => point.humidity ?? 0),
          windSpeed: data.map((point) => point.windSpeed ?? 0),
          rainfall: data.map((point) => point.rainfall ?? 0)
        },
        processing
      }),
    [data, processing]
  );

  const cursorIndex = findNearestIndex(processed.time, cursorTime);
  const cursorPoint =
    cursorIndex >= 0
      ? {
          x: processed.time[cursorIndex],
          y: processed.seriesMap.airTemp[cursorIndex]
        }
      : null;

  const activeIndex = cursorIndex >= 0 ? cursorIndex : processed.time.length - 1;
  const currentValues = {
    air: processed.seriesMap.airTemp[activeIndex] ?? 0,
    track: processed.seriesMap.trackTemp[activeIndex] ?? 0,
    humidity: processed.seriesMap.humidity[activeIndex] ?? 0,
    wind: processed.seriesMap.windSpeed[activeIndex] ?? 0,
    rainfall: processed.seriesMap.rainfall[activeIndex] ?? 0,
    windDirection: data[activeIndex]?.windDirection
  };

  if (compactMode) {
    return (
      <TelemetryCard
        theme={theme}
        height={height < 200 ? 200 : height}
        className={className}
        title={title}
        styleTokens={styleTokens}
        ariaLabel={ariaLabel}
        defaultAriaLabel="Weather compact widget"
      >
        <div
          style={{
            display: "grid",
            gap: 8,
            color: palette.text,
            fontSize: 14
          }}
        >
          <div>🌡 Air: {currentValues.air.toFixed(1)}°C / Track: {currentValues.track.toFixed(1)}°C</div>
          <div>💧 Humidity: {currentValues.humidity.toFixed(0)}%</div>
          <div>
            💨 Wind: {currentValues.wind.toFixed(1)} km/h {toCompass(currentValues.windDirection)}
          </div>
          <div>🌧 {rainfallStatus(currentValues.rainfall)}</div>
        </div>
      </TelemetryCard>
    );
  }

  const airPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.airTemp[index] }));
  const trackPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.trackTemp[index] }));
  const humidityPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.humidity[index] }));
  const windPoints = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.windSpeed[index] }));
  const rainfallBars = processed.time.map((time, index) => ({ x: time, y: processed.seriesMap.rainfall[index] }));

  const annotationDatasets = useMemo(
    () =>
      createLineAnnotationDatasets(
        showAnnotations ? annotations : undefined,
        processed.time,
        processed.seriesMap.airTemp,
        palette
      ),
    [showAnnotations, annotations, processed.time, processed.seriesMap.airTemp, palette]
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        ...(metrics.includes("airTemp")
          ? [
              {
                label: "Air Temp (°C)",
                data: airPoints,
                borderColor: palette.danger,
                backgroundColor: "rgba(255, 127, 159, 0.16)",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.2
              }
            ]
          : []),
        ...(metrics.includes("trackTemp")
          ? [
              {
                label: "Track Temp (°C)",
                data: trackPoints,
                borderColor: "#FF8A00",
                backgroundColor: "rgba(255, 138, 0, 0.16)",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.2
              }
            ]
          : []),
        ...(metrics.includes("humidity")
          ? [
              {
                label: "Humidity (%)",
                data: humidityPoints,
                yAxisID: "y1",
                borderColor: palette.primary,
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.2
              }
            ]
          : []),
        ...(metrics.includes("windSpeed")
          ? [
              {
                label: "Wind Speed (km/h)",
                data: windPoints,
                yAxisID: "y2",
                borderColor: palette.accent,
                backgroundColor: "transparent",
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.2
              }
            ]
          : []),
        ...(metrics.includes("rainfall")
          ? [
              {
                label: "Rainfall",
                data: rainfallBars,
                yAxisID: "y2",
                borderColor: "#3D9BE9",
                backgroundColor: "rgba(61, 155, 233, 0.25)",
                borderWidth: 4,
                pointRadius: 0,
                stepped: "before" as const,
                fill: true,
                tension: 0
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
      metrics,
      airPoints,
      trackPoints,
      humidityPoints,
      windPoints,
      rainfallBars,
      showCursor,
      cursorPoint,
      annotationDatasets,
      palette
    ]
  );

  const options = useMemo(() => {
    const base = createLineOptions(palette, "Temperature (°C)");
    return {
      ...base,
      scales: {
        ...base.scales,
        y: {
          ...base.scales?.y,
          title: {
            display: true,
            text: "Temperature (°C)",
            color: palette.mutedText
          }
        },
        y1: {
          type: "linear" as const,
          position: "right" as const,
          min: 0,
          max: 100,
          title: {
            display: true,
            text: "Humidity (%)",
            color: palette.mutedText
          },
          ticks: {
            color: palette.mutedText
          },
          grid: {
            drawOnChartArea: false
          }
        },
        y2: {
          type: "linear" as const,
          position: "right" as const,
          offset: true,
          min: 0,
          title: {
            display: true,
            text: "Wind / Rain",
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
      defaultAriaLabel="Weather conditions widget"
    >
      <ClientChart
        type="line"
        data={chartData}
        options={options}
        plugins={plugins}
        ariaLabel={ariaLabel ?? "Weather multi-metric chart"}
      />
    </TelemetryCard>
  );
};
