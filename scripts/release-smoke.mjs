import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const fail = (message) => {
  console.error(`[release-smoke] ${message}`);
  process.exit(1);
};

const root = process.cwd();
const distIndex = resolve(root, "dist/index.js");
const distCore = resolve(root, "dist/core.js");

if (!existsSync(distIndex) || !existsSync(distCore)) {
  fail("Missing dist artifacts. Run `npm run build` before smoke checks.");
}

const indexModule = await import(pathToFileURL(distIndex).href);
const coreModule = await import(pathToFileURL(distCore).href);

if (typeof indexModule.SpeedChart !== "function" || typeof indexModule.TelemetryDashboard !== "function") {
  fail("React entrypoint exports are incomplete.");
}

if (typeof coreModule.formatTelemetry !== "function" || typeof coreModule.validateTelemetry !== "function") {
  fail("Core entrypoint exports are incomplete.");
}

const validation = coreModule.validateTelemetry(
  {
    time: [0, 1],
    speed: [100, 120],
    throttle: [20, 40],
    brake: [0, 0],
    x: [1, 2],
    y: [3, 4]
  },
  "release-smoke"
);

if (!validation || typeof validation.isValid !== "boolean" || !Array.isArray(validation.issues)) {
  fail("validateTelemetry output shape is invalid.");
}

console.log("[release-smoke] index/core exports are valid.");
