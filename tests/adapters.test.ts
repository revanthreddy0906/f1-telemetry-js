import { describe, expect, it } from "vitest";
import { fromCsvTelemetry, fromFastF1Telemetry, fromOpenF1Telemetry } from "../src";

describe("telemetry adapters", () => {
  it("parses FastF1 telemetry points", () => {
    const telemetry = fromFastF1Telemetry([
      { SessionTime: 0, Speed: 110, Throttle: 22, Brake: 0, X: 10, Y: 5 },
      { SessionTime: 1, Speed: 140, Throttle: 48, Brake: 2, X: 12, Y: 7 }
    ]);

    expect(telemetry.time).toEqual([0, 1]);
    expect(telemetry.speed).toEqual([110, 140]);
  });

  it("parses OpenF1 telemetry points", () => {
    const telemetry = fromOpenF1Telemetry([
      { session_time: 0.1, speed: 120, throttle: 30, brake: 0, x: 3, y: 7 },
      { session_time: 0.2, speed: 132, throttle: 42, brake: 4, x: 5, y: 8 }
    ]);

    expect(telemetry.throttle).toEqual([30, 42]);
    expect(telemetry.x).toEqual([3, 5]);
  });

  it("parses CSV telemetry text", () => {
    const telemetry = fromCsvTelemetry(`time,speed,throttle,brake,x,y
0,110,20,0,1,2
1,135,45,0,2,3`);

    expect(telemetry.time).toEqual([0, 1]);
    expect(telemetry.brake).toEqual([0, 0]);
  });
});
