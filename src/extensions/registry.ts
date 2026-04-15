import type { TelemetryPanelExtension } from "../types/telemetry";

const panelRegistry = new Map<string, TelemetryPanelExtension>();

export const registerTelemetryPanel = (extension: TelemetryPanelExtension): void => {
  if (!extension.id) {
    throw new Error("Telemetry panel extension must include a non-empty id.");
  }
  panelRegistry.set(extension.id, extension);
};

export const unregisterTelemetryPanel = (id: string): void => {
  panelRegistry.delete(id);
};

export const clearTelemetryPanels = (): void => {
  panelRegistry.clear();
};

export const getTelemetryPanels = (): TelemetryPanelExtension[] =>
  Array.from(panelRegistry.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
