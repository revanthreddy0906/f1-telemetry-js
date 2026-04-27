import type { FormattedTelemetry } from "f1-telemetry-js/core";

export * from "f1-telemetry-js/core";

export interface VueTelemetryState {
  telemetry: FormattedTelemetry | null;
  isLoading: boolean;
  error: Error | null;
}

export const createVueTelemetryState = (): VueTelemetryState => ({
  telemetry: null,
  isLoading: false,
  error: null
});
