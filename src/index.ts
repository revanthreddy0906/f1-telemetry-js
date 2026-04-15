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

export { formatTelemetry } from "./utils/formatTelemetry";
export { processSeriesData, findNearestIndex } from "./utils/processing";
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
export { validateTelemetry } from "./utils/validation";
export { createTelemetryCssVariables, telemetryCssVariables } from "./components/chartTheme";
export {
  createLineAnnotationDatasets,
  createTrackAnnotationDataset,
  createTrackAnnotationDatasets
} from "./utils/annotations";
export { registerTelemetryPanel, unregisterTelemetryPanel, clearTelemetryPanels, getTelemetryPanels } from "./extensions/registry";
export * from "./adapters";

export type {
  ThemeMode,
  DownsampleStrategy,
  LapComparisonMode,
  TelemetryAnnotationType,
  TelemetrySeverity,
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
  TelemetryPanelRenderContext,
  TelemetryPanelExtension,
  TelemetryDashboardProps,
  FormattedTelemetry,
  RawTelemetryPoint,
  RawTelemetryInput,
  TelemetryValidationIssue,
  TelemetryValidationResult
} from "./types/telemetry";
