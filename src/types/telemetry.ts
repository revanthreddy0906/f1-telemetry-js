export type ThemeMode = "light" | "dark";

export interface ChartContainerProps {
  theme?: ThemeMode;
  height?: number;
  className?: string;
  title?: string;
}

export interface SpeedTelemetryData {
  time: number[];
  speed: number[];
}

export interface SpeedChartProps extends ChartContainerProps {
  time?: number[];
  speed?: number[];
  data?: SpeedTelemetryData;
}

export interface ThrottleBrakeChartProps extends ChartContainerProps {
  time: number[];
  throttle: number[];
  brake: number[];
}

export interface DriverLapTelemetry {
  time: number[];
  speed: number[];
  label?: string;
  color?: string;
}

export interface LapComparisonChartProps extends ChartContainerProps {
  driver1: DriverLapTelemetry;
  driver2: DriverLapTelemetry;
  driver1Label?: string;
  driver2Label?: string;
}

export interface TrackMapProps extends ChartContainerProps {
  x: number[];
  y: number[];
}

export interface FormattedTelemetry {
  time: number[];
  speed: number[];
  throttle: number[];
  brake: number[];
  x: number[];
  y: number[];
}

export type RawTelemetryPoint = Record<string, unknown>;
export type RawTelemetryInput = RawTelemetryPoint[] | Record<string, unknown>;
