export { processSeriesData, findNearestIndex } from "./utils/processing";
export { processSeriesDataInWorker } from "./utils/workerProcessing";
export type {
  ProcessSeriesInput,
  ProcessSeriesOutput
} from "./utils/processing";
export type { WorkerProcessingOptions } from "./utils/workerProcessing";
export type {
  DataProcessingOptions,
  DownsampleStrategy,
  TelemetryChartType,
  TelemetryWindow
} from "./types/telemetry";
