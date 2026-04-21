import { describe, expect, it } from "vitest";
import { formatTelemetry, processSeriesData, validateTelemetry } from "../src";

describe("v1.2 data reliability", () => {
  it("supports extra channel and event formatting", () => {
    const telemetry = formatTelemetry({
      time: [0, 1, 2],
      speed: [100, 110, 120],
      throttle: [20, 30, 40],
      brake: [0, 0, 2],
      x: [1, 2, 3],
      y: [2, 3, 4],
      gear: [4, 5, 6],
      events: [{ time: 1.2, type: "drs", value: true }]
    });

    expect(telemetry.channels?.gear).toEqual([4, 5, 6]);
    expect(telemetry.events?.[0].type).toBe("drs");
  });

  it("provides strict and lenient validation modes", () => {
    const malformed = {
      time: [0, 1, 2],
      speed: [100, 110],
      throttle: [20, 30, 40],
      brake: [0, 0, 0],
      x: [1, 2, 3],
      y: [2, 3, 4]
    };

    const strict = validateTelemetry(malformed, "strict-check", { mode: "strict" });
    const lenient = validateTelemetry(malformed, "lenient-check", { mode: "lenient" });

    expect(strict.isValid).toBe(false);
    expect(strict.diagnostics.errorCount).toBeGreaterThan(0);
    expect(lenient.isValid).toBe(true);
    expect(lenient.diagnostics.warningCount).toBeGreaterThan(0);
  });

  it("normalizes mixed-rate and out-of-order time series", () => {
    const processed = processSeriesData({
      context: "mixed-rate",
      time: [2, 0, 1, 1, 3],
      seriesMap: {
        speed: [140, 100, 120, 121, 150],
        throttle: [50, 20, 35, 36, 60],
        brake: [0, 0, 2, 1, 0],
        x: [4, 1, 2, 2.1, 5],
        y: [5, 2, 3, 3.1, 6]
      }
    });

    expect(processed.time).toEqual([0, 1, 2, 3]);
    expect(processed.seriesMap.speed).toEqual([100, 121, 140, 150]);
  });
});
