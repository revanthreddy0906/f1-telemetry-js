import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  SpeedChart,
  ThrottleBrakeChart,
  useCursorSync,
  useTelemetry
} from "../src";

const rawData = Array.from({ length: 120 }, (_, index) => {
  const time = index * 0.15;
  const speed = 220 + Math.sin(index / 10) * 35 - (index % 30 > 22 ? 48 : 0);
  const throttle = Math.max(0, Math.min(100, 65 + Math.sin(index / 6) * 30 - (index % 30 > 22 ? 40 : 0)));
  const brake = index % 30 > 22 ? Math.max(0, Math.min(100, 55 + Math.cos(index / 3) * 22)) : 0;
  const x = Math.cos(time / 1.3) * 180;
  const y = Math.sin(time / 1.3) * 115;
  return { time, speed, throttle, brake, x, y };
});

const HooksDemo = () => {
  const { telemetry } = useTelemetry({ data: rawData, processing: { maxPoints: 80, downsampleStrategy: "min-max" } });
  const { cursorTime, cursorProps } = useCursorSync();

  if (!telemetry) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <p style={{ margin: 0, fontFamily: "sans-serif" }}>
        Cursor: {cursorTime === null ? "none" : `${cursorTime.toFixed(2)}s`}
      </p>
      <SpeedChart time={telemetry.time} speed={telemetry.speed} title="Hooked Speed" {...cursorProps} />
      <ThrottleBrakeChart
        time={telemetry.time}
        throttle={telemetry.throttle}
        brake={telemetry.brake}
        title="Hooked Inputs"
        {...cursorProps}
      />
    </div>
  );
};

const meta = {
  title: "Telemetry/Hooks",
  component: HooksDemo
} satisfies Meta<typeof HooksDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
