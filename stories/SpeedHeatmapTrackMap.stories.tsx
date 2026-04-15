import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SpeedHeatmapTrackMap } from "../src/components/SpeedHeatmapTrackMap";

const points = 360;
const time = Array.from({ length: points }, (_, index) => index * 0.2);
const x = time.map((t) => Math.cos(t / 6) * 280 + Math.sin(t / 1.8) * 18);
const y = time.map((t) => Math.sin(t / 6) * 200 + Math.cos(t / 2.3) * 20);
const speed = time.map((t, index) => 180 + Math.sin(t / 1.6) * 55 - (index % 80 > 56 ? 45 : 0));

const meta = {
  title: "Telemetry/SpeedHeatmapTrackMap",
  component: SpeedHeatmapTrackMap
} satisfies Meta<typeof SpeedHeatmapTrackMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    time,
    x,
    y,
    speed,
    segmentSize: 4,
    annotations: [
      { type: "corner", time: 18, label: "T1" },
      { type: "drs", time: 42, label: "DRS" }
    ]
  }
};
