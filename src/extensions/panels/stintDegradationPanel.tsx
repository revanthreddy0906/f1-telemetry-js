import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryPanelExtension } from "../../types/telemetry";

const average = (values: number[]): number =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const splitIntoStints = (values: number[]): [number[], number[], number[]] => {
  if (values.length === 0) {
    return [[], [], []];
  }
  const third = Math.max(1, Math.floor(values.length / 3));
  return [
    values.slice(0, third),
    values.slice(third, third * 2),
    values.slice(third * 2)
  ];
};

export const stintDegradationPanel: TelemetryPanelExtension = {
  id: "f1-telemetry-stint-degradation",
  title: "Stint Degradation",
  order: 130,
  channels: ["degradation-summary"],
  onMount: (context) => {
    context.shared.publish("degradation-summary", {
      samples: context.telemetry.speed.length
    });
  },
  contextMenuActions: [
    {
      id: "publish-stint-samples",
      label: "Publish samples",
      onSelect: (context) => {
        context.shared.publish("degradation-summary", {
          samples: context.telemetry.speed.length
        });
      }
    }
  ],
  render: ({ telemetry, comparison, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const [early, mid, late] = splitIntoStints(telemetry.speed);
    const earlyAvg = average(early);
    const midAvg = average(mid);
    const lateAvg = average(late);
    const degradation = earlyAvg > 0 ? ((earlyAvg - lateAvg) / earlyAvg) * 100 : 0;

    const [comparisonEarly, comparisonMid, comparisonLate] = splitIntoStints(comparison?.speed ?? []);

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
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Stint Degradation</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Early stint avg speed</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{earlyAvg.toFixed(1)} km/h</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Mid stint avg speed</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{midAvg.toFixed(1)} km/h</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Late stint avg speed</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{lateAvg.toFixed(1)} km/h</td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: palette.mutedText }}>Degradation</td>
              <td style={{ padding: "6px 0", textAlign: "right" }}>{degradation.toFixed(2)}%</td>
            </tr>
            {comparison ? (
              <tr>
                <td style={{ padding: "6px 0", color: palette.mutedText }}>Comparison late stint avg</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>
                  {average(comparisonLate).toFixed(1)} km/h ({comparison.label ?? "Comparison"})
                </td>
              </tr>
            ) : null}
            {comparison && comparisonEarly.length > 0 && comparisonMid.length > 0 ? (
              <tr>
                <td style={{ padding: "6px 0", color: palette.mutedText }}>Comparison early/mid avg</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>
                  {average(comparisonEarly).toFixed(1)} / {average(comparisonMid).toFixed(1)} km/h
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    );
  }
};
