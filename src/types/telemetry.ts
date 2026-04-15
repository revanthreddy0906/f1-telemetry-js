import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "high-contrast";
export type DownsampleStrategy = "every-nth" | "min-max";
export type LapComparisonMode = "overlay" | "delta";
export type TelemetryAnnotationType = "corner" | "drs" | "incident";
export type TelemetrySeverity = "low" | "medium" | "high";

export interface TelemetryStyleTokens {
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

export interface TelemetryWindow {
  startTime?: number;
  endTime?: number;
}

export interface DataProcessingOptions {
  maxPoints?: number;
  downsampleStrategy?: DownsampleStrategy;
  window?: TelemetryWindow;
}

export interface CursorSyncProps {
  showCursor?: boolean;
  cursorTime?: number | null;
  onCursorTimeChange?: (value: number | null) => void;
}

export interface TelemetryAnnotation {
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

export interface AnnotationProps {
  annotations?: TelemetryAnnotation[];
  showAnnotations?: boolean;
}

export interface ChartContainerProps extends AnnotationProps {
  theme?: ThemeMode;
  height?: number;
  className?: string;
  title?: string;
  ariaLabel?: string;
  processing?: DataProcessingOptions;
  styleTokens?: Partial<TelemetryStyleTokens>;
}

export interface SpeedTelemetryData {
  time: number[];
  speed: number[];
}

export interface SpeedChartProps extends ChartContainerProps, CursorSyncProps {
  time?: number[];
  speed?: number[];
  data?: SpeedTelemetryData;
}

export interface ThrottleBrakeChartProps extends ChartContainerProps, CursorSyncProps {
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

export interface LapComparisonChartProps extends ChartContainerProps, CursorSyncProps {
  driver1: DriverLapTelemetry;
  driver2: DriverLapTelemetry;
  driver1Label?: string;
  driver2Label?: string;
  mode?: LapComparisonMode;
  sectorMarkers?: number[];
  deltaLabel?: string;
}

export interface TrackMapProps extends ChartContainerProps, CursorSyncProps {
  x: number[];
  y: number[];
  time?: number[];
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

export interface TelemetryPanelRenderContext {
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

export interface TelemetryPanelExtension {
  id: string;
  order?: number;
  render: (context: TelemetryPanelRenderContext) => ReactNode;
}

export interface TelemetryDashboardProps {
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

export interface TelemetryValidationIssue {
  code: "INVALID_SERIES" | "INVALID_VALUE" | "LENGTH_MISMATCH" | "EMPTY_SERIES";
  message: string;
}

export interface TelemetryValidationResult {
  isValid: boolean;
  issues: TelemetryValidationIssue[];
}
