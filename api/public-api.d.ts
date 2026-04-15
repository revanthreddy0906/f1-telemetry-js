import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { ChartDataset } from 'chart.js';

type ThemeMode = "light" | "dark" | "high-contrast";
type DownsampleStrategy = "every-nth" | "min-max";
type LapComparisonMode = "overlay" | "delta";
type TelemetryAnnotationType = "corner" | "drs" | "incident";
type TelemetrySeverity = "low" | "medium" | "high";
interface TelemetryStyleTokens {
    background: string;
    border: string;
    text: string;
    mutedText: string;
    grid: string;
    primary: string;
    primarySoft: string;
    accent: string;
    danger: string;
    shadow: string;
    focusRing: string;
}
interface TelemetryWindow {
    startTime?: number;
    endTime?: number;
}
interface DataProcessingOptions {
    maxPoints?: number;
    downsampleStrategy?: DownsampleStrategy;
    window?: TelemetryWindow;
}
interface CursorSyncProps {
    showCursor?: boolean;
    cursorTime?: number | null;
    onCursorTimeChange?: (value: number | null) => void;
}
interface TelemetryAnnotation {
    id?: string;
    type: TelemetryAnnotationType;
    time?: number;
    x?: number;
    y?: number;
    label?: string;
    description?: string;
    severity?: TelemetrySeverity;
    color?: string;
}
interface AnnotationProps {
    annotations?: TelemetryAnnotation[];
    showAnnotations?: boolean;
}
interface ChartContainerProps extends AnnotationProps {
    theme?: ThemeMode;
    height?: number;
    className?: string;
    title?: string;
    ariaLabel?: string;
    processing?: DataProcessingOptions;
    styleTokens?: Partial<TelemetryStyleTokens>;
}
interface SpeedTelemetryData {
    time: number[];
    speed: number[];
}
interface SpeedChartProps extends ChartContainerProps, CursorSyncProps {
    time?: number[];
    speed?: number[];
    data?: SpeedTelemetryData;
}
interface ThrottleBrakeChartProps extends ChartContainerProps, CursorSyncProps {
    time: number[];
    throttle: number[];
    brake: number[];
}
interface DriverLapTelemetry {
    time: number[];
    speed: number[];
    label?: string;
    color?: string;
}
interface LapComparisonChartProps extends ChartContainerProps, CursorSyncProps {
    driver1: DriverLapTelemetry;
    driver2: DriverLapTelemetry;
    driver1Label?: string;
    driver2Label?: string;
    mode?: LapComparisonMode;
    sectorMarkers?: number[];
    deltaLabel?: string;
}
interface TrackMapProps extends ChartContainerProps, CursorSyncProps {
    x: number[];
    y: number[];
    time?: number[];
}
interface FormattedTelemetry {
    time: number[];
    speed: number[];
    throttle: number[];
    brake: number[];
    x: number[];
    y: number[];
}
type RawTelemetryPoint = Record<string, unknown>;
type RawTelemetryInput = RawTelemetryPoint[] | Record<string, unknown>;
interface TelemetryPanelRenderContext {
    telemetry: FormattedTelemetry;
    comparison?: DriverLapTelemetry;
    lapMode: LapComparisonMode;
    sectorMarkers?: number[];
    annotations?: TelemetryAnnotation[];
    theme: ThemeMode;
    styleTokens?: Partial<TelemetryStyleTokens>;
    processing?: DataProcessingOptions;
    cursorTime: number | null;
    setCursorTime: (value: number | null) => void;
}
interface TelemetryPanelExtension {
    id: string;
    order?: number;
    render: (context: TelemetryPanelRenderContext) => ReactNode;
}
interface TelemetryDashboardProps {
    telemetry: FormattedTelemetry;
    comparison?: DriverLapTelemetry;
    lapMode?: LapComparisonMode;
    sectorMarkers?: number[];
    annotations?: TelemetryAnnotation[];
    theme?: ThemeMode;
    styleTokens?: Partial<TelemetryStyleTokens>;
    processing?: DataProcessingOptions;
    syncCursor?: boolean;
    className?: string;
    chartHeight?: number;
    trackMapHeight?: number;
    panelGap?: number;
    minPanelWidth?: number;
    includeDefaultPanels?: boolean;
    extensions?: TelemetryPanelExtension[];
}
interface TelemetryValidationIssue {
    code: "INVALID_SERIES" | "INVALID_VALUE" | "LENGTH_MISMATCH" | "EMPTY_SERIES";
    message: string;
}
interface TelemetryValidationResult {
    isValid: boolean;
    issues: TelemetryValidationIssue[];
}

declare const SpeedChart: (props: SpeedChartProps) => react_jsx_runtime.JSX.Element;

declare const ThrottleBrakeChart: ({ time, throttle, brake, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: ThrottleBrakeChartProps) => react_jsx_runtime.JSX.Element;

declare const LapComparisonChart: ({ driver1, driver2, driver1Label, driver2Label, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, mode, sectorMarkers, deltaLabel, annotations, showAnnotations }: LapComparisonChartProps) => react_jsx_runtime.JSX.Element;

declare const TrackMap: ({ x, y, time, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: TrackMapProps) => react_jsx_runtime.JSX.Element;

declare const TelemetryDashboard: ({ telemetry, comparison, lapMode, sectorMarkers, annotations, theme, styleTokens, processing, syncCursor, className, chartHeight, trackMapHeight, panelGap, minPanelWidth, includeDefaultPanels, extensions }: TelemetryDashboardProps) => react_jsx_runtime.JSX.Element;

declare const formatTelemetry: (data: RawTelemetryInput) => FormattedTelemetry;

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
declare const processSeriesData: <T extends SeriesMap>({ context, time, seriesMap, processing }: ProcessSeriesInput) => ProcessSeriesOutput<T>;
declare const findNearestIndex: (values: number[], target: number | null | undefined) => number;

declare const validateTelemetry: (telemetry: Partial<FormattedTelemetry>, context?: string) => TelemetryValidationResult;

declare const telemetryCssVariables: Record<keyof TelemetryStyleTokens, string>;
declare const createTelemetryCssVariables: (tokens: Partial<TelemetryStyleTokens>) => Record<string, string>;

declare const createLineAnnotationDatasets: (annotations: TelemetryAnnotation[] | undefined, time: number[], valueSeries: number[], palette: TelemetryStyleTokens) => ChartDataset<"line", {
    x: number;
    y: number;
}[]>[];
declare const createTrackAnnotationDataset: (annotations: TelemetryAnnotation[] | undefined, trackPoints: Array<{
    x: number;
    y: number;
}>, time: number[], palette: TelemetryStyleTokens) => ChartDataset<"scatter", {
    x: number;
    y: number;
}[]>[];

declare const registerTelemetryPanel: (extension: TelemetryPanelExtension) => void;
declare const unregisterTelemetryPanel: (id: string) => void;
declare const clearTelemetryPanels: () => void;
declare const getTelemetryPanels: () => TelemetryPanelExtension[];

type FastF1TelemetryPoint = {
    [key: string]: unknown;
    Time?: unknown;
    SessionTime?: unknown;
    timestamp?: unknown;
    speed?: unknown;
    Speed?: unknown;
    throttle?: unknown;
    Throttle?: unknown;
    brake?: unknown;
    Brake?: unknown;
    x?: unknown;
    X?: unknown;
    y?: unknown;
    Y?: unknown;
};
type FastF1TelemetryInput = FastF1TelemetryPoint[] | Record<string, unknown>;
declare const fromFastF1Telemetry: (input: FastF1TelemetryInput) => FormattedTelemetry;

interface OpenF1TelemetryPoint {
    [key: string]: unknown;
    date?: string;
    session_time?: number | string;
    speed?: number | string;
    throttle?: number | string;
    brake?: number | string;
    x?: number | string;
    y?: number | string;
}
declare const fromOpenF1Telemetry: (input: OpenF1TelemetryPoint[]) => FormattedTelemetry;

interface CsvTelemetryOptions {
    delimiter?: "," | ";" | "\t";
    hasHeader?: boolean;
}
declare const fromCsvTelemetry: (csv: string, options?: CsvTelemetryOptions) => FormattedTelemetry;

export { type AnnotationProps, type ChartContainerProps, type CsvTelemetryOptions, type CursorSyncProps, type DataProcessingOptions, type DownsampleStrategy, type DriverLapTelemetry, type FastF1TelemetryInput, type FastF1TelemetryPoint, type FormattedTelemetry, LapComparisonChart, type LapComparisonChartProps, type LapComparisonMode, type OpenF1TelemetryPoint, type RawTelemetryInput, type RawTelemetryPoint, SpeedChart, type SpeedChartProps, type TelemetryAnnotation, type TelemetryAnnotationType, TelemetryDashboard, type TelemetryDashboardProps, type TelemetryPanelExtension, type TelemetryPanelRenderContext, type TelemetrySeverity, type TelemetryStyleTokens, type TelemetryValidationIssue, type TelemetryValidationResult, type TelemetryWindow, type ThemeMode, ThrottleBrakeChart, type ThrottleBrakeChartProps, TrackMap, type TrackMapProps, clearTelemetryPanels, createLineAnnotationDatasets, createTelemetryCssVariables, createTrackAnnotationDataset, findNearestIndex, formatTelemetry, fromCsvTelemetry, fromFastF1Telemetry, fromOpenF1Telemetry, getTelemetryPanels, processSeriesData, registerTelemetryPanel, telemetryCssVariables, unregisterTelemetryPanel, validateTelemetry };
