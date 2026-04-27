import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.argv[2] ? resolve(process.argv[2]) : process.cwd();
const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const reactExports = new Set([
  "SpeedChart",
  "ThrottleBrakeChart",
  "LapComparisonChart",
  "TrackMap",
  "TelemetryDashboard",
  "GearChart",
  "EnergyChart",
  "TyreStrategyTimeline",
  "GapChart",
  "PositionChart",
  "MiniSectors",
  "SpeedHeatmapTrackMap",
  "RadarChart",
  "PitStopTimeline",
  "WeatherWidget",
  "TelemetryPlayground",
  "useTelemetry",
  "useCursorSync",
  "TelemetryProvider",
  "useTelemetryContext",
  "useAutoTheme",
  "useChartExport"
]);

const coreExports = new Set([
  "formatTelemetry",
  "validateTelemetry",
  "processSeriesData",
  "processSeriesDataInWorker",
  "normalizeTelemetryTime",
  "fromCsvTelemetry",
  "fromOpenF1Telemetry",
  "fromFastF1Telemetry",
  "computeLapTimes",
  "computeTimeDelta",
  "normalizeDistance",
  "computeSpeedDelta",
  "computeSectorTimes",
  "detectOvertakes",
  "classifyTyreCompound"
]);

const listFiles = (dir) =>
  readdirSync(dir)
    .flatMap((name) => {
      const next = join(dir, name);
      const stats = statSync(next);
      if (stats.isDirectory()) {
        if (name === "node_modules" || name === ".git" || name === "dist") {
          return [];
        }
        return listFiles(next);
      }
      return next;
    })
    .filter((file) => [...exts].some((ext) => file.endsWith(ext)));

const parseNames = (value) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim());

const rewrite = (content) =>
  content.replace(
    /import\s+\{([^}]+)\}\s+from\s+["']f1-telemetry-js["'];?/g,
    (_, names) => {
      const parsed = parseNames(names);
      const react = parsed.filter((name) => reactExports.has(name));
      const core = parsed.filter((name) => coreExports.has(name));
      const unknown = parsed.filter((name) => !reactExports.has(name) && !coreExports.has(name));

      const lines = [];
      if (react.length > 0) {
        lines.push(`import { ${react.join(", ")} } from "f1-telemetry-js/react";`);
      }
      if (core.length > 0) {
        lines.push(`import { ${core.join(", ")} } from "f1-telemetry-js/core";`);
      }
      if (unknown.length > 0) {
        lines.push(`import { ${unknown.join(", ")} } from "f1-telemetry-js/extensions";`);
      }
      return lines.join("\n");
    }
  );

const files = listFiles(root);
let changed = 0;

files.forEach((file) => {
  const original = readFileSync(file, "utf8");
  const updated = rewrite(original);
  if (updated !== original) {
    writeFileSync(file, updated);
    changed += 1;
  }
});

console.log(`[codemod] Updated ${changed} file(s) for v2 namespace imports.`);
