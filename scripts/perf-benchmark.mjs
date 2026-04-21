import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { formatTelemetry } from "../dist/core.js";
import { processSeriesData } from "../dist/performance.js";

const CI_MODE = process.argv.includes("--ci");
const UPDATE_BASELINE = process.argv.includes("--update-baseline");
const __dirname = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(__dirname, "../benchmarks/perf-baseline.json");
const latestPath = resolve(__dirname, "../benchmarks/perf-latest.json");

const MATRIX = [
  { size: "small", sampleCount: 20_000, expectedMaxPoints: 300 },
  { size: "medium", sampleCount: 120_000, expectedMaxPoints: 700 },
  { size: "large", sampleCount: 250_000, expectedMaxPoints: 1200 }
];

const makePoint = (index) => ({
  time: index * 0.02,
  speed: 220 + Math.sin(index / 45) * 40,
  throttle: Math.max(0, Math.min(100, 72 + Math.sin(index / 18) * 28)),
  brake: index % 130 > 110 ? 45 : 0,
  x: Math.cos(index / 50) * 320,
  y: Math.sin(index / 50) * 210
});

const benchmark = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const durationMs = performance.now() - start;
  return { name, durationMs, result };
};

const rows = [];
const runSummary = {};

for (const scenario of MATRIX) {
  const source = Array.from({ length: scenario.sampleCount }, (_, index) => makePoint(index));
  const telemetryRun = benchmark(`formatTelemetry:${scenario.size}`, () => formatTelemetry(source));
  const processRun = benchmark(`processSeriesData:${scenario.size}`, () =>
    processSeriesData({
      context: `benchmark:${scenario.size}`,
      time: telemetryRun.result.time,
      seriesMap: {
        speed: telemetryRun.result.speed,
        throttle: telemetryRun.result.throttle
      },
      processing: {
        maxPoints: scenario.expectedMaxPoints,
        downsampleStrategy: "adaptive",
        adaptive: {
          viewportWidth: scenario.size === "small" ? 640 : scenario.size === "medium" ? 1080 : 1440,
          chartType: "line"
        },
        window: { startTime: 12, endTime: 1500 }
      }
    })
  );

  rows.push(
    {
      metric: telemetryRun.name,
      durationMs: Number(telemetryRun.durationMs.toFixed(2))
    },
    {
      metric: processRun.name,
      durationMs: Number(processRun.durationMs.toFixed(2))
    }
  );

  if (processRun.result.time.length > scenario.expectedMaxPoints) {
    console.error(
      `Benchmark failed: ${scenario.size} output has ${processRun.result.time.length} points (expected <= ${scenario.expectedMaxPoints}).`
    );
    process.exit(1);
  }

  runSummary[telemetryRun.name] = Number(telemetryRun.durationMs.toFixed(2));
  runSummary[processRun.name] = Number(processRun.durationMs.toFixed(2));
}

console.table(rows);

const baseline = (() => {
  try {
    return JSON.parse(readFileSync(baselinePath, "utf8"));
  } catch {
    return {};
  }
})();

mkdirSync(dirname(latestPath), { recursive: true });
writeFileSync(latestPath, JSON.stringify(runSummary, null, 2));

if (UPDATE_BASELINE) {
  writeFileSync(baselinePath, JSON.stringify(runSummary, null, 2));
  console.log(`[benchmark] Updated baseline at ${baselinePath}`);
  process.exit(0);
}

if (Object.keys(baseline).length > 0) {
  const trendRows = Object.entries(runSummary).map(([metric, duration]) => {
    const previous = typeof baseline[metric] === "number" ? baseline[metric] : null;
    const deltaPct = previous ? ((duration - previous) / previous) * 100 : null;
    return {
      metric,
      currentMs: duration,
      baselineMs: previous ?? "n/a",
      deltaPct: deltaPct === null ? "n/a" : `${deltaPct.toFixed(1)}%`
    };
  });
  console.table(trendRows);
}

if (CI_MODE) {
  const thresholds = {
    "formatTelemetry:small": 350,
    "processSeriesData:small": 260,
    "formatTelemetry:medium": 2000,
    "processSeriesData:medium": 1300,
    "formatTelemetry:large": 4200,
    "processSeriesData:large": 2600
  };

  for (const [metric, duration] of Object.entries(runSummary)) {
    const threshold = thresholds[metric];
    if (typeof threshold === "number" && duration > threshold) {
      console.error(
        `Benchmark failed: ${metric} took ${duration}ms which exceeds CI threshold ${threshold}ms.`
      );
      process.exit(1);
    }
  }
}
