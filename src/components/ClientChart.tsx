import { useEffect, useState } from "react";
import type { ChartData, ChartOptions, Plugin } from "chart.js";
import type { ChartProps } from "react-chartjs-2";

type ReactChartModule = typeof import("react-chartjs-2");

type LineChartProps = {
  type: "line";
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
  plugins?: Plugin<"line">[];
  ariaLabel?: string;
};

type ScatterChartProps = {
  type: "scatter";
  data: ChartData<"scatter">;
  options?: ChartOptions<"scatter">;
  plugins?: Plugin<"scatter">[];
  ariaLabel?: string;
};

type ClientChartProps = LineChartProps | ScatterChartProps;

export const ClientChart = (props: ClientChartProps) => {
  const [charts, setCharts] = useState<ReactChartModule | null>(null);

  useEffect(() => {
    let mounted = true;
    import("react-chartjs-2").then((module) => {
      if (mounted) {
        setCharts(module);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!charts) {
    return (
      <div
        role="img"
        aria-label={props.ariaLabel ?? "Loading telemetry chart"}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          background: "rgba(127, 127, 127, 0.08)"
        }}
      />
    );
  }

  if (props.type === "line") {
    const Line = charts.Line;
    return (
      <Line
        data={props.data}
        options={props.options as ChartProps<"line">["options"]}
        plugins={props.plugins}
        aria-label={props.ariaLabel}
      />
    );
  }

  const Scatter = charts.Scatter;
  return (
    <Scatter
      data={props.data}
      options={props.options as ChartProps<"scatter">["options"]}
      plugins={props.plugins}
      aria-label={props.ariaLabel}
    />
  );
};
