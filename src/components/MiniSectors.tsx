import { useMemo } from "react";
import type { MiniSectorsProps } from "../types/telemetry";
import { resolveThemeTokens } from "./chartTheme";
import { TelemetryCard } from "./TelemetryCard";

const colorForSector = (mode: MiniSectorsProps["comparisonMode"], ratio: number, isOverallBest: boolean): string => {
  if (isOverallBest) {
    return "#A855F7";
  }
  if (ratio <= 1) {
    return "#22C55E";
  }
  if (ratio > 1.07) {
    return "#F97316";
  }
  if (mode === "previous-lap" && ratio > 1.04) {
    return "#EF4444";
  }
  return "#EAB308";
};

export const MiniSectors = ({
  drivers,
  comparisonMode = "overall-best",
  theme = "dark",
  className,
  styleTokens,
  title = "Mini Sectors",
  ariaLabel
}: MiniSectorsProps) => {
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const sectors = useMemo(
    () =>
      Array.from(new Set(drivers.flatMap((driver) => driver.sectors.map((sector) => sector.sector)))).sort(
        (left, right) => left - right
      ),
    [drivers]
  );

  const overallBestBySector = useMemo(() => {
    const result = new Map<number, number>();
    sectors.forEach((sector) => {
      const best = Math.min(
        ...drivers
          .map((driver) => driver.sectors.find((entry) => entry.sector === sector)?.time ?? Number.POSITIVE_INFINITY)
      );
      result.set(sector, best);
    });
    return result;
  }, [drivers, sectors]);

  return (
    <TelemetryCard
      theme={theme}
      height={Math.max(220, drivers.length * 44 + 84)}
      className={className}
      title={title}
      styleTokens={styleTokens}
      ariaLabel={ariaLabel}
      defaultAriaLabel="Mini sectors comparison grid"
    >
      <div style={{ overflow: "auto", height: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4 }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  color: palette.mutedText,
                  fontSize: 11,
                  padding: "4px 6px"
                }}
              >
                Driver
              </th>
              {sectors.map((sector) => (
                <th
                  key={sector}
                  style={{
                    textAlign: "center",
                    color: palette.mutedText,
                    fontSize: 11,
                    padding: "4px 6px"
                  }}
                >
                  S{sector}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              const personalBest = Math.min(...driver.sectors.map((sector) => sector.time));

              return (
                <tr key={driver.driver}>
                  <td
                    style={{
                      color: driver.color ?? palette.text,
                      fontWeight: 600,
                      fontSize: 12,
                      padding: "6px"
                    }}
                  >
                    {driver.driver}
                  </td>
                  {sectors.map((sector, sectorIndex) => {
                    const current = driver.sectors.find((entry) => entry.sector === sector)?.time;
                    if (current === undefined) {
                      return (
                        <td key={`${driver.driver}-${sector}`}>
                          <div
                            style={{
                              borderRadius: 6,
                              border: `1px solid ${palette.border}`,
                              height: 30
                            }}
                          />
                        </td>
                      );
                    }

                    const previous = driver.sectors[sectorIndex - 1]?.time ?? current;
                    const baseline =
                      comparisonMode === "previous-lap"
                        ? previous
                        : comparisonMode === "personal-best"
                          ? personalBest
                          : overallBestBySector.get(sector) ?? current;
                    const ratio = baseline > 0 ? current / baseline : 1;
                    const isOverallBest = current <= (overallBestBySector.get(sector) ?? current);
                    const cellColor = colorForSector(comparisonMode, ratio, isOverallBest);

                    return (
                      <td key={`${driver.driver}-${sector}`}>
                        <div
                          style={{
                            borderRadius: 6,
                            minWidth: 54,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#111827",
                            background: cellColor
                          }}
                        >
                          {current.toFixed(3)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TelemetryCard>
  );
};
