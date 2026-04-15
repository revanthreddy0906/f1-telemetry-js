# f1-telemetry-js

Reusable React + TypeScript component library for visualizing Formula 1 telemetry data with modern, responsive charts.

## Features

- Speed, throttle/brake, lap comparison, and track map components
- `TelemetryDashboard` composite with synchronized cursor across charts
- Lap delta mode (`driver2 - driver1`) + sector markers
- Built-in large dataset processing (windowing + downsampling)
- Theme customization via style tokens and CSS variables
- Validation utilities for telemetry integrity
- ESM + CJS + type definitions in `dist/`

## Installation

```bash
npm install f1-telemetry-js chart.js react-chartjs-2
```

## Quick usage

```tsx
import {
  SpeedChart,
  ThrottleBrakeChart,
  LapComparisonChart,
  TrackMap,
  TelemetryDashboard,
  formatTelemetry
} from "f1-telemetry-js";

const rawTelemetry = [
  { time: 0, speed: 120, throttle: 32, brake: 0, x: 10, y: 20 },
  { time: 1, speed: 160, throttle: 65, brake: 0, x: 18, y: 25 },
  { time: 2, speed: 205, throttle: 82, brake: 8, x: 28, y: 30 }
];

const telemetry = formatTelemetry(rawTelemetry);

export const TelemetryPage = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <SpeedChart data={{ time: telemetry.time, speed: telemetry.speed }} />
    <ThrottleBrakeChart time={telemetry.time} throttle={telemetry.throttle} brake={telemetry.brake} />
    <LapComparisonChart
      driver1={{ time: telemetry.time, speed: telemetry.speed, label: "Driver 1" }}
      driver2={{ time: telemetry.time, speed: telemetry.speed.map((v) => v - 5), label: "Driver 2" }}
    />
    <TrackMap x={telemetry.x} y={telemetry.y} time={telemetry.time} />
    <TelemetryDashboard
      telemetry={telemetry}
      comparison={{ time: telemetry.time, speed: telemetry.speed.map((v) => v - 4), label: "Driver 2" }}
      lapMode="delta"
      sectorMarkers={[12.8, 25.5, 41.2]}
      processing={{ maxPoints: 600, downsampleStrategy: "min-max" }}
    />
  </div>
);
```

## Demo snippet

```tsx
import { TelemetryDashboard } from "f1-telemetry-js";

const telemetry = {
  time: [0, 1, 2, 3, 4],
  speed: [120, 140, 190, 225, 210],
  throttle: [20, 45, 88, 95, 70],
  brake: [0, 0, 4, 0, 25],
  x: [10, 20, 35, 42, 54],
  y: [15, 24, 33, 28, 22]
};

export function App() {
  return (
    <TelemetryDashboard
      telemetry={telemetry}
      comparison={{ time: telemetry.time, speed: telemetry.speed.map((s) => s - 8), label: "LEC" }}
      lapMode="overlay"
      theme="dark"
      processing={{ maxPoints: 300 }}
      sectorMarkers={[1.4, 2.9, 4.1]}
    />
  );
}
```

## Props overview

All chart components share:

| Prop | Type | Description |
| --- | --- | --- |
| `theme` | `"dark" \| "light"` | Selects default theme |
| `styleTokens` | `Partial<TelemetryStyleTokens>` | Per-component token overrides |
| `processing` | `DataProcessingOptions` | `{ maxPoints, downsampleStrategy, window }` |
| `showCursor` | `boolean` | Toggle shared cursor line/marker |
| `cursorTime` | `number \| null` | External synchronized cursor time |
| `onCursorTimeChange` | `(time) => void` | Cursor sync callback |
| `height` | `number` | Card height |
| `title` | `string` | Chart title |
| `className` | `string` | Optional wrapper class |

### `SpeedChart`

| Prop | Type | Required |
| --- | --- | --- |
| `time` | `number[]` | Yes* |
| `speed` | `number[]` | Yes* |
| `data` | `{ time: number[]; speed: number[] }` | No |

\*Use either `time` + `speed`, or `data`.

### `ThrottleBrakeChart`

| Prop | Type | Required |
| --- | --- | --- |
| `time` | `number[]` | Yes |
| `throttle` | `number[]` | Yes |
| `brake` | `number[]` | Yes |

### `LapComparisonChart`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `driver1` | `{ time, speed, label?, color? }` | Yes | First driver series |
| `driver2` | `{ time, speed, label?, color? }` | Yes | Second driver series |
| `mode` | `"overlay" \| "delta"` | No | Delta = `driver2 - driver1` |
| `sectorMarkers` | `number[]` | No | Vertical sector reference lines |
| `deltaLabel` | `string` | No | Custom label for delta dataset |

### `TrackMap`

| Prop | Type | Required |
| --- | --- | --- |
| `x` | `number[]` | Yes |
| `y` | `number[]` | Yes |
| `time` | `number[]` | No |

### `TelemetryDashboard`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `telemetry` | `FormattedTelemetry` | Yes | Main telemetry payload |
| `comparison` | `DriverLapTelemetry` | No | Driver 2 for lap chart |
| `lapMode` | `"overlay" \| "delta"` | No | Lap chart mode |
| `sectorMarkers` | `number[]` | No | Sector markers in lap chart |
| `syncCursor` | `boolean` | No | Sync hover cursor across all charts |
| `chartHeight` | `number` | No | Height for line charts |
| `trackMapHeight` | `number` | No | Height for track map |

## Utility functions

### `formatTelemetry(data)`

Converts raw telemetry JSON into:

```ts
{
  time: number[];
  speed: number[];
  throttle: number[];
  brake: number[];
  x: number[];
  y: number[];
}
```

Supported raw shapes:
1. Array of telemetry points
2. Object containing telemetry arrays
3. Object with nested arrays (`telemetry`, `data`, `samples`, `points`, etc.)

### `validateTelemetry(data)`

Returns:

```ts
{
  isValid: boolean;
  issues: Array<{ code: string; message: string }>;
}
```

### `processSeriesData({ time, seriesMap, processing })`

Processes telemetry for chart rendering:
- sanitizes values
- trims mismatched lengths
- applies time window filtering
- downsamples with `every-nth` or `min-max`

## Theme customization

You can override tokens globally using CSS variables:

```css
:root {
  --f1-telemetry-background: #0a0f1f;
  --f1-telemetry-primary: #5db8ff;
  --f1-telemetry-accent: #43d9a3;
}
```

Or generate inline CSS variables with:

```ts
import { createTelemetryCssVariables } from "f1-telemetry-js";

const style = createTelemetryCssVariables({ primary: "#3fa9f5", danger: "#f5537b" });
```

## Storybook

```bash
npm run storybook
```

Stories include telemetry-heavy examples, theme toggle toolbar, and dashboard variants.

## Testing

```bash
npm run test:run
```

Includes utility validation/format tests and component render tests.

## CI/CD and releases

- `CI` workflow runs lint, tests, and build on PRs/pushes.
- `Release` workflow uses Changesets to generate changelog entries and publish to npm when release changes are merged to `main`.
