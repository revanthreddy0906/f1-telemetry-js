import type { FormattedTelemetry } from "f1-telemetry-js/core";

export * from "f1-telemetry-js/core";

export interface SvelteTelemetryState {
  telemetry: FormattedTelemetry | null;
  isLoading: boolean;
  error: Error | null;
}

export const createSvelteTelemetryState = (): SvelteTelemetryState => ({
  telemetry: null,
  isLoading: false,
  error: null
});
