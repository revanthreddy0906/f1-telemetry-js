import * as react_jsx_runtime from 'react/jsx-runtime';
import { H as SpeedChartProps, ae as ThrottleBrakeChartProps, L as LapComparisonChartProps, ag as TrackMapProps, Z as TelemetryDashboardProps, r as GearChartProps, E as EnergyChartProps, ak as TyreStrategyTimelineProps, G as GapChartProps, w as PositionChartProps, M as MiniSectorsProps, K as SpeedHeatmapTrackMapProps, R as RadarChartProps, v as PitStopTimelineProps, ao as WeatherWidgetProps, ad as ThemeMode, a6 as TelemetryStyleTokens, D as DataProcessingOptions, F as FormattedTelemetry, al as ValidationMode, ab as TelemetryValidationResult, U as TelemetryAnnotation } from './telemetry-CQTgwsmr.js';
export { c as AnnotationProps, C as ChartContainerProps, e as CursorSyncProps, i as DriverGapData, j as DriverLapTelemetry, k as DriverMetrics, l as DriverPitStops, m as DriverPositionData, o as DriverSectorData, S as SectorComparison, B as SectorTime, X as TelemetryDashboardLayout, Y as TelemetryDashboardLayoutItem, a7 as TelemetryTimeReference } from './telemetry-CQTgwsmr.js';
import { PropsWithChildren, RefObject } from 'react';
import { ChartDataset } from 'chart.js';

declare const SpeedChart: (props: SpeedChartProps) => react_jsx_runtime.JSX.Element;

declare const ThrottleBrakeChart: ({ time, throttle, brake, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: ThrottleBrakeChartProps) => react_jsx_runtime.JSX.Element;

declare const LapComparisonChart: ({ driver1, driver2, driver1Label, driver2Label, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, mode, sectorMarkers, deltaLabel, annotations, showAnnotations }: LapComparisonChartProps) => react_jsx_runtime.JSX.Element;

declare const TrackMap: ({ x, y, time, theme, height, className, title, ariaLabel, processing, styleTokens, showCursor, cursorTime, onCursorTimeChange, annotations, showAnnotations }: TrackMapProps) => react_jsx_runtime.JSX.Element;

declare const TelemetryDashboard: ({ telemetry, comparison, lapMode, sectorMarkers, annotations, theme, styleTokens, processing, syncCursor, className, chartHeight, trackMapHeight, panelGap, minPanelWidth, includeDefaultPanels, extensions, enableLayoutEditor, persistLayout, layoutStorageKey, defaultLayout, onLayoutChange }: TelemetryDashboardProps) => react_jsx_runtime.JSX.Element;

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
    showImportWizard?: boolean;
}
/**
 * CSV playground that parses telemetry and previews charts instantly.
 */
declare const TelemetryPlayground: ({ theme, styleTokens, className, defaultCsv, charts, chartHeight, processing, onTelemetryParsed, title, ariaLabel, showImportWizard }: TelemetryPlaygroundProps) => react_jsx_runtime.JSX.Element;

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

export { type ChartExportOptions, EnergyChart, EnergyChartProps, type ExportFormat, GapChart, GapChartProps, GearChart, GearChartProps, LapComparisonChart, LapComparisonChartProps, MiniSectors, MiniSectorsProps, PitStopTimeline, PitStopTimelineProps, PositionChart, PositionChartProps, RadarChart, RadarChartProps, SpeedChart, SpeedChartProps, SpeedHeatmapTrackMap, SpeedHeatmapTrackMapProps, type TelemetryContextValue, TelemetryDashboard, TelemetryDashboardProps, TelemetryPlayground, type TelemetryPlaygroundProps, TelemetryProvider, type TelemetryProviderProps, TelemetryStyleTokens, ThemeMode, ThrottleBrakeChart, ThrottleBrakeChartProps, TrackMap, TrackMapProps, TyreStrategyTimeline, TyreStrategyTimelineProps, type UseChartExportResult, type UseCursorSyncResult, type UseTelemetryOptions, type UseTelemetryResult, WeatherWidget, WeatherWidgetProps, createLineAnnotationDatasets, createTelemetryCssVariables, createTrackAnnotationDataset, createTrackAnnotationDatasets, telemetryCssVariables, useAutoTheme, useChartExport, useCursorSync, useTelemetry, useTelemetryContext };
