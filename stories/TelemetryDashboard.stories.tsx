import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TelemetryDashboard } from "../src/components/TelemetryDashboard";

const samples = 1200;
const time = Array.from({ length: samples }, (_, index) => index * 0.08);
const speed = time.map((value, index) => 210 + Math.sin(value / 3) * 45 - (index % 90 > 70 ? 40 : 0));
const throttle = time.map((value, index) => Math.max(0, Math.min(100, 60 + Math.sin(value * 1.5) * 35 - (index % 80 > 65 ? 45 : 0))));
const brake = time.map((value, index) => Math.max(0, Math.min(100, index % 80 > 65 ? 55 + Math.cos(value * 1.2) * 20 : 0)));
const x = time.map((value) => Math.cos(value / 5) * 300 + Math.sin(value / 2) * 30);
const y = time.map((value) => Math.sin(value / 5) * 200 + Math.cos(value / 1.8) * 20);

const meta = {
  title: "Telemetry/TelemetryDashboard",
  component: TelemetryDashboard,
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof TelemetryDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    telemetry: { time, speed, throttle, brake, x, y },
    comparison: {
      time,
      speed: speed.map((value, index) => value - 6 + Math.sin(index / 25) * 2),
      label: "Driver 2"
    },
    sectorMarkers: [16.8, 34.2, 56.7],
    processing: { maxPoints: 500, downsampleStrategy: "min-max" },
    lapMode: "overlay",
    syncCursor: true
  }
};

export const DeltaMode: Story = {
  args: {
    ...Default.args,
    lapMode: "delta",
    processing: { maxPoints: 350, downsampleStrategy: "min-max", window: { startTime: 8, endTime: 72 } }
  }
};
