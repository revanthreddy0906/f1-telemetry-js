import { describe, expect, it } from "vitest";
import { formatTelemetry, validateTelemetry } from "../src";

describe("formatTelemetry", () => {
  it("formats telemetry array input", () => {
    const telemetry = formatTelemetry([
      { time: 0, speed: 100, throttle: 20, brake: 0, x: 10, y: 5 },
      { time: 1, speed: 120, throttle: 40, brake: 5, x: 12, y: 8 }
    ]);

    expect(telemetry).toMatchObject({
      time: [0, 1],
      speed: [100, 120],
      throttle: [20, 40],
      brake: [0, 5],
      x: [10, 12],
      y: [5, 8],
      timeReference: "session"
    });
  });

  it("formats telemetry object-of-arrays input", () => {
    const telemetry = formatTelemetry({
      time: [0, 1, 2],
      speed: [110, 130, 150],
      throttle: [30, 50, 70],
      brake: [0, 0, 10],
      x: [5, 8, 13],
      y: [2, 4, 7]
    });

    expect(telemetry.speed).toEqual([110, 130, 150]);
    expect(telemetry.y).toEqual([2, 4, 7]);
  });
});

describe("validateTelemetry", () => {
  it("returns validation issues for malformed telemetry", () => {
    const result = validateTelemetry({
      time: [0, 1],
      speed: [100]
    });

    expect(result.isValid).toBe(false);
    expect(result.issues.some((issue) => issue.code === "LENGTH_MISMATCH")).toBe(true);
    expect(result.issues.some((issue) => issue.code === "INVALID_SERIES")).toBe(true);
  });
});
