import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryPanelExtension } from "../../types/telemetry";

const average = (values: number[]): number =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const sectorPaceEvolutionPanel: TelemetryPanelExtension = {
  id: "f1-telemetry-sector-pace-evolution",
  title: "Sector Pace Evolution",
  order: 140,
  channels: ["sector-pace"],
  contextMenuActions: [
    {
      id: "publish-sector-pace",
      label: "Publish pace",
      onSelect: (context) => {
        const sectorMarkers = context.sectorMarkers ?? [];
        context.shared.publish("sector-pace", {
          sectors: Math.max(1, sectorMarkers.length + 1)
        });
      }
    }
  ],
  render: ({ telemetry, comparison, sectorMarkers, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const markers = [...(sectorMarkers ?? [])].sort((left, right) => left - right);
    const bounds = [telemetry.time[0] ?? 0, ...markers, telemetry.time[telemetry.time.length - 1] ?? 0];
    const sectors = Array.from({ length: Math.max(1, bounds.length - 1) }, (_, index) => {
      const start = bounds[index];
      const end = bounds[index + 1];
      const primaryValues = telemetry.speed.filter((_, sampleIndex) => {
        const time = telemetry.time[sampleIndex];
        return time >= start && time <= end;
      });
      const comparisonValues = comparison
        ? comparison.speed.filter((_, sampleIndex) => {
            const time = comparison.time[sampleIndex];
            return time >= start && time <= end;
          })
        : [];
      const primaryAvg = average(primaryValues);
      const comparisonAvg = average(comparisonValues);
      return {
        sector: index + 1,
        primaryAvg,
        comparisonAvg,
        delta: comparison ? primaryAvg - comparisonAvg : null
      };
    });

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
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Sector Pace Evolution</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingBottom: 6 }}>Sector</th>
              <th style={{ textAlign: "right", paddingBottom: 6 }}>Primary</th>
              {comparison ? <th style={{ textAlign: "right", paddingBottom: 6 }}>Comparison</th> : null}
              {comparison ? <th style={{ textAlign: "right", paddingBottom: 6 }}>Delta</th> : null}
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr key={`sector-${sector.sector}`}>
                <td style={{ padding: "6px 0", color: palette.mutedText }}>S{sector.sector}</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>{sector.primaryAvg.toFixed(1)} km/h</td>
                {comparison ? (
                  <td style={{ padding: "6px 0", textAlign: "right" }}>{sector.comparisonAvg.toFixed(1)} km/h</td>
                ) : null}
                {comparison ? (
                  <td style={{ padding: "6px 0", textAlign: "right" }}>
                    {(sector.delta ?? 0) >= 0 ? "+" : ""}
                    {(sector.delta ?? 0).toFixed(1)} km/h
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
};
