import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GapChart } from "../src/components/GapChart";

const laps = Array.from({ length: 20 }, (_, index) => index + 1);

const meta = {
  title: "Telemetry/GapChart",
  component: GapChart
} satisfies Meta<typeof GapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RaceGap: Story = {
  args: {
    drivers: [
      {
        driver: "VER",
        color: "#3671C6",
        data: laps.map((lap, index) => ({ lap, gap: index * 0.15 }))
      },
      {
        driver: "LEC",
        color: "#E8002D",
        data: laps.map((lap, index) => ({ lap, gap: 0.8 + index * 0.21 }))
      },
      {
        driver: "HAM",
        color: "#27F4D2",
        data: laps.map((lap, index) => ({ lap, gap: 2.3 + index * 0.18 }))
      },
      {
        driver: "NOR",
        color: "#FF8000",
        data: laps.map((lap, index) => ({ lap, gap: 1.9 + index * 0.25 }))
      }
    ],
    invertAxis: true,
    showDriverLabels: true
  }
};
