// ── Adapters ──
export * from "./adapters";

// ── Utilities ──
export { formatTelemetry } from "./utils/formatTelemetry";
export { validateTelemetry, sanitizeNumericArray, alignSeriesLengths } from "./utils/validation";
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

// ── Constants ──
export * from "./constants";

// ── Types ──
export type {
  ThemeMode,
  DownsampleStrategy,
  LapComparisonMode,
  TelemetryAnnotationType,
  TelemetrySeverity,
  ValidationMode,
  IssueSeverity,
  TelemetryExtraChannel,
  TelemetrySeriesKey,
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
