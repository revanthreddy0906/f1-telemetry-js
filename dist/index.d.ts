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
    channels?: Array<keyof FormattedTelemetry>;
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

declare const GearChart: ({ time, gear, showGearBands, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: GearChartProps) => react_jsx_runtime.JSX.Element;

declare const EnergyChart: ({ time, ersDeployment, ersHarvest, batteryLevel, showBatteryLevel, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: EnergyChartProps) => react_jsx_runtime.JSX.Element;

declare const TyreStrategyTimeline: ({ strategies, totalLaps, theme, className, styleTokens, height, showLapNumbers, title, ariaLabel }: TyreStrategyTimelineProps) => react_jsx_runtime.JSX.Element;

declare const GapChart: ({ drivers, referenceDriver, invertAxis, showDriverLabels, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: GapChartProps) => react_jsx_runtime.JSX.Element;

declare const PositionChart: ({ drivers, totalLaps, highlightDrivers, showDriverLabels, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: PositionChartProps) => react_jsx_runtime.JSX.Element;

declare const MiniSectors: ({ drivers, comparisonMode, theme, className, styleTokens, title, ariaLabel }: MiniSectorsProps) => react_jsx_runtime.JSX.Element;

declare const SpeedHeatmapTrackMap: ({ x, y, speed, time, colorScale, segmentSize, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: SpeedHeatmapTrackMapProps) => react_jsx_runtime.JSX.Element;

declare const RadarChart: ({ drivers, metricLabels, theme, height, className, styleTokens, ariaLabel, fillOpacity, title }: RadarChartProps) => react_jsx_runtime.JSX.Element;

declare const PitStopTimeline: ({ drivers, totalLaps, theme, className, styleTokens, showDurations, highlightSlow, title, ariaLabel }: PitStopTimelineProps) => react_jsx_runtime.JSX.Element;

declare const WeatherWidget: ({ data, showMetrics, compactMode, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: WeatherWidgetProps) => react_jsx_runtime.JSX.Element;

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

/**
 * Convert time-domain telemetry to distance-domain telemetry.
 *
 * @param telemetry - Time-domain telemetry with x,y coordinates
 * @returns Distance-domain telemetry where `time` becomes cumulative distance in meters
 *
 * @example
 * ```ts
 * const distanceTelemetry = normalizeDistance(telemetry);
 * // distanceTelemetry.time -> [0, 12.5, 25.1, ...]
 * ```
 */
declare const normalizeDistance: (telemetry: FormattedTelemetry) => DistanceBasedTelemetry;
/**
 * Extract lap times from continuous telemetry using explicit boundaries or auto-detection.
 *
 * @param telemetry - Continuous session telemetry
 * @param lapBoundaries - Optional lap start times in seconds
 * @returns Array of lap timing objects
 *
 * @example
 * ```ts
 * const laps = computeLapTimes(telemetry, [0, 82.4, 163.1, 244.8]);
 * ```
 */
declare const computeLapTimes: (telemetry: FormattedTelemetry, lapBoundaries?: number[]) => LapTime[];
/**
 * Calculate sector split times for each lap.
 *
 * @param lapTimes - Lap timing objects
 * @param sectorMarkers - Sector split offsets in seconds from lap start
 * @param telemetry - Full telemetry data (reserved for future marker refinement)
 * @returns Sector timing breakdown per lap
 *
 * @example
 * ```ts
 * const sectors = computeSectorTimes(laps, [28.5, 55.2], telemetry);
 * ```
 */
declare const computeSectorTimes: (lapTimes: LapTime[], sectorMarkers: number[], telemetry: FormattedTelemetry) => LapSectors[];
/**
 * Compute point-wise speed delta between two drivers.
 *
 * @param driver1 - Reference driver telemetry
 * @param driver2 - Comparison driver telemetry
 * @returns Delta points where positive values mean driver2 is faster
 *
 * @example
 * ```ts
 * const delta = computeSpeedDelta(driver1, driver2);
 * ```
 */
declare const computeSpeedDelta: (driver1: DriverLapTelemetry, driver2: DriverLapTelemetry) => DeltaPoint[];
/**
 * Align two telemetry streams to the same time base using linear interpolation.
 *
 * @param t1 - First telemetry stream
 * @param t2 - Second telemetry stream
 * @param resolution - Optional output step in seconds
 * @returns Tuple of aligned telemetry streams with identical time arrays
 *
 * @example
 * ```ts
 * const [aligned1, aligned2] = interpolateTelemetry(t1, t2);
 * ```
 */
declare const interpolateTelemetry: (t1: FormattedTelemetry, t2: FormattedTelemetry, resolution?: number) => [FormattedTelemetry, FormattedTelemetry];
/**
 * Compute cumulative time delta over lap distance.
 *
 * @param driver1 - Baseline driver telemetry
 * @param driver2 - Comparison driver telemetry
 * @returns Distance-indexed time delta points
 *
 * @example
 * ```ts
 * const trace = computeTimeDelta(driver1, driver2);
 * ```
 */
declare const computeTimeDelta: (driver1: FormattedTelemetry, driver2: FormattedTelemetry) => TimeDeltaPoint[];
/**
 * Detect overtaking events from lap-by-lap position history.
 *
 * @param positions - Position traces for multiple drivers
 * @returns Ordered overtake events
 *
 * @example
 * ```ts
 * const events = detectOvertakes(positionHistory);
 * ```
 */
declare const detectOvertakes: (positions: DriverPositionHistory[]) => OvertakeEvent[];
/**
 * Infer tyre compound from stint lap-time behaviour.
 *
 * @param stintLapTimes - Lap times in seconds for a single stint
 * @param baselineLapTime - Baseline dry lap time in seconds
 * @returns Compound guess with confidence and degradation metrics
 *
 * @example
 * ```ts
 * const result = classifyTyreCompound([81.2, 81.4, 81.7, 82.1], 80.5);
 * ```
 */
declare const classifyTyreCompound: (stintLapTimes: number[], baselineLapTime: number) => TyreClassification;

/**
 * Merge multiple telemetry traces into one continuous telemetry object.
 * Time values are shifted to avoid overlap between consecutive traces.
 *
 * @param telemetrySources - One or more telemetry traces
 * @returns Combined telemetry trace
 *
 * @example
 * ```ts
 * const merged = mergeTelemetry(fp1, fp2, fp3);
 * ```
 */
declare const mergeTelemetry: (...telemetrySources: FormattedTelemetry[]) => FormattedTelemetry;
/**
 * Export telemetry to JSON in row or column format.
 *
 * @param telemetry - Source telemetry
 * @param format - Export format (`rows` by default)
 * @param precision - Optional decimal precision (defaults to 6)
 * @returns JSON string
 *
 * @example
 * ```ts
 * const json = exportToJson(telemetry, "rows");
 * ```
 */
declare const exportToJson: (telemetry: FormattedTelemetry, format?: JsonExportFormat) => string;
/**
 * Export telemetry to CSV.
 *
 * @param telemetry - Source telemetry
 * @param options - CSV export options
 * @returns CSV text
 *
 * @example
 * ```ts
 * const csv = exportToCsv(telemetry, { delimiter: ";", precision: 3 });
 * ```
 */
declare const exportToCsv: (telemetry: FormattedTelemetry, options?: CsvExportOptions) => string;

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
declare const createTrackAnnotationDatasets: (annotations: TelemetryAnnotation[] | undefined, trackPoints: Array<{
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

interface ErgastDriver {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
}
interface ErgastConstructor {
    constructorId: string;
    name: string;
}
interface ErgastRaceResult {
    number: string;
    position: string;
    points: string;
    Driver: ErgastDriver;
    Constructor: ErgastConstructor;
    grid: string;
    laps: string;
    status: string;
    Time?: {
        millis: string;
        time: string;
    };
    FastestLap?: {
        rank: string;
        lap: string;
        Time: {
            time: string;
        };
        AverageSpeed: {
            speed: string;
            units: string;
        };
    };
}
interface ErgastLapTime {
    number: string;
    Timings: Array<{
        driverId: string;
        position: string;
        time: string;
    }>;
}
interface ErgastRaceData {
    raceName: string;
    round: string;
    Circuit: {
        circuitId: string;
        circuitName: string;
        Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
        };
    };
    Results?: ErgastRaceResult[];
    Laps?: ErgastLapTime[];
}
interface ParsedRaceResult {
    driver: string;
    driverFullName: string;
    team: string;
    position: number;
    gridPosition: number;
    points: number;
    lapsCompleted: number;
    status: string;
    totalTimeMs?: number;
    fastestLapTime?: number;
    fastestLapNumber?: number;
    fastestLapRank?: number;
    averageSpeedKmh?: number;
}
interface ParsedLapTimes {
    driver: string;
    laps: Array<{
        lap: number;
        position: number;
        time: number;
    }>;
}
interface ErgastParsedData {
    raceName: string;
    round: number;
    circuit: {
        id: string;
        name: string;
        lat: number;
        lng: number;
        locality: string;
        country: string;
    };
    results: ParsedRaceResult[];
    lapTimes: ParsedLapTimes[];
}
declare const fromErgastApi: (data: ErgastRaceData) => ErgastParsedData;

interface MultiViewerCarData {
    timestamp: string;
    driverNumber: number;
    channels: {
        speed?: number;
        rpm?: number;
        gear?: number;
        throttle?: number;
        brake?: number | boolean;
        drs?: number;
    };
    position?: {
        x: number;
        y: number;
        z: number;
    };
}
interface MultiViewerTimingData {
    driverNumber: number;
    driverCode: string;
    position: number;
    gapToLeader?: string;
    lastLapTime?: string;
    bestLapTime?: string;
    sector1?: string;
    sector2?: string;
    sector3?: string;
    tyreCompound?: string;
    tyreAge?: number;
}
interface MultiViewerSessionData {
    sessionType: string;
    carData?: MultiViewerCarData[];
    timingData?: MultiViewerTimingData[];
}
interface MultiViewerParsedTiming {
    driverNumber: number;
    driverCode: string;
    position: number;
    gapToLeader: number | null;
    lastLapTime: number | null;
    bestLapTime: number | null;
    sectors: Array<number | null>;
    tyreCompound: string | null;
    tyreAge: number | null;
}
declare const fromMultiViewerCarData: (data: MultiViewerCarData[]) => FormattedTelemetry;
declare const fromMultiViewerTiming: (data: MultiViewerTimingData[]) => MultiViewerParsedTiming[];

interface JsonFieldMapping {
    time?: string;
    speed?: string;
    throttle?: string;
    brake?: string;
    x?: string;
    y?: string;
}
interface JsonTelemetryOptions {
    fieldMapping?: JsonFieldMapping;
    dataPath?: string;
}
declare const fromJsonTelemetry: (input: unknown, options?: JsonTelemetryOptions) => FormattedTelemetry;

interface ParquetTelemetryOptions {
    fieldMapping?: JsonFieldMapping;
}
declare const fromParquet: (rows: Record<string, unknown>[], options?: ParquetTelemetryOptions) => FormattedTelemetry;

interface OpenF1FetchOptions {
    baseUrl?: string;
    signal?: AbortSignal;
}
interface OpenF1SessionInfo {
    sessionKey: number;
    sessionName: string;
    sessionType: string;
    circuitShortName: string;
    dateStart: string;
    dateEnd: string;
    year: number;
}
interface OpenF1DriverInfo {
    driverNumber: number;
    fullName: string;
    nameAcronym: string;
    teamName: string;
    teamColour: string;
}
declare const fetchOpenF1Telemetry: (sessionKey: number, driverNumber: number, options?: OpenF1FetchOptions) => Promise<FormattedTelemetry>;
declare const fetchOpenF1Sessions: (year?: number, options?: OpenF1FetchOptions) => Promise<OpenF1SessionInfo[]>;
declare const fetchOpenF1Drivers: (sessionKey: number, options?: OpenF1FetchOptions) => Promise<OpenF1DriverInfo[]>;

interface F1Team {
    id: string;
    name: string;
    shortName: string;
    color: string;
    secondaryColor: string;
    country: string;
    principal: string;
    powerUnit: string;
    drivers: [string, string];
}
interface F1Driver {
    code: string;
    number: number;
    firstName: string;
    lastName: string;
    fullName: string;
    teamId: string;
    nationality: string;
    dateOfBirth: string;
}
declare const F1_TEAMS: readonly F1Team[];
declare const TEAM_COLORS: Readonly<Record<string, string>>;
declare const F1_DRIVERS: readonly F1Driver[];
declare const getTeam: (teamId: string) => F1Team | undefined;
declare const getDriver: (code: string) => F1Driver | undefined;
declare const getDriverColor: (code: string) => string | undefined;
declare const getTeamDrivers: (teamId: string) => F1Driver[];

interface DRSZone {
    detectionPoint: number;
    activationPoint: number;
    endPoint: number;
}
interface F1Track {
    id: string;
    name: string;
    shortName: string;
    country: string;
    city: string;
    lapLength: number;
    turns: number;
    drsZones: DRSZone[];
    sectorDistances: [number, number];
    lat: number;
    lng: number;
}
declare const TRACKS: readonly F1Track[];
declare const getTrack: (trackId: string) => F1Track | undefined;
declare const getTrackIds: () => string[];

interface TyreCompoundInfo {
    compound: TyreCompound;
    label: string;
    color: string;
    pirelli: string;
}
interface RaceCompoundAllocation {
    trackId: string;
    hard: string;
    medium: string;
    soft: string;
}
declare const TYRE_COMPOUNDS: Record<TyreCompound, TyreCompoundInfo>;
declare const RACE_COMPOUND_ALLOCATIONS: RaceCompoundAllocation[];
declare const getRaceCompounds: (trackId: string) => RaceCompoundAllocation | undefined;
declare const getTyreColor: (compound: TyreCompound) => string;

interface FlagType {
    id: string;
    name: string;
    description: string;
    color: string;
    emoji: string;
    causesNeutralization: boolean;
}
declare const FLAG_TYPES: readonly FlagType[];
declare const getFlag: (id: string) => FlagType | undefined;

interface RaceWeekend {
    round: number;
    raceName: string;
    trackId: string;
    country: string;
    dateStart: string;
    raceDate: string;
    isSprint: boolean;
}
declare const RACE_CALENDAR_2025: readonly RaceWeekend[];
declare const getNextRace: (today?: Date) => RaceWeekend | undefined;
declare const getSprintWeekends: () => RaceWeekend[];
declare const getRaceByRound: (round: number) => RaceWeekend | undefined;

export { type AnnotationProps, type ChartContainerProps, type CsvExportOptions, type CsvTelemetryOptions, type CursorSyncProps, type DRSZone, type DataProcessingOptions, type DeltaPoint, type DistanceBasedTelemetry, type DownsampleStrategy, type DriverGapData, type DriverLapTelemetry, type DriverMetrics, type DriverPitStops, type DriverPositionData, type DriverPositionHistory, type DriverSectorData, type DriverStrategy, EnergyChart, type EnergyChartProps, type ErgastParsedData, type ErgastRaceData, type F1Driver, type F1Team, type F1Track, F1_DRIVERS, F1_TEAMS, FLAG_TYPES, type FastF1TelemetryInput, type FastF1TelemetryPoint, type FlagType, type FormattedTelemetry, GapChart, type GapChartProps, type GapDataPoint, GearChart, type GearChartProps, type JsonExportFormat, type JsonFieldMapping, type JsonTelemetryOptions, LapComparisonChart, type LapComparisonChartProps, type LapComparisonMode, type LapSectors, type LapTime, MiniSectors, type MiniSectorsProps, type MultiViewerCarData, type MultiViewerParsedTiming, type MultiViewerSessionData, type MultiViewerTimingData, type OpenF1DriverInfo, type OpenF1FetchOptions, type OpenF1SessionInfo, type OpenF1TelemetryPoint, type OvertakeEvent, type ParquetTelemetryOptions, type ParsedLapTimes, type ParsedRaceResult, type PitStop, PitStopTimeline, type PitStopTimelineProps, PositionChart, type PositionChartProps, RACE_CALENDAR_2025, RACE_COMPOUND_ALLOCATIONS, type RaceCompoundAllocation, type RaceWeekend, RadarChart, type RadarChartProps, type RawTelemetryInput, type RawTelemetryPoint, type SectorComparison, type SectorSplit, type SectorTime, SpeedChart, type SpeedChartProps, SpeedHeatmapTrackMap, type SpeedHeatmapTrackMapProps, TEAM_COLORS, TRACKS, TYRE_COMPOUNDS, type TelemetryAnnotation, type TelemetryAnnotationType, TelemetryDashboard, type TelemetryDashboardProps, type TelemetryPanelExtension, type TelemetryPanelRenderContext, type TelemetrySeverity, type TelemetryStyleTokens, type TelemetryValidationIssue, type TelemetryValidationResult, type TelemetryWindow, type ThemeMode, ThrottleBrakeChart, type ThrottleBrakeChartProps, type TimeDeltaPoint, TrackMap, type TrackMapProps, type TyreClassification, type TyreCompound, type TyreCompoundInfo, type TyreStint, TyreStrategyTimeline, type TyreStrategyTimelineProps, type WeatherDataPoint, WeatherWidget, type WeatherWidgetProps, classifyTyreCompound, clearTelemetryPanels, computeLapTimes, computeSectorTimes, computeSpeedDelta, computeTimeDelta, createLineAnnotationDatasets, createTelemetryCssVariables, createTrackAnnotationDataset, createTrackAnnotationDatasets, detectOvertakes, exportToCsv, exportToJson, fetchOpenF1Drivers, fetchOpenF1Sessions, fetchOpenF1Telemetry, findNearestIndex, formatTelemetry, fromCsvTelemetry, fromErgastApi, fromFastF1Telemetry, fromJsonTelemetry, fromMultiViewerCarData, fromMultiViewerTiming, fromOpenF1Telemetry, fromParquet, getDriver, getDriverColor, getFlag, getNextRace, getRaceByRound, getRaceCompounds, getSprintWeekends, getTeam, getTeamDrivers, getTelemetryPanels, getTrack, getTrackIds, getTyreColor, interpolateTelemetry, mergeTelemetry, normalizeDistance, processSeriesData, registerTelemetryPanel, telemetryCssVariables, unregisterTelemetryPanel, validateTelemetry };
