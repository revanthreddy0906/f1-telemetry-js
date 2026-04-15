import { useMemo, useState, type CSSProperties } from "react";
import type { TelemetryDashboardProps } from "../types/telemetry";
import { LapComparisonChart } from "./LapComparisonChart";
import { SpeedChart } from "./SpeedChart";
import { ThrottleBrakeChart } from "./ThrottleBrakeChart";
import { TrackMap } from "./TrackMap";
import { createTelemetryCssVariables } from "./chartTheme";

export const TelemetryDashboard = ({
  telemetry,
  comparison,
  lapMode = "overlay",
  sectorMarkers,
  theme = "dark",
  styleTokens,
  processing,
  syncCursor = true,
  className,
  chartHeight = 320,
  trackMapHeight = 360
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

  return (
    <div
      className={className}
      style={{
        ...cssTokenStyle,
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
      }}
    >
      <SpeedChart
        title="Speed"
        time={telemetry.time}
        speed={telemetry.speed}
        theme={theme}
        processing={processing}
        styleTokens={styleTokens}
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
        theme={theme}
        processing={processing}
        styleTokens={styleTokens}
        height={trackMapHeight}
        cursorTime={sharedCursor}
        onCursorTimeChange={onCursorChange}
        showCursor={syncCursor}
      />
    </div>
  );
};
