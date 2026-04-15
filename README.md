# @revanthreddy0906/f1-telemetry-js

Reusable React + TypeScript component library for Formula 1 telemetry visualization.

## Highlights

- Built-in charts: speed, throttle/brake, lap comparison, track map
- `TelemetryDashboard` with synchronized cross-chart cursor
- Annotation overlays (`corner`, `drs`, `incident`)
- Plugin-style dashboard extension API
- FastF1, OpenF1, and CSV adapters
- SSR-safe lazy chart rendering for Next.js
- Accessibility upgrades: ARIA labels, keyboard focus, high-contrast theme
- Large dataset processing + CI performance benchmark guardrails
- Changeset + API diff semver guardrails

## Installation

```bash
npm install f1-telemetry-js chart.js react-chartjs-2
```

## Quick usage

```tsx
import { TelemetryDashboard, fromCsvTelemetry } from "@revanthreddy0906/f1-telemetry-js";

const telemetry = fromCsvTelemetry(`time,speed,throttle,brake,x,y
0,122,28,0,12,8
1,150,55,0,18,12
2,188,80,4,24,16
3,215,92,0,30,18`);

export function App() {
  return (
    <TelemetryDashboard
      telemetry={telemetry}
      lapMode="delta"
      annotations={[
        { type: "corner", time: 1.2, label: "T1" },
        { type: "drs", time: 2.3, label: "DRS" },
        { type: "incident", time: 2.8, label: "Lock-up" }
      ]}
      processing={{ maxPoints: 500, downsampleStrategy: "min-max" }}
    />
  );
}
```

## Adapters

```ts
import { fromFastF1Telemetry, fromOpenF1Telemetry, fromCsvTelemetry } from "@revanthreddy0906/f1-telemetry-js";

const telemetryA = fromFastF1Telemetry(fastF1Payload);
const telemetryB = fromOpenF1Telemetry(openF1Payload);
const telemetryC = fromCsvTelemetry(csvText);
```

## Plugin extension API

```ts
import { registerTelemetryPanel } from "@revanthreddy0906/f1-telemetry-js";

registerTelemetryPanel({
  id: "custom-energy-panel",
  order: 100,
  render: ({ telemetry, theme }) => (
    <div style={{ padding: 16, borderRadius: 12 }}>
      <h4>Energy usage ({theme})</h4>
      <p>Samples: {telemetry.time.length}</p>
    </div>
  )
});
```

You can also pass per-instance dashboard extensions with the `extensions` prop.

## Core components

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

Common chart props:

| Prop | Description |
| --- | --- |
| `theme` | `"dark" \| "light" \| "high-contrast"` |
| `ariaLabel` | Accessible chart label |
| `annotations` | Annotation overlays |
| `processing` | Windowing/downsampling config |
| `showCursor`, `cursorTime`, `onCursorTimeChange` | Cursor synchronization |
| `styleTokens` | Theme token overrides |

## Annotation overlays

`annotations` accepts:

```ts
type TelemetryAnnotation = {
  type: "corner" | "drs" | "incident";
  time?: number;
  x?: number;
  y?: number;
  label?: string;
  severity?: "low" | "medium" | "high";
  color?: string;
};
```

Line charts use `time`; track maps support `time` or direct `x/y`.

## SSR-safe rendering (Next.js)

Charts render through a client-side lazy loader internally, so server rendering avoids direct chart hydration issues.

See template: `examples/next-template/`.

## Theme customization

You can override via `styleTokens` or CSS variables:

```css
:root {
  --f1-telemetry-primary: #5db8ff;
  --f1-telemetry-accent: #42e2a8;
  --f1-telemetry-focus-ring: 0 0 0 3px rgba(93, 184, 255, 0.5);
}
```

## Utility APIs

- `formatTelemetry(data)`
- `validateTelemetry(data)`
- `processSeriesData({ ... })`
- `findNearestIndex(values, target)`
- `createLineAnnotationDatasets(...)`
- `createTrackAnnotationDataset(...)`

## Examples

- `examples/vite-template`
- `examples/next-template`

## Development commands

```bash
npm run lint
npm run test:run
npm run build
npm run storybook
npm run benchmark
```

## Semver guardrails

- `npm run semver:changeset` validates releasable changes include a changeset.
- `npm run api:check` verifies public API matches `api/public-api.d.ts`.
- `npm run api:update` refreshes API baseline intentionally.

CI enforces these checks before release workflows proceed.
