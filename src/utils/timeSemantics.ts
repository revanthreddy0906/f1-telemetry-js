import type { FormattedTelemetry, TelemetryTimeReference } from "../types/telemetry";

const round = (value: number): number => Number(value.toFixed(6));

export interface NormalizeTelemetryTimeOptions {
  timeReference?: TelemetryTimeReference;
}

/**
 * Normalize telemetry time arrays/events into a consistent relative timeline.
 */
export const normalizeTelemetryTime = (
  telemetry: FormattedTelemetry,
  options: NormalizeTelemetryTimeOptions = {}
): FormattedTelemetry => {
  const timeReference = options.timeReference ?? telemetry.timeReference ?? "session";
  if (telemetry.time.length === 0) {
    return {
      ...telemetry,
      timeReference
    };
  }

  const baseline = telemetry.time[0];
  const normalizedTime = telemetry.time.map((value) => round(value - baseline));
  const normalizedEvents = telemetry.events?.map((event) => ({
    ...event,
    time: round(event.time - baseline),
    timeReference
  }));

  return {
    ...telemetry,
    time: normalizedTime,
    events: normalizedEvents,
    timeReference
  };
};
