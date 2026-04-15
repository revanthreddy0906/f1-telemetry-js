import type { TelemetryPanelExtension } from "../types/telemetry";

const panelRegistry = new Map<string, TelemetryPanelExtension>();

/**
 * Register a telemetry dashboard extension panel.
 */
export const registerTelemetryPanel = (extension: TelemetryPanelExtension): void => {
  if (!extension.id) {
    throw new Error("Telemetry panel extension must include a non-empty id.");
  }
  panelRegistry.set(extension.id, extension);
};

/**
 * Unregister a telemetry dashboard extension panel by id.
 */
export const unregisterTelemetryPanel = (id: string): void => {
  panelRegistry.delete(id);
};

/**
 * Remove all registered telemetry dashboard extension panels.
 */
export const clearTelemetryPanels = (): void => {
  panelRegistry.clear();
};

/**
 * Return registered telemetry dashboard extension panels sorted by order.
 */
export const getTelemetryPanels = (): TelemetryPanelExtension[] =>
  Array.from(panelRegistry.values()).sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
