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
  FormattedTelemetry,
  RawTelemetryPoint,
  RawTelemetryInput,
  TelemetryValidationIssue,
  TelemetryValidationResult
} from "./types/telemetry";
