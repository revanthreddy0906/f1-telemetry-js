# Changelog

## 1.1.0

### Minor Changes

- 8b773e1: Add extension APIs for custom dashboard panels, telemetry adapters (FastF1/OpenF1/CSV), SSR-safe lazy chart rendering, annotation overlays, high-contrast accessibility upgrades, benchmark tooling, example app templates, and semantic-versioning CI guardrails.

All notable changes to this project will be documented in this file.

## 1.1.1

### Patch Changes

- Publish metadata and docs refresh:
  - finalized unscoped npm package presentation as `f1-telemetry-js`
  - updated README/package metadata alignment and release artifacts

## [Unreleased]

### Added

- Ten new visualization components:
  - `GearChart`
  - `EnergyChart`
  - `TyreStrategyTimeline`
  - `GapChart`
  - `PositionChart`
  - `MiniSectors`
  - `SpeedHeatmapTrackMap`
  - `RadarChart`
  - `PitStopTimeline`
  - `WeatherWidget`
- New telemetry adapters:
  - `fromFastF1Telemetry`
  - `fromOpenF1Telemetry`
  - `fromCsvTelemetry`
- Plugin extension API for custom dashboard panels:
  - `registerTelemetryPanel`
  - `unregisterTelemetryPanel`
  - `clearTelemetryPanels`
  - `getTelemetryPanels`
- New examples:
  - `examples/vite-template`
  - `examples/next-template`
- New benchmark and release guardrail scripts:
  - `benchmark` / `benchmark:ci`
  - `api:check` / `api:update`
  - `semver:changeset`
- New pure TypeScript computation utilities:
  - `normalizeDistance`
  - `computeLapTimes`
  - `computeSectorTimes`
  - `computeSpeedDelta`
  - `interpolateTelemetry`
  - `computeTimeDelta`
  - `detectOvertakes`
  - `classifyTyreCompound`
- New telemetry export utilities:
  - `mergeTelemetry`
  - `exportToJson`
  - `exportToCsv`
- Five new data adapters:
  - `fromErgastApi`
  - `fromMultiViewerCarData` / `fromMultiViewerTiming`
  - `fromJsonTelemetry`
  - `fromParquet`
  - `fetchOpenF1Telemetry` / `fetchOpenF1Sessions` / `fetchOpenF1Drivers`
- New hooks and context APIs:
  - `useTelemetry`
  - `useCursorSync`
  - `useAutoTheme`
  - `useChartExport`
  - `TelemetryProvider` / `useTelemetryContext`
- New pre-built extension panels:
  - `telemetryStatsPanel`
  - `gearDistributionPanel`
  - `lapSummaryPanel`
- New headless core entrypoint export: `f1-telemetry-js/core`
- New F1 domain constants module (`src/constants`) with:
  - teams/drivers/colors
  - tracks + DRS/sector metadata
  - tyre compounds + race allocations
  - flag types
  - 2025 race calendar helpers

### Changed

- Accessibility improvements across chart cards (focus ring + ARIA support).
- Theme system extended with `high-contrast` mode and tokenized focus styling.
- SSR-safe lazy chart rendering expanded (including radar support).
- Storybook coverage expanded with dedicated stories for all new components.
- CI/release workflows now enforce benchmarks and API/changeset checks.
- Package metadata polish:
  - added `author`, `repository`, `homepage`, `bugs`, `engines`, and `sideEffects`
  - added `LICENSE` to publishable package files
- Build now emits multi-entry outputs for both `index` and `core`.
- Release workflow now skips npm publish when the current package version is already on npm to avoid repeated `E403` failures on reruns.

### Internal

- Expanded test suite with `tests/new-components.test.tsx`.
- Added `tests/computations.test.ts` for utility-layer coverage.
- Updated public API baseline at `api/public-api.d.ts`.
- Hardened GitHub Actions workflows:
  - Upgraded `actions/checkout` and `actions/setup-node` to `v5`
  - Updated CI/release runtime to Node.js 22
  - Added npm auth preflight step in release workflow for clearer publish failures
  - Added `ENABLE_NPM_PUBLISH` release toggle to prevent recurring release failures on every push when npm publish is not configured
- Added test coverage for new adapters/constants:
  - `tests/adapters-new.test.ts`
  - `tests/constants.test.ts`
- Added new test suites:
  - `tests/hooks.test.tsx`
  - `tests/playground.test.tsx`
