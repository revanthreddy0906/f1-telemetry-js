import * as react_jsx_runtime from 'react/jsx-runtime';

type ThemeMode = "light" | "dark";
interface ChartContainerProps {
    theme?: ThemeMode;
    height?: number;
    className?: string;
    title?: string;
}
interface SpeedTelemetryData {
    time: number[];
    speed: number[];
}
interface SpeedChartProps extends ChartContainerProps {
    time?: number[];
    speed?: number[];
    data?: SpeedTelemetryData;
}
interface ThrottleBrakeChartProps extends ChartContainerProps {
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
interface LapComparisonChartProps extends ChartContainerProps {
    driver1: DriverLapTelemetry;
    driver2: DriverLapTelemetry;
    driver1Label?: string;
    driver2Label?: string;
}
interface TrackMapProps extends ChartContainerProps {
    x: number[];
    y: number[];
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

declare const SpeedChart: (props: SpeedChartProps) => react_jsx_runtime.JSX.Element;

declare const ThrottleBrakeChart: ({ time, throttle, brake, theme, height, className, title }: ThrottleBrakeChartProps) => react_jsx_runtime.JSX.Element;

declare const LapComparisonChart: ({ driver1, driver2, driver1Label, driver2Label, theme, height, className, title }: LapComparisonChartProps) => react_jsx_runtime.JSX.Element;

declare const TrackMap: ({ x, y, theme, height, className, title }: TrackMapProps) => react_jsx_runtime.JSX.Element;

declare const formatTelemetry: (data: RawTelemetryInput) => FormattedTelemetry;

export { type ChartContainerProps, type DriverLapTelemetry, type FormattedTelemetry, LapComparisonChart, type LapComparisonChartProps, type RawTelemetryInput, type RawTelemetryPoint, SpeedChart, type SpeedChartProps, type ThemeMode, ThrottleBrakeChart, type ThrottleBrakeChartProps, TrackMap, type TrackMapProps, formatTelemetry };
