import { useMemo } from "react";
import type { TyreStrategyTimelineProps } from "../types/telemetry";
import { resolveThemeTokens } from "./chartTheme";
import { TelemetryCard } from "./TelemetryCard";
import { TYRE_COMPOUND_COLORS } from "../utils/tyres";

export const TyreStrategyTimeline = ({
  strategies,
  totalLaps,
  theme = "dark",
  className,
  styleTokens,
  height = 36,
  showLapNumbers = true,
  title = "Tyre Strategy Timeline",
  ariaLabel
}: TyreStrategyTimelineProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const lapMarkers = useMemo(() => {
    const markerCount = Math.min(8, Math.max(2, Math.floor(totalLaps / 5)));
    return Array.from({ length: markerCount + 1 }, (_, index) =>
      Math.round((totalLaps * index) / markerCount)
    );
  }, [totalLaps]);

  return (
    <TelemetryCard
      theme={theme}
      height={Math.max(220, strategies.length * (height + 12) + 92)}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Tyre strategy timeline"
    >
      <div style={{ display: "grid", gap: 10, height: "100%" }}>
        {showLapNumbers ? (
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
        ) : null}
        {strategies.map((strategy) => (
          <div key={strategy.driver} style={{ display: "grid", gridTemplateColumns: "84px 1fr", gap: 10 }}>
            <div
              style={{
                color: strategy.color ?? palette.text,
                fontWeight: 600,
                fontSize: 12,
                alignSelf: "center"
              }}
            >
              {strategy.driver}
            </div>
            <div
              style={{
                position: "relative",
                height,
                borderRadius: 8,
                border: `1px solid ${palette.border}`,
                overflow: "hidden",
                background: "rgba(148,163,184,0.06)"
              }}
            >
              {strategy.stints.map((stint, index) => {
                const start = Math.max(1, stint.startLap);
                const end = Math.max(start, stint.endLap);
                const left = ((start - 1) / totalLaps) * 100;
                const width = ((end - start + 1) / totalLaps) * 100;

                return (
                  <div
                    key={`${strategy.driver}-${stint.compound}-${start}-${end}-${index}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${left}%`,
                      width: `${width}%`,
                      height: "100%",
                      background: TYRE_COMPOUND_COLORS[stint.compound],
                      color: stint.compound === "hard" ? "#111827" : "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRight: `1px solid rgba(0,0,0,0.2)`
                    }}
                  >
                    {stint.label ?? stint.compound}
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
