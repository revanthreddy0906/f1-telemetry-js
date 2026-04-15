import * as react_jsx_runtime from 'react/jsx-runtime';
import { S as SpeedChartProps, T as ThrottleBrakeChartProps, L as LapComparisonChartProps, a as TrackMapProps, b as TelemetryDashboardProps, G as GearChartProps, E as EnergyChartProps, c as TyreStrategyTimelineProps, d as GapChartProps, P as PositionChartProps, M as MiniSectorsProps, e as SpeedHeatmapTrackMapProps, R as RadarChartProps, f as PitStopTimelineProps, W as WeatherWidgetProps, g as ThemeMode, h as TelemetryStyleTokens, D as DataProcessingOptions, F as FormattedTelemetry, i as TelemetryValidationResult, j as TelemetryAnnotation, k as TelemetryPanelExtension } from './core-DWKFDSmV.cjs';
export { A as AnnotationProps, C as ChartContainerProps, l as CsvExportOptions, m as CsvTelemetryOptions, n as CursorSyncProps, o as DRSZone, p as DeltaPoint, q as DistanceBasedTelemetry, r as DownsampleStrategy, s as DriverGapData, t as DriverLapTelemetry, u as DriverMetrics, v as DriverPitStops, w as DriverPositionData, x as DriverPositionHistory, y as DriverSectorData, z as DriverStrategy, B as ErgastParsedData, H as ErgastRaceData, I as F1Driver, J as F1Team, K as F1Track, N as F1_DRIVERS, O as F1_TEAMS, Q as FLAG_TYPES, U as FastF1TelemetryInput, V as FastF1TelemetryPoint, X as FlagType, Y as GapDataPoint, Z as JsonExportFormat, _ as JsonFieldMapping, $ as JsonTelemetryOptions, a0 as LapComparisonMode, a1 as LapSectors, a2 as LapTime, a3 as MultiViewerCarData, a4 as MultiViewerParsedTiming, a5 as MultiViewerSessionData, a6 as MultiViewerTimingData, a7 as OpenF1DriverInfo, a8 as OpenF1FetchOptions, a9 as OpenF1SessionInfo, aa as OpenF1TelemetryPoint, ab as OvertakeEvent, ac as ParquetTelemetryOptions, ad as ParsedLapTimes, ae as ParsedRaceResult, af as PitStop, ag as RACE_CALENDAR_2025, ah as RACE_COMPOUND_ALLOCATIONS, ai as RaceCompoundAllocation, aj as RaceWeekend, ak as RawTelemetryInput, al as RawTelemetryPoint, am as SectorComparison, an as SectorSplit, ao as SectorTime, ap as TEAM_COLORS, aq as TRACKS, ar as TYRE_COMPOUNDS, as as TelemetryAnnotationType, at as TelemetryPanelRenderContext, au as TelemetrySeverity, av as TelemetryValidationIssue, aw as TelemetryWindow, ax as TimeDeltaPoint, ay as TyreClassification, az as TyreCompound, aA as TyreCompoundInfo, aB as TyreStint, aC as WeatherDataPoint, aD as WeatherMetric, aE as classifyTyreCompound, aF as computeLapTimes, aG as computeSectorTimes, aH as computeSpeedDelta, aI as computeTimeDelta, aJ as detectOvertakes, aK as exportToCsv, aL as exportToJson, aM as fetchOpenF1Drivers, aN as fetchOpenF1Sessions, aO as fetchOpenF1Telemetry, aP as findNearestIndex, aQ as formatTelemetry, aR as fromCsvTelemetry, aS as fromErgastApi, aT as fromFastF1Telemetry, aU as fromJsonTelemetry, aV as fromMultiViewerCarData, aW as fromMultiViewerTiming, aX as fromOpenF1Telemetry, aY as fromParquet, aZ as getDriver, a_ as getDriverColor, a$ as getFlag, b0 as getNextRace, b1 as getRaceByRound, b2 as getRaceCompounds, b3 as getSprintWeekends, b4 as getTeam, b5 as getTeamDrivers, b6 as getTrack, b7 as getTrackIds, b8 as getTyreColor, b9 as interpolateTelemetry, ba as mergeTelemetry, bb as normalizeDistance, bc as processSeriesData, bd as validateTelemetry } from './core-DWKFDSmV.cjs';
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

export { type ChartExportOptions, DataProcessingOptions, EnergyChart, EnergyChartProps, type ExportFormat, FormattedTelemetry, GapChart, GapChartProps, GearChart, GearChartProps, LapComparisonChart, LapComparisonChartProps, MiniSectors, MiniSectorsProps, PitStopTimeline, PitStopTimelineProps, PositionChart, PositionChartProps, RadarChart, RadarChartProps, SpeedChart, SpeedChartProps, SpeedHeatmapTrackMap, SpeedHeatmapTrackMapProps, TelemetryAnnotation, type TelemetryContextValue, TelemetryDashboard, TelemetryDashboardProps, TelemetryPanelExtension, TelemetryPlayground, type TelemetryPlaygroundProps, TelemetryProvider, type TelemetryProviderProps, TelemetryStyleTokens, TelemetryValidationResult, ThemeMode, ThrottleBrakeChart, ThrottleBrakeChartProps, TrackMap, TrackMapProps, TyreStrategyTimeline, TyreStrategyTimelineProps, type UseChartExportResult, type UseCursorSyncResult, type UseTelemetryOptions, type UseTelemetryResult, WeatherWidget, WeatherWidgetProps, clearTelemetryPanels, createLineAnnotationDatasets, createTelemetryCssVariables, createTrackAnnotationDataset, createTrackAnnotationDatasets, gearDistributionPanel, getTelemetryPanels, lapSummaryPanel, registerTelemetryPanel, telemetryCssVariables, telemetryStatsPanel, unregisterTelemetryPanel, useAutoTheme, useChartExport, useCursorSync, useTelemetry, useTelemetryContext };
