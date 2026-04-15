import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GearChart } from "../src/components/GearChart";

const time = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
const gear = [2, 3, 4, 6, 7, 8, 7, 5, 4, 3];

const meta = {
  title: "Telemetry/GearChart",
  component: GearChart
} satisfies Meta<typeof GearChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    time,
    gear,
    showGearBands: true,
    annotations: [{ type: "corner", time: 6, label: "T4" }]
  }
};
