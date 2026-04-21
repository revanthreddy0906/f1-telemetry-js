import type {
  AdapterName,
  AdapterParseOptions,
  FormattedTelemetry,
  TelemetryAdapterResult,
  TelemetryValidationIssue
} from "../types/telemetry";
import { validateTelemetry } from "../utils/validation";

const toDiagnostic = (issue: TelemetryValidationIssue) => ({
  code: issue.code,
  severity: issue.severity,
  message: issue.message,
  field: issue.channel
});

export const toAdapterResult = (
  adapter: AdapterName,
  telemetry: FormattedTelemetry,
  sourceSamples: number,
  options: AdapterParseOptions = {}
): TelemetryAdapterResult => {
  const validation = validateTelemetry(telemetry, `${adapter} adapter`, {
    mode: options.validationMode
  });
  const diagnostics = validation.issues.map(toDiagnostic);
  const warningCount = diagnostics.filter((entry) => entry.severity === "warning").length;
  const errorCount = diagnostics.length - warningCount;

  return {
    telemetry,
    validation,
    diagnostics: {
      adapter,
      sourceSamples,
      parsedSamples: telemetry.time.length,
      mode: validation.mode,
      errorCount,
      warningCount,
      diagnostics
    }
  };
};
