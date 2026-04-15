import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PositionChart } from "../src/components/PositionChart";

const totalLaps = 56;

const meta = {
  title: "Telemetry/PositionChart",
  component: PositionChart
} satisfies Meta<typeof PositionChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpaghettiRace: Story = {
  args: {
    totalLaps,
    highlightDrivers: ["VER", "LEC", "HAM"],
    drivers: [
      { driver: "VER", color: "#3671C6", positions: Array.from({ length: totalLaps }, (_, i) => (i < 12 ? 2 : 1)) },
      {
        driver: "LEC",
        color: "#E8002D",
        positions: Array.from({ length: totalLaps }, (_, i) => (i < 12 ? 1 : i < 40 ? 2 : 3))
      },
      {
        driver: "HAM",
        color: "#27F4D2",
        positions: Array.from({ length: totalLaps }, (_, i) => (i < 28 ? 4 : 3))
      },
      {
        driver: "NOR",
        color: "#FF8000",
        positions: Array.from({ length: totalLaps }, (_, i) => (i < 20 ? 5 : i < 44 ? 4 : 5))
      },
      { driver: "RUS", color: "#27F4D2", positions: Array.from({ length: totalLaps }, () => 6) },
      { driver: "ALO", color: "#006F62", positions: Array.from({ length: totalLaps }, () => 7) },
      { driver: "SAI", color: "#E8002D", positions: Array.from({ length: totalLaps }, (_, i) => (i < 33 ? 3 : 4)) },
      { driver: "PIA", color: "#FF8000", positions: Array.from({ length: totalLaps }, () => 8) }
    ]
  }
};
