import { F as FormattedTelemetry, a as AdapterParseOptions, Q as TelemetryAdapterResult } from './telemetry-CQTgwsmr.cjs';
import 'react';

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

export { type CsvTelemetryOptions, type ErgastParsedData, type ErgastRaceData, type FastF1TelemetryInput, type FastF1TelemetryPoint, type JsonFieldMapping, type JsonTelemetryOptions, type MultiViewerCarData, type MultiViewerParsedTiming, type MultiViewerSessionData, type MultiViewerTimingData, type OpenF1DriverInfo, type OpenF1FetchOptions, type OpenF1FetchTelemetryOptions, type OpenF1SessionInfo, type OpenF1TelemetryPoint, type ParquetTelemetryOptions, type ParsedLapTimes, type ParsedRaceResult, fetchOpenF1Drivers, fetchOpenF1Sessions, fetchOpenF1Telemetry, fetchOpenF1TelemetryWithDiagnostics, fromCsvTelemetry, fromCsvTelemetryWithDiagnostics, fromErgastApi, fromFastF1Telemetry, fromFastF1TelemetryWithDiagnostics, fromJsonTelemetry, fromJsonTelemetryWithDiagnostics, fromMultiViewerCarData, fromMultiViewerCarDataWithDiagnostics, fromMultiViewerTiming, fromOpenF1Telemetry, fromOpenF1TelemetryWithDiagnostics, fromParquet, fromParquetWithDiagnostics };
