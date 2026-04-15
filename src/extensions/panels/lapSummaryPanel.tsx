import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryPanelExtension } from "../../types/telemetry";

const safeAverage = (values: number[]): number =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const lapSummaryPanel: TelemetryPanelExtension = {
  id: "f1-telemetry-lap-summary",
  order: 120,
  render: ({ telemetry, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const bestSpeed = telemetry.speed.length > 0 ? Math.max(...telemetry.speed) : 0;
    const worstSpeed = telemetry.speed.length > 0 ? Math.min(...telemetry.speed) : 0;
    const avgThrottle = safeAverage(telemetry.throttle);
    const avgBrake = safeAverage(telemetry.brake);

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
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Lap Summary</h4>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Best speed</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{bestSpeed.toFixed(1)} km/h</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Worst speed</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{worstSpeed.toFixed(1)} km/h</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Throttle</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{avgThrottle.toFixed(1)}%</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Brake</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{avgBrake.toFixed(1)}%</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Samples</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{telemetry.time.length}</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
};
