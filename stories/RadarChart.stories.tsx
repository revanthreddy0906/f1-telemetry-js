import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RadarChart } from "../src/components/RadarChart";

const meta = {
  title: "Telemetry/RadarChart",
  component: RadarChart
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DriverComparison: Story = {
  args: {
    drivers: [
      {
        driver: "VER",
        color: "#3671C6",
        metrics: { topSpeed: 96, braking: 93, traction: 95, tyreMgmt: 90, consistency: 94 }
      },
      {
        driver: "LEC",
        color: "#E8002D",
        metrics: { topSpeed: 93, braking: 90, traction: 92, tyreMgmt: 87, consistency: 91 }
      },
      {
        driver: "HAM",
        color: "#27F4D2",
        metrics: { topSpeed: 91, braking: 92, traction: 89, tyreMgmt: 92, consistency: 90 }
      }
    ],
    metricLabels: {
      topSpeed: "Top Speed",
      braking: "Braking",
      traction: "Traction",
      tyreMgmt: "Tyre Mgmt",
      consistency: "Consistency"
    }
  }
};
