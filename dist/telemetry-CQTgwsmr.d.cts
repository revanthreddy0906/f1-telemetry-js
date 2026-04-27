import { ReactNode } from 'react';

type ThemeMode = "light" | "dark" | "high-contrast";
type DownsampleStrategy = "every-nth" | "min-max" | "adaptive";
type TelemetryChartType = "line" | "track" | "scatter" | "bar";
type TelemetryTimeReference = "session" | "lap";
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
    timeReference?: TelemetryTimeReference;
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
    timeReference?: TelemetryTimeReference;
}
type RawTelemetryPoint = Record<string, unknown>;
type RawTelemetryInput = RawTelemetryPoint[] | Record<string, unknown>;
interface TelemetryPanelRenderContext {
    panelId: string;
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
    shared: TelemetrySharedChannelApi;
}
interface TelemetrySharedChannelApi {
    publish: (channel: string, payload: unknown) => void;
    read: (channel: string) => unknown;
    subscribe: (channel: string, listener: (payload: unknown) => void) => () => void;
}
interface TelemetryPanelContextMenuAction {
    id: string;
    label: string;
    onSelect: (context: TelemetryPanelRenderContext) => void;
    isVisible?: (context: TelemetryPanelRenderContext) => boolean;
    isDisabled?: (context: TelemetryPanelRenderContext) => boolean;
}
interface TelemetryPanelExtension {
    id: string;
    title?: string;
    order?: number;
    channels?: string[];
    contextMenuActions?: TelemetryPanelContextMenuAction[];
    onMount?: (context: TelemetryPanelRenderContext) => void;
    onUnmount?: (context: TelemetryPanelRenderContext) => void;
    render: (context: TelemetryPanelRenderContext) => ReactNode;
}
interface TelemetryDashboardLayoutItem {
    id: string;
    order: number;
    width: 1 | 2 | 3;
    hidden?: boolean;
}
interface TelemetryDashboardLayout {
    items: TelemetryDashboardLayoutItem[];
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
    enableLayoutEditor?: boolean;
    persistLayout?: boolean;
    layoutStorageKey?: string;
    defaultLayout?: TelemetryDashboardLayout;
    onLayoutChange?: (layout: TelemetryDashboardLayout) => void;
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

export type { TelemetryExtraChannel as $, AdapterName as A, SectorTime as B, ChartContainerProps as C, DataProcessingOptions as D, EnergyChartProps as E, FormattedTelemetry as F, GapChartProps as G, SpeedChartProps as H, IssueSeverity as I, JsonExportFormat as J, SpeedHeatmapTrackMapProps as K, LapComparisonChartProps as L, MiniSectorsProps as M, TelemetryAdapterDiagnostics as N, OvertakeEvent as O, PitStop as P, TelemetryAdapterResult as Q, RadarChartProps as R, SectorComparison as S, TelemetryAdapterDiagnostic as T, TelemetryAnnotation as U, TelemetryAnnotationType as V, TelemetryChartType as W, TelemetryDashboardLayout as X, TelemetryDashboardLayoutItem as Y, TelemetryDashboardProps as Z, TelemetryEvent as _, AdapterParseOptions as a, TelemetryPanelContextMenuAction as a0, TelemetryPanelExtension as a1, TelemetryPanelRenderContext as a2, TelemetrySeriesKey as a3, TelemetrySeverity as a4, TelemetrySharedChannelApi as a5, TelemetryStyleTokens as a6, TelemetryTimeReference as a7, TelemetryValidationDiagnostics as a8, TelemetryValidationIssue as a9, TelemetryValidationOptions as aa, TelemetryValidationResult as ab, TelemetryWindow as ac, ThemeMode as ad, ThrottleBrakeChartProps as ae, TimeDeltaPoint as af, TrackMapProps as ag, TyreClassification as ah, TyreCompound as ai, TyreStint as aj, TyreStrategyTimelineProps as ak, ValidationMode as al, WeatherDataPoint as am, WeatherMetric as an, WeatherWidgetProps as ao, AdaptiveDownsampleOptions as b, AnnotationProps as c, CsvExportOptions as d, CursorSyncProps as e, DeltaPoint as f, DistanceBasedTelemetry as g, DownsampleStrategy as h, DriverGapData as i, DriverLapTelemetry as j, DriverMetrics as k, DriverPitStops as l, DriverPositionData as m, DriverPositionHistory as n, DriverSectorData as o, DriverStrategy as p, GapDataPoint as q, GearChartProps as r, LapComparisonMode as s, LapSectors as t, LapTime as u, PitStopTimelineProps as v, PositionChartProps as w, RawTelemetryInput as x, RawTelemetryPoint as y, SectorSplit as z };
