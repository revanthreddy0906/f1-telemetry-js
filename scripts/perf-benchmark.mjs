import { performance } from "node:perf_hooks";
import { formatTelemetry, processSeriesData } from "../dist/index.js";

const CI_MODE = process.argv.includes("--ci");
const SAMPLE_COUNT = 120_000;

const makePoint = (index) => ({
  time: index * 0.02,
  speed: 220 + Math.sin(index / 45) * 40,
  throttle: Math.max(0, Math.min(100, 72 + Math.sin(index / 18) * 28)),
  brake: index % 130 > 110 ? 45 : 0,
  x: Math.cos(index / 50) * 320,
  y: Math.sin(index / 50) * 210
});

const source = Array.from({ length: SAMPLE_COUNT }, (_, index) => makePoint(index));

const benchmark = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const durationMs = performance.now() - start;
  return { name, durationMs, result };
};

const telemetryRun = benchmark("formatTelemetry", () => formatTelemetry(source));
const processRun = benchmark("processSeriesData", () =>
  processSeriesData({
    context: "benchmark",
    time: telemetryRun.result.time,
    seriesMap: {
      speed: telemetryRun.result.speed,
      throttle: telemetryRun.result.throttle
    },
    processing: {
      maxPoints: 500,
      downsampleStrategy: "min-max",
      window: { startTime: 12, endTime: 1500 }
    }
  })
);

const rows = [telemetryRun, processRun].map((item) => ({
  name: item.name,
  durationMs: Number(item.durationMs.toFixed(2))
}));

console.table(rows);

if (processRun.result.time.length > 500) {
  console.error(
    `Benchmark failed: downsampled output returned ${processRun.result.time.length} points (expected <= 500).`
  );
  process.exit(1);
}

if (CI_MODE) {
  const thresholds = {
    formatTelemetry: 1800,
    processSeriesData: 1100
  };

  for (const row of rows) {
    const threshold = thresholds[row.name];
    if (row.durationMs > threshold) {
      console.error(
        `Benchmark failed: ${row.name} took ${row.durationMs}ms which exceeds CI threshold ${threshold}ms.`
      );
      process.exit(1);
    }
  }
}
