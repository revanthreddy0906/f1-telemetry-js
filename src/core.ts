// ── Adapters ──
export * from "./adapters";

// ── Utilities ──
export { formatTelemetry } from "./utils/formatTelemetry";
export { validateTelemetry, sanitizeNumericArray, alignSeriesLengths } from "./utils/validation";
export { processSeriesData, findNearestIndex } from "./utils/processing";
export { processSeriesDataInWorker } from "./utils/workerProcessing";
export { normalizeTelemetryTime } from "./utils/timeSemantics";
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

// ── Constants ──
export * from "./constants";

// ── Types ──
export type {
  ThemeMode,
  DownsampleStrategy,
  TelemetryChartType,
  TelemetryTimeReference,
  LapComparisonMode,
  TelemetryAnnotationType,
  TelemetrySeverity,
  ValidationMode,
  IssueSeverity,
  TelemetryExtraChannel,
  TelemetrySeriesKey,
  AdaptiveDownsampleOptions,
  DataProcessingOptions,
  TelemetryWindow,
  TelemetryStyleTokens,
  TelemetryAnnotation,
  DriverLapTelemetry,
  TyreCompound,
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
  TelemetrySharedChannelApi,
  TelemetryPanelContextMenuAction,
  TelemetryPanelRenderContext,
  TelemetryPanelExtension,
  TelemetryDashboardLayoutItem,
  TelemetryDashboardLayout,
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
