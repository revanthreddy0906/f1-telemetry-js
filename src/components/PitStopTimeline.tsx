import { useMemo } from "react";
import type { PitStopTimelineProps } from "../types/telemetry";
import { resolveThemeTokens } from "./chartTheme";
import { TelemetryCard } from "./TelemetryCard";
import { TYRE_COMPOUND_COLORS } from "../utils/tyres";

export const PitStopTimeline = ({
  drivers,
  totalLaps,
  theme = "dark",
  className,
  styleTokens,
  showDurations = true,
  highlightSlow = 5,
  title = "Pit Stop Timeline",
  ariaLabel
}: PitStopTimelineProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const lapMarkers = useMemo(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from({ length: markerCount + 1 }, (_, index) =>
      Math.round((totalLaps * index) / markerCount)
    );
  }, [totalLaps]);

  const maxDuration = useMemo(
    () => Math.max(...drivers.flatMap((driver) => driver.stops.map((stop) => stop.duration)), highlightSlow, 5),
    [drivers, highlightSlow]
  );

  return (
    <TelemetryCard
      theme={theme}
      height={Math.max(220, drivers.length * 52 + 84)}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Pit stop timeline"
    >
      <div style={{ display: "grid", gap: 10, height: "100%" }}>
        <div
          style={{
            position: "relative",
            height: 20,
            borderBottom: `1px solid ${palette.grid}`
          }}
        >
          {lapMarkers.map((marker) => (
            <span
              key={marker}
              style={{
                position: "absolute",
                left: `${(marker / totalLaps) * 100}%`,
                transform: "translateX(-50%)",
                fontSize: 11,
                color: palette.mutedText
              }}
            >
              L{marker}
            </span>
          ))}
        </div>
        {drivers.map((driver) => (
          <div key={driver.driver} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}>
            <div
              style={{
                color: driver.color ?? palette.text,
                fontWeight: 600,
                fontSize: 12,
                alignSelf: "center"
              }}
            >
              {driver.driver}
            </div>
            <div
              style={{
                position: "relative",
                height: 40,
                borderRadius: 8,
                border: `1px solid ${palette.border}`,
                background: "rgba(148,163,184,0.05)"
              }}
            >
              {driver.stops.map((stop, index) => {
                const left = (stop.lap / totalLaps) * 100;
                const size = 12 + (Math.max(0, stop.duration - 1.8) / maxDuration) * 18;
                const slow = stop.duration > highlightSlow;

                return (
                  <div
                    key={`${driver.driver}-${stop.lap}-${index}`}
                    style={{
                      position: "absolute",
                      left: `${left}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    {showDurations ? (
                      <span
                        style={{
                          position: "absolute",
                          top: -16,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: 10,
                          color: palette.mutedText,
                          whiteSpace: "nowrap"
                        }}
                      >
                        {stop.duration.toFixed(1)}s
                      </span>
                    ) : null}
                    <div
                      style={{
                        width: size,
                        height: size,
                        transform: "rotate(45deg)",
                        borderRadius: 3,
                        background: driver.color ?? palette.primarySoft,
                        border: `2px solid ${slow ? palette.danger : palette.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background: stop.tyreCompoundOut
                            ? TYRE_COMPOUND_COLORS[stop.tyreCompoundOut]
                            : palette.accent,
                          transform: "rotate(-45deg)",
                          border: "1px solid rgba(0,0,0,0.5)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </TelemetryCard>
  );
};
