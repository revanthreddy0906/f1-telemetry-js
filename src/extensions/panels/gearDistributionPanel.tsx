import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryPanelExtension } from "../../types/telemetry";

const bands = [
  { label: "0-25%", min: 0, max: 25 },
  { label: "26-50%", min: 26, max: 50 },
  { label: "51-75%", min: 51, max: 75 },
  { label: "76-100%", min: 76, max: 100 }
];

const getBandCount = (values: number[], min: number, max: number): number =>
  values.filter((value) => value >= min && value <= max).length;

export const gearDistributionPanel: TelemetryPanelExtension = {
  id: "f1-telemetry-gear-distribution",
  order: 110,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const counts = bands.map((band) => ({
      ...band,
      count: getBandCount(telemetry.throttle, band.min, band.max)
    }));
    const total = Math.max(1, telemetry.throttle.length);

    return (
      <section
        style={{
          borderRadius: 14,
          border: `1px solid ${palette.border}`,
          background: palette.background,
          color: palette.text,
          boxShadow: palette.shadow,
          padding: 16
        }}
      >
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Throttle Distribution</h4>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: palette.mutedText }}>
          Placeholder distribution panel for gear analytics contexts.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {counts.map((band, index) => {
            const width = Math.max(4, (band.count / total) * 100);
            return (
              <div key={band.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{band.label}</span>
                  <span style={{ fontSize: 12, color: palette.mutedText }}>
                    {((band.count / total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    borderRadius: 999,
                    background: palette.primarySoft
                  }}
                >
                  <div
                    style={{
                      width: `${width}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: index % 2 === 0 ? palette.primary : palette.accent
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
};
