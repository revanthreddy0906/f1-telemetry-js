import { describe, expect, it } from "vitest";
import {
  clearTelemetryPanels,
  getTelemetryPanels,
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
});
