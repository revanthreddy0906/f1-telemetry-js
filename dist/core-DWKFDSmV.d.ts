import { ReactNode } from 'react';

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

/**
 * Normalize raw telemetry payloads into aligned numeric series.
 *
 * Accepts row arrays, nested array payloads, or column-oriented objects and
 * always returns a `FormattedTelemetry` shape.
 */
declare const formatTelemetry: (data: RawTelemetryInput) => FormattedTelemetry;

declare const sanitizeNumericArray: (input: unknown, seriesName: string) => number[];
declare const alignSeriesLengths: (context: string, time: number[], seriesMap: Record<string, number[]>) => {
    time: number[];
    seriesMap: Record<string, number[]>;
};
/**
 * Validate telemetry structure and values.
 *
 * Checks required channels, finite numeric values, and channel-length alignment.
 */
declare const validateTelemetry: (telemetry: Partial<FormattedTelemetry>, context?: string) => TelemetryValidationResult;

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
/**
 * Convert FastF1 telemetry payloads into normalized telemetry arrays.
 */
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
/**
 * Convert OpenF1 telemetry records into normalized telemetry arrays.
 */
declare const fromOpenF1Telemetry: (input: OpenF1TelemetryPoint[]) => FormattedTelemetry;

interface CsvTelemetryOptions {
    delimiter?: "," | ";" | "\t";
    hasHeader?: boolean;
}
/**
 * Parse CSV telemetry text into normalized telemetry arrays.
 */
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

export { type JsonTelemetryOptions as $, type AnnotationProps as A, type ErgastParsedData as B, type ChartContainerProps as C, type DataProcessingOptions as D, type EnergyChartProps as E, type FormattedTelemetry as F, type GearChartProps as G, type ErgastRaceData as H, type F1Driver as I, type F1Team as J, type F1Track as K, type LapComparisonChartProps as L, type MiniSectorsProps as M, F1_DRIVERS as N, F1_TEAMS as O, type PositionChartProps as P, FLAG_TYPES as Q, type RadarChartProps as R, type SpeedChartProps as S, type ThrottleBrakeChartProps as T, type FastF1TelemetryInput as U, type FastF1TelemetryPoint as V, type WeatherWidgetProps as W, type FlagType as X, type GapDataPoint as Y, type JsonExportFormat as Z, type JsonFieldMapping as _, type TrackMapProps as a, getFlag as a$, type LapComparisonMode as a0, type LapSectors as a1, type LapTime as a2, type MultiViewerCarData as a3, type MultiViewerParsedTiming as a4, type MultiViewerSessionData as a5, type MultiViewerTimingData as a6, type OpenF1DriverInfo as a7, type OpenF1FetchOptions as a8, type OpenF1SessionInfo as a9, type TyreCompoundInfo as aA, type TyreStint as aB, type WeatherDataPoint as aC, type WeatherMetric as aD, classifyTyreCompound as aE, computeLapTimes as aF, computeSectorTimes as aG, computeSpeedDelta as aH, computeTimeDelta as aI, detectOvertakes as aJ, exportToCsv as aK, exportToJson as aL, fetchOpenF1Drivers as aM, fetchOpenF1Sessions as aN, fetchOpenF1Telemetry as aO, findNearestIndex as aP, formatTelemetry as aQ, fromCsvTelemetry as aR, fromErgastApi as aS, fromFastF1Telemetry as aT, fromJsonTelemetry as aU, fromMultiViewerCarData as aV, fromMultiViewerTiming as aW, fromOpenF1Telemetry as aX, fromParquet as aY, getDriver as aZ, getDriverColor as a_, type OpenF1TelemetryPoint as aa, type OvertakeEvent as ab, type ParquetTelemetryOptions as ac, type ParsedLapTimes as ad, type ParsedRaceResult as ae, type PitStop as af, RACE_CALENDAR_2025 as ag, RACE_COMPOUND_ALLOCATIONS as ah, type RaceCompoundAllocation as ai, type RaceWeekend as aj, type RawTelemetryInput as ak, type RawTelemetryPoint as al, type SectorComparison as am, type SectorSplit as an, type SectorTime as ao, TEAM_COLORS as ap, TRACKS as aq, TYRE_COMPOUNDS as ar, type TelemetryAnnotationType as as, type TelemetryPanelRenderContext as at, type TelemetrySeverity as au, type TelemetryValidationIssue as av, type TelemetryWindow as aw, type TimeDeltaPoint as ax, type TyreClassification as ay, type TyreCompound as az, type TelemetryDashboardProps as b, getNextRace as b0, getRaceByRound as b1, getRaceCompounds as b2, getSprintWeekends as b3, getTeam as b4, getTeamDrivers as b5, getTrack as b6, getTrackIds as b7, getTyreColor as b8, interpolateTelemetry as b9, mergeTelemetry as ba, normalizeDistance as bb, processSeriesData as bc, validateTelemetry as bd, alignSeriesLengths as be, sanitizeNumericArray as bf, type TyreStrategyTimelineProps as c, type GapChartProps as d, type SpeedHeatmapTrackMapProps as e, type PitStopTimelineProps as f, type ThemeMode as g, type TelemetryStyleTokens as h, type TelemetryValidationResult as i, type TelemetryAnnotation as j, type TelemetryPanelExtension as k, type CsvExportOptions as l, type CsvTelemetryOptions as m, type CursorSyncProps as n, type DRSZone as o, type DeltaPoint as p, type DistanceBasedTelemetry as q, type DownsampleStrategy as r, type DriverGapData as s, type DriverLapTelemetry as t, type DriverMetrics as u, type DriverPitStops as v, type DriverPositionData as w, type DriverPositionHistory as x, type DriverSectorData as y, type DriverStrategy as z };
