import { useMemo, useState, type CSSProperties } from "react";
import type {
  DataProcessingOptions,
  FormattedTelemetry,
  TelemetryStyleTokens,
  ThemeMode
} from "../types/telemetry";
import { fromCsvTelemetry } from "../adapters/csv";
import { validateTelemetry } from "../utils/validation";
import { resolveThemeTokens } from "./chartTheme";
import { SpeedChart } from "./SpeedChart";
import { ThrottleBrakeChart } from "./ThrottleBrakeChart";
import { TrackMap } from "./TrackMap";
import { TelemetryDashboard } from "./TelemetryDashboard";
import { TelemetryCard } from "./TelemetryCard";

type PlaygroundChart = "speed" | "throttleBrake" | "trackMap" | "dashboard";

export interface TelemetryPlaygroundProps {
  theme?: ThemeMode;
  styleTokens?: Partial<TelemetryStyleTokens>;
  className?: string;
  defaultCsv?: string;
  charts?: PlaygroundChart[];
  chartHeight?: number;
  processing?: DataProcessingOptions;
  onTelemetryParsed?: (telemetry: FormattedTelemetry) => void;
  title?: string;
  ariaLabel?: string;
}

const EXAMPLE_ROWS = 60;
const EXAMPLE_CSV = (() => {
  const rows = ["time,speed,throttle,brake,x,y"];
  for (let index = 0; index < EXAMPLE_ROWS; index += 1) {
    const time = index * 0.18;
    const phase = index / 7.5;
    const speed = 205 + Math.sin(phase) * 42 - (index % 18 > 12 ? 55 : 0);
    const throttle = Math.max(0, Math.min(100, 70 + Math.sin(phase * 1.8) * 35 - (index % 18 > 12 ? 45 : 0)));
    const brake = index % 18 > 12 ? Math.max(0, Math.min(100, 62 + Math.cos(phase * 1.2) * 20)) : 0;
    const x = Math.cos(time / 1.6) * 165 + Math.sin(time / 0.85) * 24;
    const y = Math.sin(time / 1.6) * 108 + Math.cos(time / 0.72) * 18;
    rows.push(
      [
        time.toFixed(3),
        speed.toFixed(3),
        throttle.toFixed(3),
        brake.toFixed(3),
        x.toFixed(3),
        y.toFixed(3)
      ].join(",")
    );
  }
  return rows.join("\n");
})();

const controlButtonStyle = (palette: TelemetryStyleTokens): CSSProperties => ({
  border: `1px solid ${palette.border}`,
  background: palette.primarySoft,
  color: palette.text,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer"
});

/**
 * CSV playground that parses telemetry and previews charts instantly.
 */
export const TelemetryPlayground = ({
  theme = "dark",
  styleTokens,
  className,
  defaultCsv = EXAMPLE_CSV,
  charts = ["speed", "throttleBrake", "trackMap"],
  chartHeight = 260,
  processing,
  onTelemetryParsed,
  title = "Telemetry Playground",
  ariaLabel
}: TelemetryPlaygroundProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const [csvText, setCsvText] = useState(defaultCsv);
  const [telemetry, setTelemetry] = useState<FormattedTelemetry | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const parseCsv = () => {
    const parsed = fromCsvTelemetry(csvText);
    const validation = validateTelemetry(parsed, "TelemetryPlayground");

    if (!validation.isValid) {
      setTelemetry(null);
      setValidationErrors(validation.issues.map((issue) => issue.message));
      return;
    }

    setValidationErrors([]);
    setTelemetry(parsed);
    onTelemetryParsed?.(parsed);
  };

  const loadExample = () => {
    setCsvText(EXAMPLE_CSV);
    setValidationErrors([]);
  };

  const chartGridStyle = useMemo<CSSProperties>(
    () => ({
      display: "grid",
      gap: 12,
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
    }),
    []
  );

  const containerHeight = Math.max(640, chartHeight * (charts.includes("dashboard") ? 3 : 2));

  return (
    <TelemetryCard
      theme={theme}
      height={containerHeight}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Telemetry CSV playground"
    >
      <div style={{ height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 12 }}>
        <textarea
          aria-label="Telemetry CSV input"
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: 160,
            resize: "vertical",
            borderRadius: 10,
            border: `1px solid ${palette.border}`,
            background: palette.background,
            color: palette.text,
            padding: 12,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 12
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={parseCsv} style={controlButtonStyle(palette)}>
            Parse
          </button>
          <button type="button" onClick={loadExample} style={controlButtonStyle(palette)}>
            Load Example
          </button>
        </div>
        <div style={{ overflow: "auto", paddingRight: 4 }}>
          {validationErrors.length > 0 ? (
            <div
              role="alert"
              style={{
                borderRadius: 10,
                border: `1px solid ${palette.danger}`,
                background: palette.primarySoft,
                color: palette.text,
                padding: 12,
                marginBottom: 12
              }}
            >
              <strong style={{ display: "block", marginBottom: 8 }}>Unable to parse CSV:</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {validationErrors.map((message, index) => (
                  <li key={`${message}-${index}`}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {telemetry ? (
            <div style={chartGridStyle}>
              {charts.includes("speed") ? (
                <SpeedChart
                  time={telemetry.time}
                  speed={telemetry.speed}
                  theme={theme}
                  styleTokens={styleTokens}
                  processing={processing}
                  height={chartHeight}
                />
              ) : null}
              {charts.includes("throttleBrake") ? (
                <ThrottleBrakeChart
                  time={telemetry.time}
                  throttle={telemetry.throttle}
                  brake={telemetry.brake}
                  theme={theme}
                  styleTokens={styleTokens}
                  processing={processing}
                  height={chartHeight}
                />
              ) : null}
              {charts.includes("trackMap") ? (
                <TrackMap
                  x={telemetry.x}
                  y={telemetry.y}
                  time={telemetry.time}
                  theme={theme}
                  styleTokens={styleTokens}
                  processing={processing}
                  height={chartHeight}
                />
              ) : null}
              {charts.includes("dashboard") ? (
                <div style={{ gridColumn: "1 / -1" }}>
                  <TelemetryDashboard
                    telemetry={telemetry}
                    theme={theme}
                    styleTokens={styleTokens}
                    processing={processing}
                    chartHeight={chartHeight}
                    trackMapHeight={chartHeight}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <p style={{ color: palette.mutedText, margin: 0 }}>
              Paste CSV data and click <strong>Parse</strong> to preview telemetry charts.
            </p>
          )}
        </div>
      </div>
    </TelemetryCard>
  );
};
