import { describe, expect, it } from "vitest";
import {
  TELEMETRY_EXTENSION_API_VERSION,
  assertTelemetryExtensionCompatible,
  clearTelemetryPanels,
  getTelemetryPanels,
  normalizeTelemetryPanelExtension,
  registerTelemetryPanel,
  unregisterTelemetryPanel
} from "../src";

describe("telemetry extension registry", () => {
  it("registers and orders extension panels", () => {
    clearTelemetryPanels();

    registerTelemetryPanel({
      id: "b",
      order: 20,
      render: () => null
    });

    registerTelemetryPanel({
      id: "a",
      order: 10,
      render: () => null
    });

    const panels = getTelemetryPanels();
    expect(panels.map((panel) => panel.id)).toEqual(["a", "b"]);

    unregisterTelemetryPanel("a");
    expect(getTelemetryPanels().map((panel) => panel.id)).toEqual(["b"]);
  });

  it("normalizes extension contracts to current API version", () => {
    const normalized = normalizeTelemetryPanelExtension({
      id: "versioned",
      render: () => null
    });
    expect(normalized.apiVersion).toBe(TELEMETRY_EXTENSION_API_VERSION);

    expect(() =>
      assertTelemetryExtensionCompatible({
        id: "legacy",
        apiVersion: "1.5.0",
        render: () => null
      })
    ).toThrow(/incompatible/i);
  });
});
