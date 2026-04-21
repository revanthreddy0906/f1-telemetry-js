# f1-telemetry-js

[![npm version](https://img.shields.io/npm/v/f1-telemetry-js.svg)](https://www.npmjs.com/package/f1-telemetry-js)
[![npm downloads](https://img.shields.io/npm/dm/f1-telemetry-js.svg)](https://www.npmjs.com/package/f1-telemetry-js)
[![bundle size](https://img.shields.io/bundlephobia/minzip/f1-telemetry-js)](https://bundlephobia.com/package/f1-telemetry-js)
[![license](https://img.shields.io/npm/l/f1-telemetry-js.svg)](https://github.com/revanthreddy0906/f1-telemetry-js/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

Reusable React + TypeScript component library for Formula 1 telemetry visualization.

## Installation

```bash
npm install f1-telemetry-js chart.js react-chartjs-2
```

## Quick Usage

```tsx
import { SpeedChart, fromCsvTelemetry } from "f1-telemetry-js";

const telemetry = fromCsvTelemetry(`time,speed,throttle,brake,x,y
0,122,28,0,12,8
1,150,55,0,18,12
2,188,80,4,24,16
3,215,92,0,30,18`);

export function App() {
  return <SpeedChart time={telemetry.time} speed={telemetry.speed} />;
}
```

## Core Charts

- `SpeedChart`
- `ThrottleBrakeChart`
- `LapComparisonChart`
- `TrackMap`
- `TelemetryDashboard`
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
- `TelemetryPlayground`

## Hooks

```tsx
import { useTelemetry, useCursorSync, SpeedChart, ThrottleBrakeChart } from "f1-telemetry-js";

function Dashboard({ rawData }: { rawData: unknown }) {
  const { telemetry } = useTelemetry({ data: rawData });
  const { cursorProps } = useCursorSync();

  if (!telemetry) return null;

  return (
    <>
      <SpeedChart time={telemetry.time} speed={telemetry.speed} {...cursorProps} />
      <ThrottleBrakeChart
        time={telemetry.time}
        throttle={telemetry.throttle}
        brake={telemetry.brake}
        {...cursorProps}
      />
    </>
  );
}
```

Available hooks:

- `useTelemetry`
- `useCursorSync`
- `useAutoTheme`
- `useChartExport`
- `TelemetryProvider` / `useTelemetryContext`

## Headless Core (`f1-telemetry-js/core`)

Use the core subpath when you only need parsing, processing, computations, and constants (no React components):

```ts
import { fromCsvTelemetry, TEAM_COLORS, computeTimeDelta } from "f1-telemetry-js/core";
```

## Utility APIs

- `formatTelemetry`
- `validateTelemetry`
- `processSeriesData`
- `findNearestIndex`
- `createLineAnnotationDatasets`
- `createTrackAnnotationDataset`
- `normalizeDistance`
- `computeLapTimes`
- `computeSectorTimes`
- `computeSpeedDelta`
- `interpolateTelemetry`
- `computeTimeDelta`
- `detectOvertakes`
- `classifyTyreCompound`
- `mergeTelemetry`
- `exportToJson`
- `exportToCsv`

### Reliability features (v1.2)

```ts
import {
  fromOpenF1TelemetryWithDiagnostics,
  validateTelemetry
} from "f1-telemetry-js/core";

const adapterResult = fromOpenF1TelemetryWithDiagnostics(rawOpenF1Data, {
  validationMode: "lenient"
});

const strictValidation = validateTelemetry(adapterResult.telemetry, "lap-check", {
  mode: "strict"
});
```

- Optional extra telemetry channels: `gear`, `ersDeployment`, `ersHarvest`, `batteryLevel`, `airTemp`, `trackTemp`, `humidity`, `windSpeed`, `rainfall`, `pressure`
- Structured adapter diagnostics for contract monitoring in CI
- Validation modes: `strict` (errors on mismatches) and `lenient` (warnings for recoverable shape issues)

## Plugin Extension API

```ts
import { registerTelemetryPanel, telemetryStatsPanel } from "f1-telemetry-js";

registerTelemetryPanel(telemetryStatsPanel);
```

Built-in extension panels:

- `telemetryStatsPanel`
- `gearDistributionPanel`
- `lapSummaryPanel`

## React Native

`f1-telemetry-js` components use Chart.js (HTML canvas), which doesn't run in React Native.

**For React Native projects**, use the headless core for data processing:

```ts
import { fromOpenF1Telemetry, TEAM_COLORS, computeTimeDelta } from "f1-telemetry-js/core";
```

Then render visuals with a React Native charting library (`victory-native`, `react-native-chart-kit`, or `react-native-skia`).

## Vue.js

Use the headless core for data processing in Vue apps:

```ts
import { fromCsvTelemetry, formatTelemetry, TEAM_COLORS } from "f1-telemetry-js/core";
```

Pair with Vue charting libraries like `vue-chartjs` or ECharts wrappers.

## Svelte / SvelteKit

Use the headless core for data processing:

```ts
import { fromFastF1Telemetry, computeLapTimes, TRACKS } from "f1-telemetry-js/core";
```

Pair with a Svelte charting library such as `layercake` or `pancake`.

## Development

```bash
npm run lint
npm run test:run
npm run build
npm run api:check
npm run storybook
```
