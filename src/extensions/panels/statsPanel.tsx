import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryPanelExtension } from "../../types/telemetry";
import type { CSSProperties } from "react";

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12
};

const statLabelStyle: CSSProperties = {
  fontSize: 12,
  margin: 0
};

const statValueStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 18,
  fontWeight: 700
};

const safeAverage = (values: number[]): number =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const telemetryStatsPanel: TelemetryPanelExtension = {
  id: "f1-telemetry-stats",
  order: 100,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const topSpeed = telemetry.speed.length > 0 ? Math.max(...telemetry.speed) : 0;
    const avgSpeed = safeAverage(telemetry.speed);
    const avgThrottle = safeAverage(telemetry.throttle);
    const maxBrake = telemetry.brake.length > 0 ? Math.max(...telemetry.brake) : 0;

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
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Telemetry Stats</h4>
        <div style={statGridStyle}>
          <div>
            <p style={statLabelStyle}>Top speed</p>
            <p style={statValueStyle}>{topSpeed.toFixed(1)} km/h</p>
          </div>
          <div>
            <p style={statLabelStyle}>Average speed</p>
            <p style={statValueStyle}>{avgSpeed.toFixed(1)} km/h</p>
          </div>
          <div>
            <p style={statLabelStyle}>Average throttle</p>
            <p style={statValueStyle}>{avgThrottle.toFixed(1)}%</p>
          </div>
          <div>
            <p style={statLabelStyle}>Max brake</p>
            <p style={statValueStyle}>{maxBrake.toFixed(1)}%</p>
          </div>
        </div>
      </section>
    );
  }
};
