import { describe, expect, it } from "vitest";
import { processSeriesData, processSeriesDataInWorker } from "../src";

const time = Array.from({ length: 5000 }, (_, index) => index * 0.02);
const speed = time.map((value) => 220 + Math.sin(value * 2) * 30);
const throttle = time.map((value, index) => (index % 200 > 160 ? 20 : 80 + Math.sin(value) * 10));

describe("performance APIs", () => {
  it("applies adaptive downsampling based on viewport width", () => {
    const processed = processSeriesData({
      context: "adaptive-test",
      time,
      seriesMap: { speed, throttle },
      processing: {
        downsampleStrategy: "adaptive",
        adaptive: {
          viewportWidth: 640,
          chartType: "line"
        }
      }
    });

    expect(processed.time.length).toBeLessThan(time.length);
    expect(processed.time.length).toBeGreaterThan(0);
  });

  it("processes data via worker API with safe fallback", async () => {
    const processed = await processSeriesDataInWorker({
      context: "worker-test",
      time,
      seriesMap: { speed, throttle },
      processing: {
        maxPoints: 400,
        downsampleStrategy: "adaptive",
        adaptive: {
          viewportWidth: 1024,
          chartType: "line"
        }
      }
    });

    expect(processed.time.length).toBeLessThanOrEqual(400);
    expect(processed.seriesMap.speed.length).toBe(processed.time.length);
    expect(processed.seriesMap.throttle.length).toBe(processed.time.length);
  });
});
