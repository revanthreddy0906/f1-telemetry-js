import { ReactNode } from 'react';

type ThemeMode = "light" | "dark" | "high-contrast";
type DownsampleStrategy = "every-nth" | "min-max" | "adaptive";
type TelemetryChartType = "line" | "track" | "scatter" | "bar";
type LapComparisonMode = "overlay" | "delta";
type TelemetryAnnotationType = "corner" | "drs" | "incident";
type TelemetrySeverity = "low" | "medium" | "high";
type ValidationMode = "strict" | "lenient";
type IssueSeverity = "error" | "warning";
type TelemetryExtraChannel = "gear" | "ersDeployment" | "ersHarvest" | "batteryLevel" | "airTemp" | "trackTemp" | "humidity" | "windSpeed" | "rainfall" | "pressure";
type TelemetrySeriesKey = "time" | "speed" | "throttle" | "brake" | "x" | "y";
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
interface AdaptiveDownsampleOptions {
    viewportWidth?: number;
    chartType?: TelemetryChartType;
}
interface DataProcessingOptions {
    maxPoints?: number;
    downsampleStrategy?: DownsampleStrategy;
    window?: TelemetryWindow;
    adaptive?: AdaptiveDownsampleOptions;
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
interface GearChartProps extends ChartContainerProps, CursorSyncProps {
    time: number[];
    gear: number[];
    showGearBands?: boolean;
}
interface EnergyChartProps extends ChartContainerProps, CursorSyncProps {
    time: number[];
    ersDeployment: number[];
    ersHarvest: number[];
    batteryLevel?: number[];
    showBatteryLevel?: boolean;
}
type TyreCompound = "soft" | "medium" | "hard" | "intermediate" | "wet";
interface TyreStint {
    compound: TyreCompound;
    startLap: number;
    endLap: number;
    label?: string;
}
interface DriverStrategy {
    driver: string;
    color?: string;
    stints: TyreStint[];
}
interface TyreStrategyTimelineProps {
    strategies: DriverStrategy[];
    totalLaps: number;
    theme?: ThemeMode;
    className?: string;
    styleTokens?: Partial<TelemetryStyleTokens>;
    height?: number;
    showLapNumbers?: boolean;
    title?: string;
    ariaLabel?: string;
}
interface GapDataPoint {
    lap: number;
    gap: number;
}
interface DriverGapData {
    driver: string;
    color?: string;
    data: GapDataPoint[];
}
interface GapChartProps extends ChartContainerProps, CursorSyncProps {
    drivers: DriverGapData[];
    referenceDriver?: string;
    invertAxis?: boolean;
    showDriverLabels?: boolean;
}
interface DriverPositionData {
    driver: string;
    color?: string;
    positions: number[];
}
interface PositionChartProps extends ChartContainerProps, CursorSyncProps {
    drivers: DriverPositionData[];
    totalLaps: number;
    highlightDrivers?: string[];
    showDriverLabels?: boolean;
}
interface SectorTime {
    sector: number;
    time: number;
}
interface DriverSectorData {
    driver: string;
    color?: string;
    sectors: SectorTime[];
}
type SectorComparison = "personal-best" | "overall-best" | "previous-lap";
interface MiniSectorsProps {
    drivers: DriverSectorData[];
    comparisonMode?: SectorComparison;
    theme?: ThemeMode;
    className?: string;
    styleTokens?: Partial<TelemetryStyleTokens>;
    title?: string;
    ariaLabel?: string;
}
interface SpeedHeatmapTrackMapProps extends ChartContainerProps, CursorSyncProps {
    x: number[];
    y: number[];
    speed: number[];
    time?: number[];
    colorScale?: {
        min?: string;
        mid?: string;
        max?: string;
    };
    segmentSize?: number;
}
interface DriverMetrics {
    driver: string;
    color?: string;
    metrics: Record<string, number>;
}
interface RadarChartProps {
    drivers: DriverMetrics[];
    metricLabels?: Record<string, string>;
    theme?: ThemeMode;
    height?: number;
    className?: string;
    styleTokens?: Partial<TelemetryStyleTokens>;
    ariaLabel?: string;
    fillOpacity?: number;
    title?: string;
}
interface PitStop {
    lap: number;
    duration: number;
    tyreCompoundIn?: TyreCompound;
    tyreCompoundOut?: TyreCompound;
}
interface DriverPitStops {
    driver: string;
    color?: string;
    stops: PitStop[];
}
interface PitStopTimelineProps {
    drivers: DriverPitStops[];
    totalLaps: number;
    theme?: ThemeMode;
    className?: string;
    styleTokens?: Partial<TelemetryStyleTokens>;
    showDurations?: boolean;
    highlightSlow?: number;
    title?: string;
    ariaLabel?: string;
}
interface WeatherDataPoint {
    time: number;
    airTemp?: number;
    trackTemp?: number;
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
    rainfall?: number;
    pressure?: number;
}
type WeatherMetric = "airTemp" | "trackTemp" | "humidity" | "windSpeed" | "rainfall";
interface WeatherWidgetProps extends ChartContainerProps, CursorSyncProps {
    data: WeatherDataPoint[];
    showMetrics?: WeatherMetric[];
    compactMode?: boolean;
}
interface LapTime {
    lap: number;
    startTime: number;
    endTime: number;
    duration: number;
}
interface SectorSplit {
    sector: number;
    duration: number;
}
interface LapSectors {
    lap: number;
    sectors: SectorSplit[];
    total: number;
}
interface DeltaPoint {
    time: number;
    delta: number;
}
interface TimeDeltaPoint {
    distance: number;
    timeDelta: number;
}
type DistanceBasedTelemetry = FormattedTelemetry;
interface DriverPositionHistory {
    driver: string;
    positions: number[];
}
interface OvertakeEvent {
    lap: number;
    overtaker: string;
    overtaken: string;
    newPosition: number;
}
interface TyreClassification {
    compound: TyreCompound;
    confidence: number;
    degradationRate: number;
    avgLapTime: number;
}
type JsonExportFormat = "rows" | "columns";
interface CsvExportOptions {
    delimiter?: "," | ";" | "\t";
    includeHeader?: boolean;
    precision?: number;
    channels?: TelemetrySeriesKey[];
}
interface TelemetryEvent {
    time: number;
    type: string;
    value?: number | string | boolean | null;
    description?: string;
    metadata?: Record<string, unknown>;
}
interface FormattedTelemetry {
    time: number[];
    speed: number[];
    throttle: number[];
    brake: number[];
    x: number[];
    y: number[];
    channels?: Partial<Record<TelemetryExtraChannel, number[]>>;
    events?: TelemetryEvent[];
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
    code: "INVALID_SERIES" | "INVALID_VALUE" | "LENGTH_MISMATCH" | "EMPTY_SERIES" | "SPARSE_SERIES";
    message: string;
    severity: IssueSeverity;
    channel?: TelemetrySeriesKey | TelemetryExtraChannel;
    index?: number;
    expectedLength?: number;
    actualLength?: number;
}
interface TelemetryValidationOptions {
    mode?: ValidationMode;
    allowEmptySeries?: boolean;
}
interface TelemetryValidationDiagnostics {
    context: string;
    mode: ValidationMode;
    totalIssues: number;
    errorCount: number;
    warningCount: number;
    lengths: Partial<Record<TelemetrySeriesKey, number>>;
}
interface TelemetryValidationResult {
    isValid: boolean;
    issues: TelemetryValidationIssue[];
    mode: ValidationMode;
    diagnostics: TelemetryValidationDiagnostics;
}
type AdapterName = "csv" | "fastf1" | "openf1" | "ergast" | "multiviewer" | "json" | "parquet" | "openf1-fetch";
interface AdapterParseOptions {
    validationMode?: ValidationMode;
}
interface TelemetryAdapterDiagnostic {
    code: string;
    severity: IssueSeverity;
    message: string;
    field?: string;
}
interface TelemetryAdapterDiagnostics {
    adapter: AdapterName;
    sourceSamples: number;
    parsedSamples: number;
    mode: ValidationMode;
    errorCount: number;
    warningCount: number;
    diagnostics: TelemetryAdapterDiagnostic[];
}
interface TelemetryAdapterResult {
    telemetry: FormattedTelemetry;
    validation: TelemetryValidationResult;
    diagnostics: TelemetryAdapterDiagnostics;
}

export type { SectorTime as $, AdapterName as A, DriverStrategy as B, ChartContainerProps as C, DataProcessingOptions as D, EnergyChartProps as E, FormattedTelemetry as F, GearChartProps as G, GapDataPoint as H, IssueSeverity as I, JsonExportFormat as J, LapComparisonMode as K, LapComparisonChartProps as L, MiniSectorsProps as M, LapSectors as N, LapTime as O, PositionChartProps as P, OvertakeEvent as Q, RadarChartProps as R, SpeedChartProps as S, ThrottleBrakeChartProps as T, PitStop as U, ValidationMode as V, WeatherWidgetProps as W, RawTelemetryInput as X, RawTelemetryPoint as Y, SectorComparison as Z, SectorSplit as _, TrackMapProps as a, TelemetryAdapterDiagnostic as a0, TelemetryAdapterDiagnostics as a1, TelemetryAdapterResult as a2, TelemetryAnnotationType as a3, TelemetryChartType as a4, TelemetryEvent as a5, TelemetryExtraChannel as a6, TelemetryPanelRenderContext as a7, TelemetrySeriesKey as a8, TelemetrySeverity as a9, TelemetryValidationDiagnostics as aa, TelemetryValidationIssue as ab, TelemetryValidationOptions as ac, TelemetryWindow as ad, TimeDeltaPoint as ae, TyreClassification as af, TyreCompound as ag, TyreStint as ah, WeatherDataPoint as ai, WeatherMetric as aj, TelemetryDashboardProps as b, TyreStrategyTimelineProps as c, GapChartProps as d, SpeedHeatmapTrackMapProps as e, PitStopTimelineProps as f, ThemeMode as g, TelemetryStyleTokens as h, TelemetryValidationResult as i, TelemetryAnnotation as j, TelemetryPanelExtension as k, AdapterParseOptions as l, AdaptiveDownsampleOptions as m, AnnotationProps as n, CsvExportOptions as o, CursorSyncProps as p, DeltaPoint as q, DistanceBasedTelemetry as r, DownsampleStrategy as s, DriverGapData as t, DriverLapTelemetry as u, DriverMetrics as v, DriverPitStops as w, DriverPositionData as x, DriverPositionHistory as y, DriverSectorData as z };
