import { a1 as TelemetryPanelExtension } from './telemetry-CQTgwsmr.js';
export { a0 as TelemetryPanelContextMenuAction, a2 as TelemetryPanelRenderContext, a5 as TelemetrySharedChannelApi } from './telemetry-CQTgwsmr.js';
import 'react';

declare const TELEMETRY_EXTENSION_API_VERSION = "2.0.0";
interface VersionedTelemetryPanelExtension extends TelemetryPanelExtension {
    apiVersion?: string;
    minCoreVersion?: string;
}
declare const assertTelemetryExtensionCompatible: (extension: VersionedTelemetryPanelExtension) => void;
declare const normalizeTelemetryPanelExtension: (extension: VersionedTelemetryPanelExtension) => VersionedTelemetryPanelExtension;

/**
 * Register a telemetry dashboard extension panel.
 */
declare const registerTelemetryPanel: (extension: VersionedTelemetryPanelExtension) => void;
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

declare const stintDegradationPanel: TelemetryPanelExtension;

declare const sectorPaceEvolutionPanel: TelemetryPanelExtension;

declare const overtakeTimelinePanel: TelemetryPanelExtension;

export { TELEMETRY_EXTENSION_API_VERSION, TelemetryPanelExtension, type VersionedTelemetryPanelExtension, assertTelemetryExtensionCompatible, clearTelemetryPanels, gearDistributionPanel, getTelemetryPanels, lapSummaryPanel, normalizeTelemetryPanelExtension, overtakeTimelinePanel, registerTelemetryPanel, sectorPaceEvolutionPanel, stintDegradationPanel, telemetryStatsPanel, unregisterTelemetryPanel };
