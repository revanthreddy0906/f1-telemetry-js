import type { Plugin } from "chart.js";

export const createCursorLinePlugin = (
  cursorTime: number | null | undefined,
  color: string
): Plugin<"line"> => ({
  id: "f1-telemetry-cursor-line",
  afterDatasetsDraw: (chart) => {
    if (cursorTime === null || cursorTime === undefined) {
      return;
    }

    const xScale = chart.scales.x;
    const chartArea = chart.chartArea;

    if (!xScale || !chartArea) {
      return;
    }

    const x = xScale.getPixelForValue(cursorTime);
    if (!Number.isFinite(x) || x < chartArea.left || x > chartArea.right) {
      return;
    }

    const { ctx } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  }
});

export const createSectorMarkersPlugin = (markers: number[] | undefined, color: string): Plugin<"line"> => ({
  id: "f1-telemetry-sector-markers",
  beforeDatasetsDraw: (chart) => {
    if (!markers || markers.length === 0) {
      return;
    }

    const xScale = chart.scales.x;
    const chartArea = chart.chartArea;

    if (!xScale || !chartArea) {
      return;
    }

    const { ctx } = chart;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    markers.forEach((marker) => {
      const x = xScale.getPixelForValue(marker);
      if (!Number.isFinite(x) || x < chartArea.left || x > chartArea.right) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();
    });

    ctx.restore();
  }
});
