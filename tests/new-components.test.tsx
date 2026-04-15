import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EnergyChart,
  GapChart,
  GearChart,
  MiniSectors,
  PitStopTimeline,
  PositionChart,
  RadarChart,
  SpeedHeatmapTrackMap,
  TyreStrategyTimeline,
  WeatherWidget
} from "../src";

describe("new visualization components", () => {
  const time = [0, 1, 2, 3, 4, 5];
  const speed = [120, 145, 180, 210, 195, 160];
  const x = [10, 16, 23, 31, 40, 46];
  const y = [8, 12, 17, 19, 14, 11];

  it("renders GearChart and EnergyChart with titles and aria labels", () => {
    render(
      <div>
        <GearChart
          time={time}
          gear={[2, 3, 4, 6, 5, 4]}
          ariaLabel="gear-chart-aria"
          title="Gear Test"
        />
        <EnergyChart
          time={time}
          ersDeployment={[20, 35, 60, 70, 55, 30]}
          ersHarvest={[10, 12, 8, 6, 14, 18]}
          batteryLevel={[80, 78, 74, 70, 68, 66]}
          ariaLabel="energy-chart-aria"
          title="Energy Test"
        />
      </div>
    );

    expect(screen.getByText("Gear Test")).toBeInTheDocument();
    expect(screen.getByText("Energy Test")).toBeInTheDocument();
    expect(screen.getAllByLabelText("gear-chart-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("energy-chart-aria").length).toBeGreaterThan(0);
  });

  it("renders GapChart and PositionChart with aria labels", () => {
    render(
      <div>
        <GapChart
          ariaLabel="gap-chart-aria"
          title="Gap Test"
          drivers={[
            {
              driver: "VER",
              color: "#3671C6",
              data: [
                { lap: 1, gap: 0 },
                { lap: 2, gap: 0 },
                { lap: 3, gap: 0.8 },
                { lap: 4, gap: 1.1 }
              ]
            },
            {
              driver: "LEC",
              color: "#E8002D",
              data: [
                { lap: 1, gap: 0.4 },
                { lap: 2, gap: 0.9 },
                { lap: 3, gap: 1.3 },
                { lap: 4, gap: 1.7 }
              ]
            }
          ]}
        />
        <PositionChart
          ariaLabel="position-chart-aria"
          title="Position Test"
          totalLaps={6}
          highlightDrivers={["VER", "LEC"]}
          drivers={[
            { driver: "VER", color: "#3671C6", positions: [2, 2, 1, 1, 1, 1] },
            { driver: "LEC", color: "#E8002D", positions: [1, 1, 2, 2, 2, 2] },
            { driver: "NOR", color: "#FF8000", positions: [3, 3, 3, 3, 3, 3] }
          ]}
        />
      </div>
    );

    expect(screen.getByText("Gap Test")).toBeInTheDocument();
    expect(screen.getByText("Position Test")).toBeInTheDocument();
    expect(screen.getAllByLabelText("gap-chart-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("position-chart-aria").length).toBeGreaterThan(0);
  });

  it("renders SpeedHeatmapTrackMap and RadarChart", () => {
    render(
      <div>
        <SpeedHeatmapTrackMap
          title="Heatmap Test"
          ariaLabel="heatmap-aria"
          time={time}
          x={x}
          y={y}
          speed={speed}
        />
        <RadarChart
          title="Radar Test"
          ariaLabel="radar-aria"
          drivers={[
            {
              driver: "VER",
              color: "#3671C6",
              metrics: { topSpeed: 95, braking: 90, traction: 92, tyreLife: 88, consistency: 93 }
            },
            {
              driver: "LEC",
              color: "#E8002D",
              metrics: { topSpeed: 91, braking: 88, traction: 89, tyreLife: 86, consistency: 90 }
            }
          ]}
        />
      </div>
    );

    expect(screen.getByText("Heatmap Test")).toBeInTheDocument();
    expect(screen.getByText("Radar Test")).toBeInTheDocument();
    expect(screen.getAllByLabelText("heatmap-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("radar-aria").length).toBeGreaterThan(0);
  });

  it("renders TyreStrategyTimeline, MiniSectors, and PitStopTimeline data", () => {
    render(
      <div>
        <TyreStrategyTimeline
          ariaLabel="tyre-aria"
          strategies={[
            {
              driver: "VER",
              color: "#3671C6",
              stints: [
                { compound: "soft", startLap: 1, endLap: 15, label: "New" },
                { compound: "hard", startLap: 16, endLap: 35, label: "Used" }
              ]
            },
            {
              driver: "LEC",
              color: "#E8002D",
              stints: [
                { compound: "medium", startLap: 1, endLap: 22, label: "New" },
                { compound: "hard", startLap: 23, endLap: 35, label: "Used" }
              ]
            }
          ]}
          totalLaps={35}
        />
        <MiniSectors
          ariaLabel="sectors-aria"
          drivers={[
            {
              driver: "VER",
              sectors: [
                { sector: 1, time: 28.111 },
                { sector: 2, time: 31.293 },
                { sector: 3, time: 24.993 }
              ]
            },
            {
              driver: "LEC",
              sectors: [
                { sector: 1, time: 28.332 },
                { sector: 2, time: 31.101 },
                { sector: 3, time: 25.120 }
              ]
            }
          ]}
        />
        <PitStopTimeline
          ariaLabel="pit-aria"
          totalLaps={35}
          drivers={[
            {
              driver: "VER",
              stops: [
                { lap: 16, duration: 2.3, tyreCompoundOut: "hard" },
                { lap: 31, duration: 2.6, tyreCompoundOut: "soft" }
              ]
            },
            {
              driver: "LEC",
              stops: [{ lap: 22, duration: 5.4, tyreCompoundOut: "hard" }]
            }
          ]}
        />
      </div>
    );

    expect(screen.getAllByText("VER").length).toBeGreaterThan(0);
    expect(screen.getAllByText("LEC").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("tyre-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("sectors-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("pit-aria").length).toBeGreaterThan(0);
  });

  it("renders WeatherWidget in full and compact mode", () => {
    render(
      <div>
        <WeatherWidget
          ariaLabel="weather-full-aria"
          title="Weather Full"
          data={[
            { time: 0, airTemp: 27, trackTemp: 41, humidity: 44, windSpeed: 10, windDirection: 315, rainfall: 0 },
            { time: 1, airTemp: 28, trackTemp: 42, humidity: 45, windSpeed: 11, windDirection: 320, rainfall: 0 },
            { time: 2, airTemp: 28, trackTemp: 40, humidity: 49, windSpeed: 14, windDirection: 300, rainfall: 0.3 }
          ]}
        />
        <WeatherWidget
          ariaLabel="weather-compact-aria"
          title="Weather Compact"
          compactMode
          data={[
            { time: 0, airTemp: 27, trackTemp: 41, humidity: 44, windSpeed: 10, windDirection: 315, rainfall: 0 },
            { time: 1, airTemp: 28, trackTemp: 42, humidity: 45, windSpeed: 11, windDirection: 320, rainfall: 0.8 }
          ]}
        />
      </div>
    );

    expect(screen.getByText("Weather Full")).toBeInTheDocument();
    expect(screen.getByText("Weather Compact")).toBeInTheDocument();
    expect(screen.getAllByLabelText("weather-full-aria").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("weather-compact-aria").length).toBeGreaterThan(0);
    expect(screen.getByText(/Humidity:/)).toBeInTheDocument();
  });
});
