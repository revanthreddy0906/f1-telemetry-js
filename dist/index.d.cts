import * as react_jsx_runtime from 'react/jsx-runtime';
import { S as SpeedChartProps, T as ThrottleBrakeChartProps, L as LapComparisonChartProps, a as TrackMapProps, b as TelemetryDashboardProps, G as GearChartProps, E as EnergyChartProps, c as TyreStrategyTimelineProps, d as GapChartProps, P as PositionChartProps, M as MiniSectorsProps, e as SpeedHeatmapTrackMapProps, R as RadarChartProps, f as PitStopTimelineProps, W as WeatherWidgetProps, g as ThemeMode, h as TelemetryStyleTokens, D as DataProcessingOptions, F as FormattedTelemetry, V as ValidationMode, i as TelemetryValidationResult, j as TelemetryAnnotation, k as TelemetryPanelExtension } from './core-YnJcgRg8.cjs';
export { A as AdapterName, l as AdapterParseOptions, m as AnnotationProps, C as ChartContainerProps, n as CsvExportOptions, o as CsvTelemetryOptions, p as CursorSyncProps, q as DRSZone, r as DeltaPoint, s as DistanceBasedTelemetry, t as DownsampleStrategy, u as DriverGapData, v as DriverLapTelemetry, w as DriverMetrics, x as DriverPitStops, y as DriverPositionData, z as DriverPositionHistory, B as DriverSectorData, H as DriverStrategy, I as ErgastParsedData, J as ErgastRaceData, K as F1Driver, N as F1Team, O as F1Track, Q as F1_DRIVERS, U as F1_TEAMS, X as FLAG_TYPES, Y as FastF1TelemetryInput, Z as FastF1TelemetryPoint, _ as FlagType, $ as GapDataPoint, a0 as IssueSeverity, a1 as JsonExportFormat, a2 as JsonFieldMapping, a3 as JsonTelemetryOptions, a4 as LapComparisonMode, a5 as LapSectors, a6 as LapTime, a7 as MultiViewerCarData, a8 as MultiViewerParsedTiming, a9 as MultiViewerSessionData, aa as MultiViewerTimingData, ab as OpenF1DriverInfo, ac as OpenF1FetchOptions, ad as OpenF1FetchTelemetryOptions, ae as OpenF1SessionInfo, af as OpenF1TelemetryPoint, ag as OvertakeEvent, ah as ParquetTelemetryOptions, ai as ParsedLapTimes, aj as ParsedRaceResult, ak as PitStop, al as RACE_CALENDAR_2025, am as RACE_COMPOUND_ALLOCATIONS, an as RaceCompoundAllocation, ao as RaceWeekend, ap as RawTelemetryInput, aq as RawTelemetryPoint, ar as SectorComparison, as as SectorSplit, at as SectorTime, au as TEAM_COLORS, av as TRACKS, aw as TYRE_COMPOUNDS, ax as TelemetryAdapterDiagnostic, ay as TelemetryAdapterDiagnostics, az as TelemetryAdapterResult, aA as TelemetryAnnotationType, aB as TelemetryEvent, aC as TelemetryExtraChannel, aD as TelemetryPanelRenderContext, aE as TelemetrySeriesKey, aF as TelemetrySeverity, aG as TelemetryValidationDiagnostics, aH as TelemetryValidationIssue, aI as TelemetryValidationOptions, aJ as TelemetryWindow, aK as TimeDeltaPoint, aL as TyreClassification, aM as TyreCompound, aN as TyreCompoundInfo, aO as TyreStint, aP as WeatherDataPoint, aQ as WeatherMetric, aR as classifyTyreCompound, aS as computeLapTimes, aT as computeSectorTimes, aU as computeSpeedDelta, aV as computeTimeDelta, aW as detectOvertakes, aX as exportToCsv, aY as exportToJson, aZ as fetchOpenF1Drivers, a_ as fetchOpenF1Sessions, a$ as fetchOpenF1Telemetry, b0 as fetchOpenF1TelemetryWithDiagnostics, b1 as findNearestIndex, b2 as formatTelemetry, b3 as fromCsvTelemetry, b4 as fromCsvTelemetryWithDiagnostics, b5 as fromErgastApi, b6 as fromFastF1Telemetry, b7 as fromFastF1TelemetryWithDiagnostics, b8 as fromJsonTelemetry, b9 as fromJsonTelemetryWithDiagnostics, ba as fromMultiViewerCarData, bb as fromMultiViewerCarDataWithDiagnostics, bc as fromMultiViewerTiming, bd as fromOpenF1Telemetry, be as fromOpenF1TelemetryWithDiagnostics, bf as fromParquet, bg as fromParquetWithDiagnostics, bh as getDriver, bi as getDriverColor, bj as getFlag, bk as getNextRace, bl as getRaceByRound, bm as getRaceCompounds, bn as getSprintWeekends, bo as getTeam, bp as getTeamDrivers, bq as getTrack, br as getTrackIds, bs as getTyreColor, bt as interpolateTelemetry, bu as mergeTelemetry, bv as normalizeDistance, bw as processSeriesData, bx as validateTelemetry } from './core-YnJcgRg8.cjs';
import { PropsWithChildren, RefObject } from 'react';
import { ChartDataset } from 'chart.js';

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

type PlaygroundChart = "speed" | "throttleBrake" | "trackMap" | "dashboard";
interface TelemetryPlaygroundProps {
    theme?: ThemeMode;
    styleTokens?: Partial<TelemetryStyleTokens>;
    className?: string;
    defaultCsv?: string;
    charts?: PlaygroundChart[];
    chartHeight?: number;
    processing?: DataProcessingOptions;
    onTelemetryParsed?: (telemetry: FormattedTelemetry) => void;
    title?: string;
    ariaLabel?: string;
}
/**
 * CSV playground that parses telemetry and previews charts instantly.
 */
declare const TelemetryPlayground: ({ theme, styleTokens, className, defaultCsv, charts, chartHeight, processing, onTelemetryParsed, title, ariaLabel }: TelemetryPlaygroundProps) => react_jsx_runtime.JSX.Element;

interface UseTelemetryOptions {
    data?: unknown;
    adapter?: (data: unknown) => FormattedTelemetry;
    fetcher?: () => Promise<unknown>;
    validate?: boolean;
    validationMode?: ValidationMode;
    processing?: DataProcessingOptions;
}
interface UseTelemetryResult {
    telemetry: FormattedTelemetry | null;
    isLoading: boolean;
    error: Error | null;
    validation: TelemetryValidationResult | null;
    setTelemetry: (data: FormattedTelemetry) => void;
    refetch: () => void;
    reset: () => void;
}
/**
 * Parse, validate, process, and optionally fetch telemetry data.
 */
declare const useTelemetry: (options?: UseTelemetryOptions) => UseTelemetryResult;

interface UseCursorSyncResult {
    cursorTime: number | null;
    setCursorTime: (time: number | null) => void;
    cursorProps: {
        showCursor: true;
        cursorTime: number | null;
        onCursorTimeChange: (time: number | null) => void;
    };
    resetCursor: () => void;
}
/**
 * Shared cursor state helper for synchronizing hover position across charts.
 */
declare const useCursorSync: () => UseCursorSyncResult;

interface TelemetryContextValue {
    telemetry: FormattedTelemetry | null;
    setTelemetry: (data: FormattedTelemetry) => void;
    isLoading: boolean;
    error: Error | null;
    validation: TelemetryValidationResult | null;
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    cursorTime: number | null;
    setCursorTime: (time: number | null) => void;
    cursorProps: {
        showCursor: true;
        cursorTime: number | null;
        onCursorTimeChange: (time: number | null) => void;
    };
    processing?: DataProcessingOptions;
    styleTokens?: Partial<TelemetryStyleTokens>;
}
interface TelemetryProviderProps {
    initialData?: FormattedTelemetry;
    fetcher?: () => Promise<unknown>;
    adapter?: (data: unknown) => FormattedTelemetry;
    theme?: ThemeMode;
    autoTheme?: boolean;
    processing?: DataProcessingOptions;
    styleTokens?: Partial<TelemetryStyleTokens>;
}
/**
 * App-level telemetry context provider with shared theme and cursor sync state.
 */
declare const TelemetryProvider: ({ children, initialData, fetcher, adapter, theme: themeProp, autoTheme, processing, styleTokens }: PropsWithChildren<TelemetryProviderProps>) => react_jsx_runtime.JSX.Element;
/**
 * Access shared telemetry context from a TelemetryProvider tree.
 */
declare const useTelemetryContext: () => TelemetryContextValue;

/**
 * Resolve theme from OS color-scheme preference.
 */
declare const useAutoTheme: (fallback?: ThemeMode) => ThemeMode;

type ExportFormat = "png" | "jpeg" | "webp";
interface ChartExportOptions {
    format?: ExportFormat;
    quality?: number;
    backgroundColor?: string;
    scale?: number;
    filename?: string;
}
interface UseChartExportResult {
    chartRef: RefObject<HTMLDivElement>;
    toDataURL: (options?: ChartExportOptions) => string | null;
    toBlob: (options?: ChartExportOptions) => Promise<Blob | null>;
    downloadImage: (options?: ChartExportOptions) => void;
}
/**
 * Utilities for exporting Chart.js canvases to image formats.
 */
declare const useChartExport: () => UseChartExportResult;

declare const telemetryCssVariables: Record<keyof TelemetryStyleTokens, string>;
declare const createTelemetryCssVariables: (tokens: Partial<TelemetryStyleTokens>) => Record<string, string>;

/**
 * Create marker datasets for line charts from telemetry annotations.
 */
declare const createLineAnnotationDatasets: (annotations: TelemetryAnnotation[] | undefined, time: number[], valueSeries: number[], palette: TelemetryStyleTokens) => ChartDataset<"line", {
    x: number;
    y: number;
}[]>[];
/**
 * Create marker datasets for track-map scatter charts from telemetry annotations.
 */
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

/**
 * Register a telemetry dashboard extension panel.
 */
declare const registerTelemetryPanel: (extension: TelemetryPanelExtension) => void;
/**
 * Unregister a telemetry dashboard extension panel by id.
 */
declare const unregisterTelemetryPanel: (id: string) => void;
/**
 * Remove all registered telemetry dashboard extension panels.
 */
declare const clearTelemetryPanels: () => void;
/**
 * Return registered telemetry dashboard extension panels sorted by order.
 */
declare const getTelemetryPanels: () => TelemetryPanelExtension[];

declare const telemetryStatsPanel: TelemetryPanelExtension;

declare const gearDistributionPanel: TelemetryPanelExtension;

declare const lapSummaryPanel: TelemetryPanelExtension;

export { type ChartExportOptions, DataProcessingOptions, EnergyChart, EnergyChartProps, type ExportFormat, FormattedTelemetry, GapChart, GapChartProps, GearChart, GearChartProps, LapComparisonChart, LapComparisonChartProps, MiniSectors, MiniSectorsProps, PitStopTimeline, PitStopTimelineProps, PositionChart, PositionChartProps, RadarChart, RadarChartProps, SpeedChart, SpeedChartProps, SpeedHeatmapTrackMap, SpeedHeatmapTrackMapProps, TelemetryAnnotation, type TelemetryContextValue, TelemetryDashboard, TelemetryDashboardProps, TelemetryPanelExtension, TelemetryPlayground, type TelemetryPlaygroundProps, TelemetryProvider, type TelemetryProviderProps, TelemetryStyleTokens, TelemetryValidationResult, ThemeMode, ThrottleBrakeChart, ThrottleBrakeChartProps, TrackMap, TrackMapProps, TyreStrategyTimeline, TyreStrategyTimelineProps, type UseChartExportResult, type UseCursorSyncResult, type UseTelemetryOptions, type UseTelemetryResult, ValidationMode, WeatherWidget, WeatherWidgetProps, clearTelemetryPanels, createLineAnnotationDatasets, createTelemetryCssVariables, createTrackAnnotationDataset, createTrackAnnotationDatasets, gearDistributionPanel, getTelemetryPanels, lapSummaryPanel, registerTelemetryPanel, telemetryCssVariables, telemetryStatsPanel, unregisterTelemetryPanel, useAutoTheme, useChartExport, useCursorSync, useTelemetry, useTelemetryContext };
