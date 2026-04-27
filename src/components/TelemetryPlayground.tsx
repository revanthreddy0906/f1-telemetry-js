import { useMemo, useState, type CSSProperties } from "react";
import type {
  DataProcessingOptions,
  FormattedTelemetry,
  TelemetrySeriesKey,
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
  showImportWizard?: boolean;
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

const TELEMETRY_FIELDS: TelemetrySeriesKey[] = ["time", "speed", "throttle", "brake", "x", "y"];

const controlButtonStyle = (palette: TelemetryStyleTokens): CSSProperties => ({
  border: `1px solid ${palette.border}`,
  background: palette.primarySoft,
  color: palette.text,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer"
});

const parseSimpleCsv = (csvText: string): string[][] =>
  csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.split(",").map((entry) => entry.trim()));

const toNumber = (value: string): number | null => {
  if (value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

interface MappingTransformResult {
  csv: string;
  previewRows: string[][];
  issues: string[];
}

const applyMappingTransform = (
  csvText: string,
  fieldMapping: Record<TelemetrySeriesKey, string>,
  options: {
    normalizeTime: boolean;
    clampInputs: boolean;
  }
): MappingTransformResult => {
  const table = parseSimpleCsv(csvText);
  if (table.length < 2) {
    return {
      csv: "time,speed,throttle,brake,x,y",
      previewRows: [],
      issues: ['CSV must include a header row and at least one sample row for wizard mapping.']
    };
  }

  const [headers, ...rows] = table;
  const headerIndex = new Map(headers.map((header, index) => [header, index]));
  const issues: string[] = [];

  TELEMETRY_FIELDS.forEach((field) => {
    const selectedHeader = fieldMapping[field];
    if (!selectedHeader || !headerIndex.has(selectedHeader)) {
      issues.push(`Map "${field}" to a valid CSV column.`);
    }
  });

  const mappedRows = rows.map((row) => {
    const mapped: Record<TelemetrySeriesKey, string> = {
      time: "",
      speed: "",
      throttle: "",
      brake: "",
      x: "",
      y: ""
    };
    TELEMETRY_FIELDS.forEach((field) => {
      const selectedHeader = fieldMapping[field];
      const selectedIndex = selectedHeader ? headerIndex.get(selectedHeader) : undefined;
      mapped[field] = selectedIndex === undefined ? "" : row[selectedIndex] ?? "";
    });
    return mapped;
  });

  if (options.normalizeTime) {
    const firstTime = mappedRows.map((row) => toNumber(row.time)).find((value): value is number => value !== null);
    if (firstTime !== undefined) {
      mappedRows.forEach((row) => {
        const time = toNumber(row.time);
        if (time !== null) {
          row.time = (time - firstTime).toFixed(6);
        }
      });
    }
  }

  if (options.clampInputs) {
    mappedRows.forEach((row) => {
      const throttle = toNumber(row.throttle);
      const brake = toNumber(row.brake);
      if (throttle !== null) {
        row.throttle = Math.max(0, Math.min(100, throttle)).toFixed(6);
      }
      if (brake !== null) {
        row.brake = Math.max(0, Math.min(100, brake)).toFixed(6);
      }
    });
  }

  const outputRows = [
    "time,speed,throttle,brake,x,y",
    ...mappedRows.map((row) => TELEMETRY_FIELDS.map((field) => row[field]).join(","))
  ];

  return {
    csv: outputRows.join("\n"),
    previewRows: mappedRows.slice(0, 5).map((row) => TELEMETRY_FIELDS.map((field) => row[field])),
    issues
  };
};

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
  ariaLabel,
  showImportWizard = true
}: TelemetryPlaygroundProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);
  const [csvText, setCsvText] = useState(defaultCsv);
  const [telemetry, setTelemetry] = useState<FormattedTelemetry | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [normalizeTime, setNormalizeTime] = useState(true);
  const [clampInputs, setClampInputs] = useState(true);

  const headers = useMemo(() => {
    const [firstRow] = parseSimpleCsv(csvText);
    return firstRow ?? [];
  }, [csvText]);

  const [fieldMapping, setFieldMapping] = useState<Record<TelemetrySeriesKey, string>>({
    time: "time",
    speed: "speed",
    throttle: "throttle",
    brake: "brake",
    x: "x",
    y: "y"
  });

  const mappingTransform = useMemo(
    () => applyMappingTransform(csvText, fieldMapping, { normalizeTime, clampInputs }),
    [csvText, fieldMapping, normalizeTime, clampInputs]
  );

  const parseCsv = () => {
    const parseIssues = showImportWizard ? mappingTransform.issues : [];
    if (parseIssues.length > 0) {
      setTelemetry(null);
      setValidationErrors(parseIssues);
      return;
    }

    const parsed = fromCsvTelemetry(showImportWizard ? mappingTransform.csv : csvText);
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
    setFieldMapping({
      time: "time",
      speed: "speed",
      throttle: "throttle",
      brake: "brake",
      x: "x",
      y: "y"
    });
  };

  const chartGridStyle = useMemo<CSSProperties>(
    () => ({
      display: "grid",
      gap: 12,
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
    }),
    []
  );

  const containerHeight = Math.max(760, chartHeight * (charts.includes("dashboard") ? 3 : 2));

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
      <div style={{ height: "100%", display: "grid", gridTemplateRows: "auto auto auto 1fr", gap: 12 }}>
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
        {showImportWizard ? (
          <section
            style={{
              borderRadius: 10,
              border: `1px solid ${palette.border}`,
              background: palette.background,
              padding: 12,
              display: "grid",
              gap: 10
            }}
          >
            <strong style={{ fontSize: 13 }}>Import Wizard</strong>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
              {TELEMETRY_FIELDS.map((field) => (
                <label key={field} style={{ display: "grid", gap: 4, fontSize: 12 }}>
                  <span>{field}</span>
                  <select
                    aria-label={`Map field ${field}`}
                    value={fieldMapping[field]}
                    onChange={(event) =>
                      setFieldMapping((current) => ({
                        ...current,
                        [field]: event.target.value
                      }))
                    }
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${palette.border}`,
                      background: palette.background,
                      color: palette.text,
                      padding: "6px 8px"
                    }}
                  >
                    <option value="">(unmapped)</option>
                    {headers.map((header) => (
                      <option key={`${field}-${header}`} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12 }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={normalizeTime}
                  onChange={(event) => setNormalizeTime(event.target.checked)}
                />
                Normalize time from first sample
              </label>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={clampInputs}
                  onChange={(event) => setClampInputs(event.target.checked)}
                />
                Clamp throttle/brake to 0-100
              </label>
            </div>
            <div>
              <strong style={{ fontSize: 12 }}>Preview (first 5 transformed rows)</strong>
              <div style={{ overflowX: "auto", marginTop: 6 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {TELEMETRY_FIELDS.map((field) => (
                        <th
                          key={`preview-header-${field}`}
                          style={{ textAlign: "left", padding: "4px 6px", borderBottom: `1px solid ${palette.border}` }}
                        >
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mappingTransform.previewRows.map((row, rowIndex) => (
                      <tr key={`preview-row-${rowIndex}`}>
                        {row.map((value, columnIndex) => (
                          <td
                            key={`preview-cell-${rowIndex}-${columnIndex}`}
                            style={{ padding: "4px 6px", borderBottom: `1px solid ${palette.border}` }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}
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
