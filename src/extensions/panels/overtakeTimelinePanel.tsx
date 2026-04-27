import { resolveThemeTokens } from "../../components/chartTheme";
import type { TelemetryEvent, TelemetryPanelExtension } from "../../types/telemetry";

const normalizeEvent = (event: TelemetryEvent): { time: number; label: string } => ({
  time: event.time,
  label: event.description ?? event.type
});

const inferOvertakes = (
  primaryTime: number[],
  primarySpeed: number[],
  comparisonSpeed: number[]
): Array<{ time: number; label: string }> => {
  const inferred: Array<{ time: number; label: string }> = [];
  if (primaryTime.length < 2 || comparisonSpeed.length < 2) {
    return inferred;
  }

  const length = Math.min(primaryTime.length, primarySpeed.length, comparisonSpeed.length);
  for (let index = 1; index < length; index += 1) {
    const previousDelta = primarySpeed[index - 1] - comparisonSpeed[index - 1];
    const currentDelta = primarySpeed[index] - comparisonSpeed[index];
    if (previousDelta <= 0 && currentDelta > 0) {
      inferred.push({
        time: primaryTime[index],
        label: "Inferred overtake"
      });
    }
  }

  return inferred;
};

export const overtakeTimelinePanel: TelemetryPanelExtension = {
  id: "f1-telemetry-overtake-timeline",
  title: "Overtake Timeline",
  order: 150,
  channels: ["overtake-events"],
  contextMenuActions: [
    {
      id: "publish-overtake-events",
      label: "Publish events",
      onSelect: (context) => {
        const eventCount = (context.telemetry.events ?? []).filter((event) =>
          event.type.toLowerCase().includes("overtake")
        ).length;
        context.shared.publish("overtake-events", { count: eventCount });
      }
    }
  ],
  render: ({ telemetry, comparison, theme, styleTokens }) => {
    const palette = resolveThemeTokens(theme, styleTokens);
    const explicitEvents = (telemetry.events ?? [])
      .filter((event) => event.type.toLowerCase().includes("overtake") || event.type.toLowerCase().includes("pass"))
      .map(normalizeEvent);
    const inferredEvents =
      explicitEvents.length === 0 && comparison
        ? inferOvertakes(telemetry.time, telemetry.speed, comparison.speed)
        : [];
    const events = explicitEvents.length > 0 ? explicitEvents : inferredEvents;

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
        <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Overtake Timeline</h4>
        {events.length > 0 ? (
          <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, fontSize: 13 }}>
            {events.map((event, index) => (
              <li key={`overtake-${event.time}-${index}`}>
                <strong style={{ marginRight: 6 }}>t={event.time.toFixed(2)}s</strong>
                <span style={{ color: palette.mutedText }}>{event.label}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ margin: 0, color: palette.mutedText, fontSize: 13 }}>
            No explicit overtake events were found in this telemetry session.
          </p>
        )}
      </section>
    );
  }
};
