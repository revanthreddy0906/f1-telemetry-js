import * as react_jsx_runtime from 'react/jsx-runtime';

type ThemeMode = "light" | "dark";
type DownsampleStrategy = "every-nth" | "min-max";
type LapComparisonMode = "overlay" | "delta";
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
interface ChartContainerProps {
    theme?: ThemeMode;
    height?: number;
    className?: string;
    title?: string;
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
interface TelemetryDashboardProps {
    telemetry: FormattedTelemetry;
    comparison?: DriverLapTelemetry;
    lapMode?: LapComparisonMode;
    sectorMarkers?: number[];
    theme?: ThemeMode;
    styleTokens?: Partial<TelemetryStyleTokens>;
    processing?: DataProcessingOptions;
    syncCursor?: boolean;
    className?: string;
    chartHeight?: number;
    trackMapHeight?: number;
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

declare const ThrottleBrakeChart: ({ time, throttle, brake, theme, height, className, title, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange }: ThrottleBrakeChartProps) => react_jsx_runtime.JSX.Element;

declare const LapComparisonChart: ({ driver1, driver2, driver1Label, driver2Label, theme, height, className, title, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, mode, sectorMarkers, deltaLabel }: LapComparisonChartProps) => react_jsx_runtime.JSX.Element;

declare const TrackMap: ({ x, y, time, theme, height, className, title, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange }: TrackMapProps) => react_jsx_runtime.JSX.Element;

declare const TelemetryDashboard: ({ telemetry, comparison, lapMode, sectorMarkers, theme, styleTokens, processing, syncCursor, className, chartHeight, trackMapHeight }: TelemetryDashboardProps) => react_jsx_runtime.JSX.Element;

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

export { type ChartContainerProps, type CursorSyncProps, type DataProcessingOptions, type DownsampleStrategy, type DriverLapTelemetry, type FormattedTelemetry, LapComparisonChart, type LapComparisonChartProps, type LapComparisonMode, type RawTelemetryInput, type RawTelemetryPoint, SpeedChart, type SpeedChartProps, TelemetryDashboard, type TelemetryDashboardProps, type TelemetryStyleTokens, type TelemetryValidationIssue, type TelemetryValidationResult, type TelemetryWindow, type ThemeMode, ThrottleBrakeChart, type ThrottleBrakeChartProps, TrackMap, type TrackMapProps, createTelemetryCssVariables, findNearestIndex, formatTelemetry, processSeriesData, telemetryCssVariables, validateTelemetry };
