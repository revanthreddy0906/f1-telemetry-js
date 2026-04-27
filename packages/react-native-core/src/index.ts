import type { FormattedTelemetry } from "f1-telemetry-js/core";

export * from "f1-telemetry-js/core";

export interface ReactNativeTelemetryPoint {
  x: number;
  y: number;
  speed: number;
}

export const toReactNativeTrackSeries = (telemetry: FormattedTelemetry): ReactNativeTelemetryPoint[] =>
  telemetry.time.map((_, index) => ({
    x: telemetry.x[index] ?? 0,
    y: telemetry.y[index] ?? 0,
    speed: telemetry.speed[index] ?? 0
  }));
