import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchOpenF1Drivers,
  fetchOpenF1Sessions,
  fetchOpenF1Telemetry,
  fromErgastApi,
  fromJsonTelemetry,
  fromMultiViewerCarData,
  fromMultiViewerTiming,
  fromParquet
} from "../src";

describe("new telemetry adapters", () => {
  it("parses Ergast race results and lap times", () => {
    const parsed = fromErgastApi({
      raceName: "Test GP",
      round: "5",
      Circuit: {
        circuitId: "test_track",
        circuitName: "Test Circuit",
        Location: { lat: "25.1", long: "55.2", locality: "City", country: "Country" }
      },
      Results: [
        {
          number: "1",
          position: "1",
          points: "25",
          Driver: {
            driverId: "max_verstappen",
            permanentNumber: "1",
            code: "VER",
            givenName: "Max",
            familyName: "Verstappen"
          },
          Constructor: { constructorId: "red_bull", name: "Red Bull" },
          grid: "2",
          laps: "57",
          status: "Finished",
          Time: { millis: "5300000", time: "1:28:20.000" },
          FastestLap: {
            rank: "1",
            lap: "43",
            Time: { time: "1:23.456" },
            AverageSpeed: { speed: "232.1", units: "kph" }
          }
        }
      ],
      Laps: [
        {
          number: "1",
          Timings: [{ driverId: "max_verstappen", position: "1", time: "1:25.000" }]
        }
      ]
    });

    expect(parsed.results[0].driver).toBe("VER");
    expect(parsed.results[0].position).toBe(1);
    expect(parsed.results[0].fastestLapTime).toBeCloseTo(83.456, 3);
    expect(parsed.lapTimes[0].laps[0].time).toBeCloseTo(85, 6);
  });

  it("parses MultiViewer car data to formatted telemetry", () => {
    const telemetry = fromMultiViewerCarData([
      {
        timestamp: "2025-01-01T10:00:00.000Z",
        driverNumber: 1,
        channels: { speed: 100, throttle: 20, brake: false },
        position: { x: 1, y: 2, z: 0 }
      },
      {
        timestamp: "2025-01-01T10:00:01.500Z",
        driverNumber: 1,
        channels: { speed: 120, throttle: 40, brake: true },
        position: { x: 3, y: 5, z: 0 }
      }
    ]);

    expect(telemetry.time).toEqual([0, 1.5]);
    expect(telemetry.speed).toEqual([100, 120]);
    expect(telemetry.brake).toEqual([0, 100]);
  });

  it("parses MultiViewer timing values", () => {
    const parsed = fromMultiViewerTiming([
      {
        driverNumber: 1,
        driverCode: "VER",
        position: 1,
        gapToLeader: "+3.456",
        lastLapTime: "1:24.100",
        bestLapTime: "1:23.999",
        sector1: "0:27.100",
        sector2: "0:28.200",
        sector3: "0:28.800",
        tyreCompound: "SOFT",
        tyreAge: 11
      }
    ]);

    expect(parsed[0].gapToLeader).toBeCloseTo(3.456, 6);
    expect(parsed[0].lastLapTime).toBeCloseTo(84.1, 6);
    expect(parsed[0].sectors[0]).toBeCloseTo(27.1, 6);
  });

  it("supports JSON adapter defaults, custom mapping, dataPath and columns", () => {
    const defaultMapped = fromJsonTelemetry([
      { time: 0, speed: 100, throttle: 20, brake: 0, x: 1, y: 2 },
      { time: 1, speed: 110, throttle: 30, brake: 5, x: 2, y: 3 }
    ]);
    expect(defaultMapped.speed).toEqual([100, 110]);

    const customMapped = fromJsonTelemetry(
      [
        { ts: 0, velocity: 99, controls: { throttlePct: 10, brakePct: 0 }, pos: { px: 7, py: 8 } }
      ],
      {
        fieldMapping: {
          time: "ts",
          speed: "velocity",
          throttle: "controls.throttlePct",
          brake: "controls.brakePct",
          x: "pos.px",
          y: "pos.py"
        }
      }
    );
    expect(customMapped.time).toEqual([0]);
    expect(customMapped.x).toEqual([7]);

    const nested = fromJsonTelemetry(
      { response: { data: { telemetry: [{ time: 5, speed: 220, throttle: 90, brake: 0, x: 11, y: 12 }] } } },
      { dataPath: "response.data.telemetry" }
    );
    expect(nested.speed).toEqual([220]);

    const columns = fromJsonTelemetry({
      time: [0, 1],
      speed: [120, 130],
      throttle: [30, 40],
      brake: [0, 10],
      x: [5, 6],
      y: [7, 8]
    });
    expect(columns.brake).toEqual([0, 10]);
  });

  it("parses pre-parsed parquet rows", () => {
    const telemetry = fromParquet([
      { SessionTime: 0, Speed: 100, Throttle: 20, Brake: 0, X: 1, Y: 2 },
      { SessionTime: 1, Speed: 110, Throttle: 25, Brake: 5, X: 2, Y: 4 }
    ]);

    expect(telemetry.time).toEqual([0, 1]);
    expect(telemetry.speed).toEqual([100, 110]);
  });
});

describe("fetch OpenF1 adapters", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("fetches and parses OpenF1 telemetry", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ session_time: 0.5, speed: 123, throttle: 45, brake: 0, x: 1, y: 2 }]
    });
    vi.stubGlobal("fetch", mockFetch);

    const telemetry = await fetchOpenF1Telemetry(9159, 1, { baseUrl: "https://api.openf1.org/v1" });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(String(mockFetch.mock.calls[0][0])).toContain("car_data?session_key=9159&driver_number=1");
    expect(telemetry.speed).toEqual([123]);
  });

  it("fetches sessions and drivers", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            session_key: 9159,
            session_name: "Grand Prix",
            session_type: "Race",
            circuit_short_name: "Bahrain",
            date_start: "2025-03-01",
            date_end: "2025-03-01",
            year: 2025
          }
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            driver_number: 1,
            full_name: "Max Verstappen",
            name_acronym: "VER",
            team_name: "Red Bull",
            team_colour: "3671C6"
          }
        ]
      });
    vi.stubGlobal("fetch", mockFetch);

    const sessions = await fetchOpenF1Sessions(2025);
    const drivers = await fetchOpenF1Drivers(9159);

    expect(sessions[0].sessionKey).toBe(9159);
    expect(drivers[0].nameAcronym).toBe("VER");
  });
});
