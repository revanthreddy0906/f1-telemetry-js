import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TelemetryDashboard,
  overtakeTimelinePanel,
  sectorPaceEvolutionPanel,
  stintDegradationPanel
} from "../src";

describe("v1.4 analytics extension panels", () => {
  it("renders new built-in analytics panels", () => {
    const telemetry = {
      time: [0, 1, 2, 3, 4, 5],
      speed: [120, 145, 180, 210, 195, 160],
      throttle: [20, 45, 80, 70, 60, 35],
      brake: [0, 0, 6, 20, 15, 8],
      x: [10, 20, 30, 40, 50, 60],
      y: [15, 18, 22, 27, 25, 19],
      events: [{ time: 2.5, type: "overtake", description: "P1 over P2" }]
    };

    render(
      <TelemetryDashboard
        telemetry={telemetry}
        comparison={{ time: telemetry.time, speed: [118, 143, 176, 205, 191, 158], label: "Comparison" }}
        includeDefaultPanels={false}
        sectorMarkers={[2, 4]}
        extensions={[stintDegradationPanel, sectorPaceEvolutionPanel, overtakeTimelinePanel]}
      />
    );

    expect(screen.getAllByText("Stint Degradation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sector Pace Evolution").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Overtake Timeline").length).toBeGreaterThan(0);
  });
});
