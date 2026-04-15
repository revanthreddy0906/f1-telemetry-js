import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { createLineOptions, getCardStyle, getThemePalette, getTitleStyle } from "./chartTheme";
import type { LapComparisonChartProps } from "../types/telemetry";
import "../utils/chartSetup";

export const LapComparisonChart = ({
  driver1,
  driver2,
  driver1Label,
  driver2Label,
  theme = "dark",
  height = 320,
  className,
  title = "Lap Comparison"
}: LapComparisonChartProps) => {
  const palette = useMemo(() => getThemePalette(theme), [theme]);

  const driver1Points = useMemo(() => {
    const length = Math.min(driver1.time.length, driver1.speed.length);
    return Array.from({ length }, (_, index) => ({
      x: driver1.time[index],
      y: driver1.speed[index]
    }));
  }, [driver1.speed, driver1.time]);

  const driver2Points = useMemo(() => {
    const length = Math.min(driver2.time.length, driver2.speed.length);
    return Array.from({ length }, (_, index) => ({
      x: driver2.time[index],
      y: driver2.speed[index]
    }));
  }, [driver2.speed, driver2.time]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: driver1Label ?? driver1.label ?? "Driver 1",
          data: driver1Points,
          borderColor: driver1.color ?? palette.primary,
          backgroundColor: "rgba(86, 184, 255, 0.22)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: driver2Label ?? driver2.label ?? "Driver 2",
          data: driver2Points,
          borderColor: driver2.color ?? palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.22)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.25
        }
      ]
    }),
    [driver1.color, driver1.label, driver1Label, driver1Points, driver2.color, driver2.label, driver2Label, driver2Points, palette.accent, palette.primary]
  );

  const options = useMemo(() => createLineOptions(theme, "Speed (km/h)"), [theme]);

  return (
    <div className={className} style={getCardStyle(theme, height)}>
      <p style={getTitleStyle(theme)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
