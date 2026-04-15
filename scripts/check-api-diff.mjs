import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const UPDATE = process.argv.includes("--update");
const distPath = resolve("dist/index.d.ts");
const baselinePath = resolve("api/public-api.d.ts");

if (!existsSync(distPath)) {
  console.error("Missing dist/index.d.ts. Run `npm run build` before checking API diffs.");
  process.exit(1);
}

const current = readFileSync(distPath, "utf8").replace(/\r\n/g, "\n");

if (UPDATE) {
  mkdirSync(dirname(baselinePath), { recursive: true });
  writeFileSync(baselinePath, current, "utf8");
  console.log("Updated API baseline at api/public-api.d.ts");
  process.exit(0);
}

if (!existsSync(baselinePath)) {
  console.error("Missing api/public-api.d.ts baseline. Run `npm run api:update` and commit it.");
  process.exit(1);
}

const baseline = readFileSync(baselinePath, "utf8").replace(/\r\n/g, "\n");

if (current !== baseline) {
  console.error(
    [
      "Public API surface changed.",
      "Run `npm run api:update` and include the updated baseline,",
      "and add a changeset describing the version impact."
    ].join(" ")
  );
  process.exit(1);
}

console.log("API diff check passed.");
