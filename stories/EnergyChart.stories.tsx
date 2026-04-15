import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EnergyChart } from "../src/components/EnergyChart";

const time = Array.from({ length: 24 }, (_, index) => index * 2.5);
const ersDeployment = [12, 18, 35, 62, 74, 81, 68, 40, 28, 22, 16, 14, 20, 42, 66, 77, 72, 51, 30, 21, 18, 14, 12, 10];
const ersHarvest = [26, 24, 21, 15, 10, 7, 9, 14, 20, 28, 34, 31, 26, 18, 11, 8, 9, 14, 19, 27, 30, 34, 36, 32];
const batteryLevel = [92, 90, 88, 84, 80, 77, 75, 73, 72, 72, 73, 74, 72, 68, 63, 58, 56, 55, 57, 59, 60, 62, 64, 66];

const meta = {
  title: "Telemetry/EnergyChart",
  component: EnergyChart
} satisfies Meta<typeof EnergyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    time,
    ersDeployment,
    ersHarvest,
    batteryLevel,
    annotations: [{ type: "drs", time: 30, label: "DRS Train" }]
  }
};
