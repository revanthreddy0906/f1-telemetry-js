import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TyreStrategyTimeline } from "../src/components/TyreStrategyTimeline";

const meta = {
  title: "Telemetry/TyreStrategyTimeline",
  component: TyreStrategyTimeline
} satisfies Meta<typeof TyreStrategyTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bahrain57Laps: Story = {
  args: {
    totalLaps: 57,
    strategies: [
      {
        driver: "VER",
        color: "#3671C6",
        stints: [
          { compound: "soft", startLap: 1, endLap: 16, label: "New Soft" },
          { compound: "hard", startLap: 17, endLap: 35, label: "Hard" },
          { compound: "soft", startLap: 36, endLap: 57, label: "Used Soft" }
        ]
      },
      {
        driver: "LEC",
        color: "#E8002D",
        stints: [
          { compound: "medium", startLap: 1, endLap: 20, label: "Medium" },
          { compound: "hard", startLap: 21, endLap: 42, label: "Hard" },
          { compound: "soft", startLap: 43, endLap: 57, label: "Soft" }
        ]
      },
      {
        driver: "NOR",
        color: "#FF8000",
        stints: [
          { compound: "soft", startLap: 1, endLap: 14, label: "Soft" },
          { compound: "hard", startLap: 15, endLap: 37, label: "Hard" },
          { compound: "medium", startLap: 38, endLap: 57, label: "Medium" }
        ]
      }
    ]
  }
};
