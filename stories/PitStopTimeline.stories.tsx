import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PitStopTimeline } from "../src/components/PitStopTimeline";

const meta = {
  title: "Telemetry/PitStopTimeline",
  component: PitStopTimeline
} satisfies Meta<typeof PitStopTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypicalRaceStops: Story = {
  args: {
    totalLaps: 57,
    highlightSlow: 5,
    drivers: [
      {
        driver: "VER",
        color: "#3671C6",
        stops: [
          { lap: 17, duration: 2.2, tyreCompoundOut: "hard" },
          { lap: 39, duration: 2.5, tyreCompoundOut: "soft" }
        ]
      },
      {
        driver: "LEC",
        color: "#E8002D",
        stops: [
          { lap: 21, duration: 2.4, tyreCompoundOut: "hard" },
          { lap: 44, duration: 2.6, tyreCompoundOut: "soft" }
        ]
      },
      {
        driver: "HAM",
        color: "#27F4D2",
        stops: [
          { lap: 19, duration: 2.8, tyreCompoundOut: "medium" },
          { lap: 42, duration: 5.6, tyreCompoundOut: "soft" }
        ]
      }
    ]
  }
};
