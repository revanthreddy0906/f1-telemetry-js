import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MiniSectors } from "../src/components/MiniSectors";

const meta = {
  title: "Telemetry/MiniSectors",
  component: MiniSectors
} satisfies Meta<typeof MiniSectors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeSectorComparison: Story = {
  args: {
    comparisonMode: "overall-best",
    drivers: [
      {
        driver: "VER",
        color: "#3671C6",
        sectors: [
          { sector: 1, time: 28.101 },
          { sector: 2, time: 31.212 },
          { sector: 3, time: 24.942 }
        ]
      },
      {
        driver: "LEC",
        color: "#E8002D",
        sectors: [
          { sector: 1, time: 28.221 },
          { sector: 2, time: 31.180 },
          { sector: 3, time: 25.011 }
        ]
      },
      {
        driver: "NOR",
        color: "#FF8000",
        sectors: [
          { sector: 1, time: 28.412 },
          { sector: 2, time: 31.430 },
          { sector: 3, time: 25.190 }
        ]
      }
    ]
  }
};
