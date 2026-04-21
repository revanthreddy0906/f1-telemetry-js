export { CsvTelemetryOptions, ErgastParsedData, ErgastRaceData, FastF1TelemetryInput, FastF1TelemetryPoint, JsonFieldMapping, JsonTelemetryOptions, MultiViewerCarData, MultiViewerParsedTiming, MultiViewerSessionData, MultiViewerTimingData, OpenF1DriverInfo, OpenF1FetchOptions, OpenF1FetchTelemetryOptions, OpenF1SessionInfo, OpenF1TelemetryPoint, ParquetTelemetryOptions, ParsedLapTimes, ParsedRaceResult, fetchOpenF1Drivers, fetchOpenF1Sessions, fetchOpenF1Telemetry, fetchOpenF1TelemetryWithDiagnostics, fromCsvTelemetry, fromCsvTelemetryWithDiagnostics, fromErgastApi, fromFastF1Telemetry, fromFastF1TelemetryWithDiagnostics, fromJsonTelemetry, fromJsonTelemetryWithDiagnostics, fromMultiViewerCarData, fromMultiViewerCarDataWithDiagnostics, fromMultiViewerTiming, fromOpenF1Telemetry, fromOpenF1TelemetryWithDiagnostics, fromParquet, fromParquetWithDiagnostics } from './adapters.cjs';
import { X as RawTelemetryInput, F as FormattedTelemetry, ac as TelemetryValidationOptions, i as TelemetryValidationResult, af as TyreClassification, O as LapTime, N as LapSectors, u as DriverLapTelemetry, q as DeltaPoint, ae as TimeDeltaPoint, y as DriverPositionHistory, Q as OvertakeEvent, r as DistanceBasedTelemetry, o as CsvExportOptions, J as JsonExportFormat, ag as TyreCompound } from './telemetry-B9VIxR8w.cjs';
export { A as AdapterName, l as AdapterParseOptions, m as AdaptiveDownsampleOptions, D as DataProcessingOptions, s as DownsampleStrategy, I as IssueSeverity, K as LapComparisonMode, Y as RawTelemetryPoint, _ as SectorSplit, a0 as TelemetryAdapterDiagnostic, a1 as TelemetryAdapterDiagnostics, a2 as TelemetryAdapterResult, j as TelemetryAnnotation, a3 as TelemetryAnnotationType, a4 as TelemetryChartType, a5 as TelemetryEvent, a6 as TelemetryExtraChannel, a8 as TelemetrySeriesKey, a9 as TelemetrySeverity, h as TelemetryStyleTokens, aa as TelemetryValidationDiagnostics, ab as TelemetryValidationIssue, ad as TelemetryWindow, g as ThemeMode, V as ValidationMode } from './telemetry-B9VIxR8w.cjs';
export { findNearestIndex, processSeriesData, processSeriesDataInWorker } from './performance.cjs';
import 'react';

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

export { CsvExportOptions, type DRSZone, DeltaPoint, DistanceBasedTelemetry, DriverLapTelemetry, DriverPositionHistory, type F1Driver, type F1Team, type F1Track, F1_DRIVERS, F1_TEAMS, FLAG_TYPES, type FlagType, FormattedTelemetry, JsonExportFormat, LapSectors, LapTime, OvertakeEvent, RACE_CALENDAR_2025, RACE_COMPOUND_ALLOCATIONS, type RaceCompoundAllocation, type RaceWeekend, RawTelemetryInput, TEAM_COLORS, TRACKS, TYRE_COMPOUNDS, TelemetryValidationOptions, TelemetryValidationResult, TimeDeltaPoint, TyreClassification, TyreCompound, type TyreCompoundInfo, alignSeriesLengths, classifyTyreCompound, computeLapTimes, computeSectorTimes, computeSpeedDelta, computeTimeDelta, detectOvertakes, exportToCsv, exportToJson, formatTelemetry, getDriver, getDriverColor, getFlag, getNextRace, getRaceByRound, getRaceCompounds, getSprintWeekends, getTeam, getTeamDrivers, getTrack, getTrackIds, getTyreColor, interpolateTelemetry, mergeTelemetry, normalizeDistance, sanitizeNumericArray, validateTelemetry };
