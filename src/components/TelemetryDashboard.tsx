import { useMemo, useState, type CSSProperties } from "react";
import type { TelemetryDashboardProps, TelemetryPanelExtension } from "../types/telemetry";
import { getTelemetryPanels } from "../extensions/registry";
import { LapComparisonChart } from "./LapComparisonChart";
import { SpeedChart } from "./SpeedChart";
import { ThrottleBrakeChart } from "./ThrottleBrakeChart";
import { TrackMap } from "./TrackMap";
import { createTelemetryCssVariables } from "./chartTheme";

const sortPanels = (panels: TelemetryPanelExtension[]): TelemetryPanelExtension[] =>
  panels.sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

export const TelemetryDashboard = ({
  telemetry,
  comparison,
  lapMode = "overlay",
  sectorMarkers,
  annotations,
  theme = "dark",
  styleTokens,
  processing,
  syncCursor = true,
  className,
  chartHeight = 320,
  trackMapHeight = 360,
  panelGap = 16,
  minPanelWidth = 320,
  includeDefaultPanels = true,
  extensions = []
}: TelemetryDashboardProps) => {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : undefined;

  const driver2 = useMemo(
    () =>
      comparison ?? {
        time: telemetry.time,
        speed: telemetry.speed,
        label: "Comparison"
      },
    [comparison, telemetry.time, telemetry.speed]
  );

  const cssTokenStyle = useMemo(
    () => createTelemetryCssVariables(styleTokens ?? {}) as CSSProperties,
    [styleTokens]
  );

  const extensionPanels = useMemo(() => {
    const allPanels = new Map<string, TelemetryPanelExtension>();
    getTelemetryPanels().forEach((panel) => allPanels.set(panel.id, panel));
    extensions.forEach((panel) => allPanels.set(panel.id, panel));
    return sortPanels(Array.from(allPanels.values()));
  }, [extensions]);

  const panelContext = useMemo(
    () => ({
      telemetry,
      comparison: driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      cursorTime: sharedCursor,
      setCursorTime
    }),
    [
      telemetry,
      driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      sharedCursor
    ]
  );

  return (
    <div
      className={className}
      style={{
        ...cssTokenStyle,
        display: "grid",
        gap: panelGap,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minPanelWidth}px, 1fr))`
      }}
    >
      {includeDefaultPanels ? (
        <>
          <SpeedChart
            title="Speed"
            time={telemetry.time}
            speed={telemetry.speed}
            theme={theme}
            processing={processing}
            styleTokens={styleTokens}
            annotations={annotations}
            height={chartHeight}
            cursorTime={sharedCursor}
            onCursorTimeChange={onCursorChange}
            showCursor={syncCursor}
          />
          <ThrottleBrakeChart
            title="Driver Inputs"
            time={telemetry.time}
            throttle={telemetry.throttle}
            brake={telemetry.brake}
            theme={theme}
            processing={processing}
            styleTokens={styleTokens}
            annotations={annotations}
            height={chartHeight}
            cursorTime={sharedCursor}
            onCursorTimeChange={onCursorChange}
            showCursor={syncCursor}
          />
          <LapComparisonChart
            title={lapMode === "delta" ? "Lap Delta" : "Lap Comparison"}
            driver1={{ time: telemetry.time, speed: telemetry.speed, label: "Driver 1" }}
            driver2={driver2}
            mode={lapMode}
            sectorMarkers={sectorMarkers}
            annotations={annotations}
            theme={theme}
            processing={processing}
            styleTokens={styleTokens}
            height={chartHeight}
            cursorTime={sharedCursor}
            onCursorTimeChange={onCursorChange}
            showCursor={syncCursor}
          />
          <TrackMap
            title="Track Position"
            x={telemetry.x}
            y={telemetry.y}
            time={telemetry.time}
            annotations={annotations}
            theme={theme}
            processing={processing}
            styleTokens={styleTokens}
            height={trackMapHeight}
            cursorTime={sharedCursor}
            onCursorTimeChange={onCursorChange}
            showCursor={syncCursor}
          />
        </>
      ) : null}
      {extensionPanels.map((panel) => (
        <div key={panel.id}>{panel.render(panelContext)}</div>
      ))}
    </div>
  );
};
