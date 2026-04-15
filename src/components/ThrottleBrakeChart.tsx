import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { createLineOptions, getCardStyle, getThemePalette, getTitleStyle } from "./chartTheme";
import type { ThrottleBrakeChartProps } from "../types/telemetry";
import "../utils/chartSetup";

export const ThrottleBrakeChart = ({
  time,
  throttle,
  brake,
  theme = "dark",
  height = 320,
  className,
  title = "Throttle & Brake"
}: ThrottleBrakeChartProps) => {
  const palette = useMemo(() => getThemePalette(theme), [theme]);

  const throttlePoints = useMemo(() => {
    const length = Math.min(time.length, throttle.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: throttle[index]
    }));
  }, [time, throttle]);

  const brakePoints = useMemo(() => {
    const length = Math.min(time.length, brake.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: brake[index]
    }));
  }, [time, brake]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: "Throttle (%)",
          data: throttlePoints,
          borderColor: palette.accent,
          backgroundColor: "rgba(110, 231, 183, 0.2)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "Brake (%)",
          data: brakePoints,
          borderColor: palette.danger,
          backgroundColor: "rgba(255, 127, 159, 0.2)",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        }
      ]
    }),
    [palette, throttlePoints, brakePoints]
  );

  const options = useMemo(() => createLineOptions(theme, "Input (%)", { min: 0, max: 100 }), [theme]);

  return (
    <div className={className} style={getCardStyle(theme, height)}>
      <p style={getTitleStyle(theme)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
