import { D as DataProcessingOptions } from './telemetry-CQTgwsmr.js';
export { h as DownsampleStrategy, W as TelemetryChartType, ac as TelemetryWindow } from './telemetry-CQTgwsmr.js';
import 'react';

type SeriesMap = Record<string, number[]>;
interface ProcessSeriesInput {
    context: string;
    time: unknown;
    seriesMap: Record<string, unknown>;
    processing?: DataProcessingOptions;
}
interface ProcessSeriesOutput<T extends SeriesMap> {
    time: number[];
    seriesMap: T;
}
/**
 * Sanitize, align, window, and downsample telemetry series in one pass.
 */
declare const processSeriesData: <T extends SeriesMap>({ context, time, seriesMap, processing }: ProcessSeriesInput) => ProcessSeriesOutput<T>;
/**
 * Find the index of the value nearest to `target`.
 */
declare const findNearestIndex: (values: number[], target: number | null | undefined) => number;

type UnknownSeriesMap = Record<string, unknown>;
interface WorkerProcessingPayload {
    context: string;
    time: unknown;
    seriesMap: UnknownSeriesMap;
    processing?: DataProcessingOptions;
}
interface WorkerProcessingOptions {
    timeoutMs?: number;
}
/**
 * Process telemetry series in a Web Worker when available, with automatic
 * fallback to synchronous in-thread processing.
 */
declare const processSeriesDataInWorker: <T extends Record<string, number[]>>(payload: WorkerProcessingPayload, options?: WorkerProcessingOptions) => Promise<ProcessSeriesOutput<T>>;

export { DataProcessingOptions, type ProcessSeriesInput, type ProcessSeriesOutput, type WorkerProcessingOptions, findNearestIndex, processSeriesData, processSeriesDataInWorker };
