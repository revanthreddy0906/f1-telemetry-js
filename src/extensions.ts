export {
  registerTelemetryPanel,
  unregisterTelemetryPanel,
  clearTelemetryPanels,
  getTelemetryPanels
} from "./extensions/registry";
export {
  TELEMETRY_EXTENSION_API_VERSION,
  assertTelemetryExtensionCompatible,
  normalizeTelemetryPanelExtension
} from "./extensions/contracts";

export {
  telemetryStatsPanel,
  gearDistributionPanel,
  lapSummaryPanel,
  stintDegradationPanel,
  sectorPaceEvolutionPanel,
  overtakeTimelinePanel
} from "./extensions/panels";

export type {
  VersionedTelemetryPanelExtension
} from "./extensions/contracts";
export type {
  TelemetryPanelContextMenuAction,
  TelemetryPanelExtension,
  TelemetryPanelRenderContext,
  TelemetrySharedChannelApi
} from "./types/telemetry";
