import { execSync } from "node:child_process";

const getCommandOutput = (command) => execSync(command, { encoding: "utf8" }).trim();

const isChangesetFile = (path) =>
  path.startsWith(".changeset/") && path.endsWith(".md") && !path.endsWith("README.md");

const isReleasableSource = (path) =>
  /^(src\/|package\.json$|tsconfig\.json$|tsup\.config\.ts$|vitest\.config\.ts$)/.test(path);

let mergeBase = "";
try {
  const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "HEAD~1";
  mergeBase = getCommandOutput(`git merge-base HEAD ${baseRef}`);
} catch {
  console.log("Unable to determine merge base; skipping changeset guard.");
  process.exit(0);
}

const changedFiles = getCommandOutput(`git diff --name-only ${mergeBase}...HEAD`)
  .split("\n")
  .map((entry) => entry.trim())
  .filter(Boolean);

const workingTreeChangedFiles =
  process.env.CI === "true"
    ? []
    : [
        ...getCommandOutput("git diff --name-only HEAD")
          .split("\n")
          .map((entry) => entry.trim())
          .filter(Boolean),
        ...getCommandOutput("git diff --name-only --cached")
          .split("\n")
          .map((entry) => entry.trim())
          .filter(Boolean),
        ...getCommandOutput("git ls-files --others --exclude-standard")
          .split("\n")
          .map((entry) => entry.trim())
          .filter(Boolean)
      ];

const allChangedFiles = Array.from(new Set([...changedFiles, ...workingTreeChangedFiles]));

const touchesReleasableFiles = allChangedFiles.some(isReleasableSource);
const includesChangeset = allChangedFiles.some(isChangesetFile);

if (!touchesReleasableFiles) {
  console.log("No releasable source changes detected.");
  process.exit(0);
}

if (!includesChangeset) {
  console.error(
    "Releasable changes detected without a changeset. Add a .changeset/*.md file before merging."
  );
  process.exit(1);
}

console.log("Changeset guard passed.");
