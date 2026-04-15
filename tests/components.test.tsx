import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  LapComparisonChart,
  SpeedChart,
  TelemetryDashboard,
  ThrottleBrakeChart,
  TrackMap
} from "../src";

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
          annotations={[{ type: "corner", time: 1.2, label: "T1" }]}
        />
        <TrackMap x={x} y={y} annotations={[{ type: "incident", time: 2.5, label: "Spin" }]} />
      </div>
    );

    expect(screen.getAllByRole("figure").length).toBe(4);
    expect(screen.getByLabelText("Telemetry speed chart")).toBeInTheDocument();
    expect(screen.getByLabelText("Telemetry throttle and brake chart")).toBeInTheDocument();
    expect(screen.getByLabelText("Telemetry lap comparison chart")).toBeInTheDocument();
    expect(screen.getByLabelText("Telemetry track map chart")).toBeInTheDocument();
  });

  it("renders telemetry dashboard and extension panels", () => {
    render(
      <TelemetryDashboard
        telemetry={{ time, speed, throttle, brake, x, y }}
        comparison={{ time, speed: speed.map((value) => value - 4), label: "Compare" }}
        lapMode="delta"
        sectorMarkers={[1.2, 2.5]}
        annotations={[{ type: "drs", time: 1.4, label: "DRS" }]}
        extensions={[
          {
            id: "extra-panel",
            render: () => <div>Extra telemetry panel</div>
          }
        ]}
      />
    );

    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("Driver Inputs")).toBeInTheDocument();
    expect(screen.getByText("Lap Delta")).toBeInTheDocument();
    expect(screen.getByText("Track Position")).toBeInTheDocument();
    expect(screen.getByText("Extra telemetry panel")).toBeInTheDocument();
  });
});
