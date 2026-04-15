export { SpeedChart } from "./components/SpeedChart";
export { ThrottleBrakeChart } from "./components/ThrottleBrakeChart";
export { LapComparisonChart } from "./components/LapComparisonChart";
export { TrackMap } from "./components/TrackMap";
export { TelemetryDashboard } from "./components/TelemetryDashboard";

export { formatTelemetry } from "./utils/formatTelemetry";
export { processSeriesData, findNearestIndex } from "./utils/processing";
export { validateTelemetry } from "./utils/validation";
export { createTelemetryCssVariables, telemetryCssVariables } from "./components/chartTheme";
export { createLineAnnotationDatasets, createTrackAnnotationDataset } from "./utils/annotations";
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
  TelemetryPanelRenderContext,
  TelemetryPanelExtension,
  TelemetryDashboardProps,
  FormattedTelemetry,
  RawTelemetryPoint,
  RawTelemetryInput,
  TelemetryValidationIssue,
  TelemetryValidationResult
} from "./types/telemetry";
