import {
  CategoryScale,
  Chart as ChartJS,
  Decimation,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip
} from "chart.js";

let isChartSetupComplete = false;

/**
 * Register all chart.js controllers/scales used by the library.
 */
export const ensureChartSetup = (): void => {
  if (isChartSetupComplete) {
    return;
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
    Decimation
  );

  isChartSetupComplete = true;
};
