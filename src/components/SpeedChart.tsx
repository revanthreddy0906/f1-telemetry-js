import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { createLineOptions, getCardStyle, getThemePalette, getTitleStyle } from "./chartTheme";
import type { SpeedChartProps } from "../types/telemetry";
import "../utils/chartSetup";

export const SpeedChart = (props: SpeedChartProps) => {
  const { theme = "dark", height = 320, className, title = "Speed vs Time" } = props;
  const time = props.data?.time ?? props.time ?? [];
  const speed = props.data?.speed ?? props.speed ?? [];
  const palette = useMemo(() => getThemePalette(theme), [theme]);

  const points = useMemo(() => {
    const length = Math.min(time.length, speed.length);
    return Array.from({ length }, (_, index) => ({
      x: time[index],
      y: speed[index]
    }));
  }, [time, speed]);

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "Speed (km/h)",
          data: points,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.28,
          fill: true
        }
      ]
    }),
    [palette, points]
  );

  const options = useMemo(() => createLineOptions(theme, "Speed (km/h)"), [theme]);

  return (
    <div className={className} style={getCardStyle(theme, height)}>
      <p style={getTitleStyle(theme)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
