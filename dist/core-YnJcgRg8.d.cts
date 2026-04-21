import { ReactNode } from 'react';

type ThemeMode = "light" | "dark" | "high-contrast";
type DownsampleStrategy = "every-nth" | "min-max";
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
declare const validateTelemetry: (telemetry: Partial<FormattedTelemetry>, context?: string, options?: TelemetryValidationOptions) => TelemetryValidationResult;

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
declare const fromFastF1TelemetryWithDiagnostics: (input: FastF1TelemetryInput, options?: AdapterParseOptions) => TelemetryAdapterResult;

interface OpenF1TelemetryPoint {
    [key: string]: unknown;
    date?: string;
    session_time?: number | string;
    speed?: number | string;
    throttle?: number | string;
    brake?: number | string;
    n_gear?: number | string;
    air_temperature?: number | string;
    track_temperature?: number | string;
    humidity?: number | string;
    wind_speed?: number | string;
    rainfall?: number | string;
    air_pressure?: number | string;
    x?: number | string;
    y?: number | string;
}
/**
 * Convert OpenF1 telemetry records into normalized telemetry arrays.
 */
declare const fromOpenF1Telemetry: (input: OpenF1TelemetryPoint[]) => FormattedTelemetry;
declare const fromOpenF1TelemetryWithDiagnostics: (input: OpenF1TelemetryPoint[], options?: AdapterParseOptions) => TelemetryAdapterResult;

interface CsvTelemetryOptions {
    delimiter?: "," | ";" | "\t";
    hasHeader?: boolean;
}
/**
 * Parse CSV telemetry text into normalized telemetry arrays.
 */
declare const fromCsvTelemetry: (csv: string, options?: CsvTelemetryOptions) => FormattedTelemetry;
declare const fromCsvTelemetryWithDiagnostics: (csv: string, options?: CsvTelemetryOptions & AdapterParseOptions) => TelemetryAdapterResult;

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
declare const fromMultiViewerCarDataWithDiagnostics: (data: MultiViewerCarData[], options?: AdapterParseOptions) => TelemetryAdapterResult;
declare const fromMultiViewerTiming: (data: MultiViewerTimingData[]) => MultiViewerParsedTiming[];

interface JsonFieldMapping {
    time?: string;
    speed?: string;
    throttle?: string;
    brake?: string;
    x?: string;
    y?: string;
    gear?: string;
    ersDeployment?: string;
    ersHarvest?: string;
    batteryLevel?: string;
    airTemp?: string;
    trackTemp?: string;
    humidity?: string;
    windSpeed?: string;
    rainfall?: string;
    pressure?: string;
}
interface JsonTelemetryOptions {
    fieldMapping?: JsonFieldMapping;
    dataPath?: string;
    eventsPath?: string;
}
declare const fromJsonTelemetry: (input: unknown, options?: JsonTelemetryOptions) => FormattedTelemetry;
declare const fromJsonTelemetryWithDiagnostics: (input: unknown, options?: JsonTelemetryOptions & AdapterParseOptions) => TelemetryAdapterResult;

interface ParquetTelemetryOptions {
    fieldMapping?: JsonFieldMapping;
}
declare const fromParquet: (rows: Record<string, unknown>[], options?: ParquetTelemetryOptions) => FormattedTelemetry;
declare const fromParquetWithDiagnostics: (rows: Record<string, unknown>[], options?: ParquetTelemetryOptions & AdapterParseOptions) => TelemetryAdapterResult;

interface OpenF1FetchOptions {
    baseUrl?: string;
    signal?: AbortSignal;
}
interface OpenF1FetchTelemetryOptions extends OpenF1FetchOptions, AdapterParseOptions {
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
declare const fetchOpenF1TelemetryWithDiagnostics: (sessionKey: number, driverNumber: number, options?: OpenF1FetchTelemetryOptions) => Promise<TelemetryAdapterResult>;
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

export { type GapDataPoint as $, type AdapterName as A, type DriverSectorData as B, type ChartContainerProps as C, type DataProcessingOptions as D, type EnergyChartProps as E, type FormattedTelemetry as F, type GearChartProps as G, type DriverStrategy as H, type ErgastParsedData as I, type ErgastRaceData as J, type F1Driver as K, type LapComparisonChartProps as L, type MiniSectorsProps as M, type F1Team as N, type F1Track as O, type PositionChartProps as P, F1_DRIVERS as Q, type RadarChartProps as R, type SpeedChartProps as S, type ThrottleBrakeChartProps as T, F1_TEAMS as U, type ValidationMode as V, type WeatherWidgetProps as W, FLAG_TYPES as X, type FastF1TelemetryInput as Y, type FastF1TelemetryPoint as Z, type FlagType as _, type TrackMapProps as a, fetchOpenF1Telemetry as a$, type IssueSeverity as a0, type JsonExportFormat as a1, type JsonFieldMapping as a2, type JsonTelemetryOptions as a3, type LapComparisonMode as a4, type LapSectors as a5, type LapTime as a6, type MultiViewerCarData as a7, type MultiViewerParsedTiming as a8, type MultiViewerSessionData as a9, type TelemetryAnnotationType as aA, type TelemetryEvent as aB, type TelemetryExtraChannel as aC, type TelemetryPanelRenderContext as aD, type TelemetrySeriesKey as aE, type TelemetrySeverity as aF, type TelemetryValidationDiagnostics as aG, type TelemetryValidationIssue as aH, type TelemetryValidationOptions as aI, type TelemetryWindow as aJ, type TimeDeltaPoint as aK, type TyreClassification as aL, type TyreCompound as aM, type TyreCompoundInfo as aN, type TyreStint as aO, type WeatherDataPoint as aP, type WeatherMetric as aQ, classifyTyreCompound as aR, computeLapTimes as aS, computeSectorTimes as aT, computeSpeedDelta as aU, computeTimeDelta as aV, detectOvertakes as aW, exportToCsv as aX, exportToJson as aY, fetchOpenF1Drivers as aZ, fetchOpenF1Sessions as a_, type MultiViewerTimingData as aa, type OpenF1DriverInfo as ab, type OpenF1FetchOptions as ac, type OpenF1FetchTelemetryOptions as ad, type OpenF1SessionInfo as ae, type OpenF1TelemetryPoint as af, type OvertakeEvent as ag, type ParquetTelemetryOptions as ah, type ParsedLapTimes as ai, type ParsedRaceResult as aj, type PitStop as ak, RACE_CALENDAR_2025 as al, RACE_COMPOUND_ALLOCATIONS as am, type RaceCompoundAllocation as an, type RaceWeekend as ao, type RawTelemetryInput as ap, type RawTelemetryPoint as aq, type SectorComparison as ar, type SectorSplit as as, type SectorTime as at, TEAM_COLORS as au, TRACKS as av, TYRE_COMPOUNDS as aw, type TelemetryAdapterDiagnostic as ax, type TelemetryAdapterDiagnostics as ay, type TelemetryAdapterResult as az, type TelemetryDashboardProps as b, fetchOpenF1TelemetryWithDiagnostics as b0, findNearestIndex as b1, formatTelemetry as b2, fromCsvTelemetry as b3, fromCsvTelemetryWithDiagnostics as b4, fromErgastApi as b5, fromFastF1Telemetry as b6, fromFastF1TelemetryWithDiagnostics as b7, fromJsonTelemetry as b8, fromJsonTelemetryWithDiagnostics as b9, fromMultiViewerCarData as ba, fromMultiViewerCarDataWithDiagnostics as bb, fromMultiViewerTiming as bc, fromOpenF1Telemetry as bd, fromOpenF1TelemetryWithDiagnostics as be, fromParquet as bf, fromParquetWithDiagnostics as bg, getDriver as bh, getDriverColor as bi, getFlag as bj, getNextRace as bk, getRaceByRound as bl, getRaceCompounds as bm, getSprintWeekends as bn, getTeam as bo, getTeamDrivers as bp, getTrack as bq, getTrackIds as br, getTyreColor as bs, interpolateTelemetry as bt, mergeTelemetry as bu, normalizeDistance as bv, processSeriesData as bw, validateTelemetry as bx, alignSeriesLengths as by, sanitizeNumericArray as bz, type TyreStrategyTimelineProps as c, type GapChartProps as d, type SpeedHeatmapTrackMapProps as e, type PitStopTimelineProps as f, type ThemeMode as g, type TelemetryStyleTokens as h, type TelemetryValidationResult as i, type TelemetryAnnotation as j, type TelemetryPanelExtension as k, type AdapterParseOptions as l, type AnnotationProps as m, type CsvExportOptions as n, type CsvTelemetryOptions as o, type CursorSyncProps as p, type DRSZone as q, type DeltaPoint as r, type DistanceBasedTelemetry as s, type DownsampleStrategy as t, type DriverGapData as u, type DriverLapTelemetry as v, type DriverMetrics as w, type DriverPitStops as x, type DriverPositionData as y, type DriverPositionHistory as z };
