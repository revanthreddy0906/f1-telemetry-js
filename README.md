# f1-telemetry-js

Reusable React + TypeScript component library for visualizing Formula 1 telemetry data (speed, throttle, brake, lap comparisons, and track maps) with Chart.js.

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
  formatTelemetry
} from "f1-telemetry-js";

const rawTelemetry = [
  { time: 0, speed: 120, throttle: 32, brake: 0, x: 10, y: 20 },
  { time: 1, speed: 160, throttle: 65, brake: 0, x: 18, y: 25 },
  { time: 2, speed: 205, throttle: 82, brake: 8, x: 28, y: 30 }
];

const telemetry = formatTelemetry(rawTelemetry);

export const TelemetryDashboard = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <SpeedChart data={telemetry} />
    <ThrottleBrakeChart
      time={telemetry.time}
      throttle={telemetry.throttle}
      brake={telemetry.brake}
      theme="dark"
    />
    <LapComparisonChart
      driver1={{ time: telemetry.time, speed: telemetry.speed, label: "Driver 1" }}
      driver2={{ time: telemetry.time, speed: telemetry.speed.map((v) => v - 5), label: "Driver 2" }}
    />
    <TrackMap x={telemetry.x} y={telemetry.y} />
  </div>
);
```

> `theme="dark"` is the default for all components. Use `theme="light"` when needed.

## Demo snippet

```tsx
import { SpeedChart, ThrottleBrakeChart, LapComparisonChart, TrackMap } from "f1-telemetry-js";

const time = [0, 1, 2, 3, 4];
const speed = [120, 140, 190, 225, 210];
const throttle = [20, 45, 88, 95, 70];
const brake = [0, 0, 4, 0, 25];
const x = [10, 20, 35, 42, 54];
const y = [15, 24, 33, 28, 22];

export function App() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <SpeedChart time={time} speed={speed} />
      <ThrottleBrakeChart time={time} throttle={throttle} brake={brake} />
      <LapComparisonChart
        driver1={{ time, speed, label: "VER" }}
        driver2={{ time, speed: speed.map((value) => value - 8), label: "LEC" }}
      />
      <TrackMap x={x} y={y} />
    </div>
  );
}
```

## API

### `SpeedChart`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `time` | `number[]` | Yes* | Time values in seconds (`data` alternative supported) |
| `speed` | `number[]` | Yes* | Speed values in km/h (`data` alternative supported) |
| `data` | `{ time: number[]; speed: number[] }` | No | Optional shorthand data prop for SpeedChart |
| `theme` | `"dark" \| "light"` | No | Chart theme (`"dark"` default) |
| `height` | `number` | No | Card height in pixels (`320` default) |
| `title` | `string` | No | Title shown above chart |
| `className` | `string` | No | Optional wrapper class |

\*Use either `time` + `speed`, or `data`.

### `ThrottleBrakeChart`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `time` | `number[]` | Yes | Time values in seconds |
| `throttle` | `number[]` | Yes | Throttle values in percentage |
| `brake` | `number[]` | Yes | Brake values in percentage |
| `theme` | `"dark" \| "light"` | No | Chart theme (`"dark"` default) |
| `height` | `number` | No | Card height in pixels (`320` default) |
| `title` | `string` | No | Title shown above chart |
| `className` | `string` | No | Optional wrapper class |

### `LapComparisonChart`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `driver1` | `{ time: number[]; speed: number[]; label?: string; color?: string }` | Yes | First driver telemetry series |
| `driver2` | `{ time: number[]; speed: number[]; label?: string; color?: string }` | Yes | Second driver telemetry series |
| `driver1Label` | `string` | No | Label override for `driver1` |
| `driver2Label` | `string` | No | Label override for `driver2` |
| `theme` | `"dark" \| "light"` | No | Chart theme (`"dark"` default) |
| `height` | `number` | No | Card height in pixels (`320` default) |
| `title` | `string` | No | Title shown above chart |
| `className` | `string` | No | Optional wrapper class |

### `TrackMap`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | `number[]` | Yes | X track coordinates |
| `y` | `number[]` | Yes | Y track coordinates |
| `theme` | `"dark" \| "light"` | No | Chart theme (`"dark"` default) |
| `height` | `number` | No | Card height in pixels (`360` default) |
| `title` | `string` | No | Title shown above chart |
| `className` | `string` | No | Optional wrapper class |

### `formatTelemetry(data)`

Converts raw telemetry into:

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

Supported raw inputs:
1. Array of telemetry points
2. Object containing telemetry arrays
3. Object with nested array fields such as `telemetry`, `data`, `samples`, or `points`
