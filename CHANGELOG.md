# Changelog

All notable changes to this project will be documented in this file.

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

### Changed
- Accessibility improvements across chart cards (focus ring + ARIA support).
- Theme system extended with `high-contrast` mode and tokenized focus styling.
- SSR-safe lazy chart rendering expanded (including radar support).
- Storybook coverage expanded with dedicated stories for all new components.
- CI/release workflows now enforce benchmarks and API/changeset checks.

### Internal
- Expanded test suite with `tests/new-components.test.tsx`.
- Added `tests/computations.test.ts` for utility-layer coverage.
- Updated public API baseline at `api/public-api.d.ts`.
