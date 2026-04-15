import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  LapComparisonChart,
  SpeedChart,
  TelemetryDashboard,
  ThrottleBrakeChart,
  TrackMap
} from "../src";

vi.mock("react-chartjs-2", () => ({
  Line: ({ data }: { data: { datasets: unknown[] } }) => (
    <div data-testid="line-chart" data-datasets={data.datasets.length} />
  ),
  Scatter: ({ data }: { data: { datasets: unknown[] } }) => (
    <div data-testid="scatter-chart" data-datasets={data.datasets.length} />
  )
}));

describe("chart components", () => {
  const time = [0, 1, 2, 3];
  const speed = [120, 140, 180, 210];
  const throttle = [20, 45, 80, 70];
  const brake = [0, 0, 6, 20];
  const x = [10, 20, 30, 40];
  const y = [15, 18, 22, 27];

  it("renders all charts", () => {
    render(
      <div>
        <SpeedChart time={time} speed={speed} />
        <ThrottleBrakeChart time={time} throttle={throttle} brake={brake} />
        <LapComparisonChart
          driver1={{ time, speed, label: "Driver 1" }}
          driver2={{ time, speed: speed.map((value) => value - 8), label: "Driver 2" }}
        />
        <TrackMap x={x} y={y} />
      </div>
    );

    expect(screen.getAllByTestId("line-chart").length).toBe(3);
    expect(screen.getAllByTestId("scatter-chart").length).toBe(1);
  });

  it("renders telemetry dashboard and synchronized charts", () => {
    render(
      <TelemetryDashboard
        telemetry={{ time, speed, throttle, brake, x, y }}
        comparison={{ time, speed: speed.map((value) => value - 4), label: "Compare" }}
        lapMode="delta"
        sectorMarkers={[1.2, 2.5]}
      />
    );

    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("Driver Inputs")).toBeInTheDocument();
    expect(screen.getByText("Lap Delta")).toBeInTheDocument();
    expect(screen.getByText("Track Position")).toBeInTheDocument();
  });
});
