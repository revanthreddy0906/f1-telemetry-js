// ── Components ──
export { SpeedChart } from "./components/SpeedChart";
export { ThrottleBrakeChart } from "./components/ThrottleBrakeChart";
export { LapComparisonChart } from "./components/LapComparisonChart";
export { TrackMap } from "./components/TrackMap";
export { TelemetryDashboard } from "./components/TelemetryDashboard";
export { GearChart } from "./components/GearChart";
export { EnergyChart } from "./components/EnergyChart";
export { TyreStrategyTimeline } from "./components/TyreStrategyTimeline";
export { GapChart } from "./components/GapChart";
export { PositionChart } from "./components/PositionChart";
export { MiniSectors } from "./components/MiniSectors";
export { SpeedHeatmapTrackMap } from "./components/SpeedHeatmapTrackMap";
export { RadarChart } from "./components/RadarChart";
export { PitStopTimeline } from "./components/PitStopTimeline";
export { WeatherWidget } from "./components/WeatherWidget";
export { TelemetryPlayground } from "./components/TelemetryPlayground";

// ── Hooks ──
export { useTelemetry } from "./hooks/useTelemetry";
export type { UseTelemetryOptions, UseTelemetryResult } from "./hooks/useTelemetry";
export { useCursorSync } from "./hooks/useCursorSync";
export type { UseCursorSyncResult } from "./hooks/useCursorSync";
export { TelemetryProvider, useTelemetryContext } from "./hooks/TelemetryProvider";
export type { TelemetryContextValue, TelemetryProviderProps } from "./hooks/TelemetryProvider";
export { useAutoTheme } from "./hooks/useAutoTheme";
export { useChartExport } from "./hooks/useChartExport";
export type { ChartExportOptions, ExportFormat, UseChartExportResult } from "./hooks/useChartExport";

/**
 * Parse raw telemetry payloads into normalized `FormattedTelemetry` arrays.
 */
export { formatTelemetry } from "./utils/formatTelemetry";

/**
 * Validate telemetry arrays for missing channels, invalid values, and length mismatches.
 */
export { validateTelemetry } from "./utils/validation";

/**
 * Apply windowing/downsampling to telemetry series while keeping channels aligned.
 */
export { processSeriesData, findNearestIndex } from "./utils/processing";
export { processSeriesDataInWorker } from "./utils/workerProcessing";

export {
  normalizeDistance,
  computeLapTimes,
  computeSectorTimes,
  computeSpeedDelta,
  interpolateTelemetry,
  computeTimeDelta,
  detectOvertakes,
  classifyTyreCompound
} from "./utils/computations";

export { mergeTelemetry, exportToJson, exportToCsv } from "./utils/exporters";
export { createTelemetryCssVariables, telemetryCssVariables } from "./components/chartTheme";

/**
 * Build Chart.js datasets for rendering line-chart annotation markers.
 */
export { createLineAnnotationDatasets } from "./utils/annotations";

/**
 * Build Chart.js datasets for rendering track-map annotation markers.
 */
export { createTrackAnnotationDataset, createTrackAnnotationDatasets } from "./utils/annotations";

/**
 * Register a custom dashboard extension panel.
 */
export { registerTelemetryPanel } from "./extensions/registry";

/**
 * Remove a previously registered dashboard extension panel.
 */
export { unregisterTelemetryPanel } from "./extensions/registry";

/**
 * Clear all registered dashboard extension panels.
 */
export { clearTelemetryPanels } from "./extensions/registry";

/**
 * Return all registered dashboard extension panels in render order.
 */
export { getTelemetryPanels } from "./extensions/registry";

// ── Pre-built extension panels ──
export { telemetryStatsPanel } from "./extensions/panels/statsPanel";
export { gearDistributionPanel } from "./extensions/panels/gearDistributionPanel";
export { lapSummaryPanel } from "./extensions/panels/lapSummaryPanel";

export * from "./adapters";
export * from "./constants";

export type {
  ThemeMode,
  DownsampleStrategy,
  TelemetryChartType,
  LapComparisonMode,
  TelemetryAnnotationType,
  TelemetrySeverity,
  ValidationMode,
  IssueSeverity,
  TelemetryExtraChannel,
  TelemetrySeriesKey,
  AdaptiveDownsampleOptions,
  ChartContainerProps,
  DataProcessingOptions,
  TelemetryWindow,
  TelemetryStyleTokens,
  CursorSyncProps,
  TelemetryAnnotation,
  AnnotationProps,
  SpeedChartProps,
  ThrottleBrakeChartProps,
  DriverLapTelemetry,
  LapComparisonChartProps,
  TrackMapProps,
  GearChartProps,
  EnergyChartProps,
  TyreCompound,
  TyreStint,
  DriverStrategy,
  TyreStrategyTimelineProps,
  GapDataPoint,
  DriverGapData,
  GapChartProps,
  DriverPositionData,
  PositionChartProps,
  SectorTime,
  DriverSectorData,
  SectorComparison,
  MiniSectorsProps,
  SpeedHeatmapTrackMapProps,
  DriverMetrics,
  RadarChartProps,
  PitStop,
  DriverPitStops,
  PitStopTimelineProps,
  WeatherDataPoint,
  WeatherMetric,
  WeatherWidgetProps,
  LapTime,
  SectorSplit,
  LapSectors,
  DeltaPoint,
  TimeDeltaPoint,
  DistanceBasedTelemetry,
  DriverPositionHistory,
  OvertakeEvent,
  TyreClassification,
  JsonExportFormat,
  CsvExportOptions,
  TelemetryEvent,
  TelemetryPanelRenderContext,
  TelemetryPanelExtension,
  TelemetryDashboardProps,
  FormattedTelemetry,
  RawTelemetryPoint,
  RawTelemetryInput,
  TelemetryValidationIssue,
  TelemetryValidationOptions,
  TelemetryValidationDiagnostics,
  TelemetryValidationResult,
  AdapterName,
  AdapterParseOptions,
  TelemetryAdapterDiagnostic,
  TelemetryAdapterDiagnostics,
  TelemetryAdapterResult
} from "./types/telemetry";

export type { TelemetryPlaygroundProps } from "./components/TelemetryPlayground";
