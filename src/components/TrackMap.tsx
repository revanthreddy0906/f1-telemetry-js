import { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import { createTrackMapOptions, getCardStyle, getThemePalette, getTitleStyle } from "./chartTheme";
import type { TrackMapProps } from "../types/telemetry";
import "../utils/chartSetup";

export const TrackMap = ({
  x,
  y,
  theme = "dark",
  height = 360,
  className,
  title = "Track Map"
}: TrackMapProps) => {
  const palette = useMemo(() => getThemePalette(theme), [theme]);

  const points = useMemo(() => {
    const length = Math.min(x.length, y.length);
    return Array.from({ length }, (_, index) => ({
      x: x[index],
      y: y[index]
    }));
  }, [x, y]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: "Car Position",
          data: points,
          showLine: true,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.12
        }
      ]
    }),
    [palette, points]
  );

  const options = useMemo(() => createTrackMapOptions(theme), [theme]);

  return (
    <div className={className} style={getCardStyle(theme, height)}>
      <p style={getTitleStyle(theme)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};
