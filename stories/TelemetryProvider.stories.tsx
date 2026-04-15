import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  SpeedChart,
  TelemetryProvider,
  ThrottleBrakeChart,
  useTelemetryContext
} from "../src";

const telemetry = {
  time: Array.from({ length: 140 }, (_, index) => index * 0.12),
  speed: Array.from({ length: 140 }, (_, index) => 210 + Math.sin(index / 9) * 38 - (index % 35 > 26 ? 45 : 0)),
  throttle: Array.from({ length: 140 }, (_, index) =>
    Math.max(0, Math.min(100, 62 + Math.sin(index / 7) * 33 - (index % 35 > 26 ? 42 : 0)))
  ),
  brake: Array.from({ length: 140 }, (_, index) =>
    index % 35 > 26 ? Math.max(0, Math.min(100, 58 + Math.cos(index / 4) * 18)) : 0
  ),
  x: Array.from({ length: 140 }, (_, index) => Math.cos(index / 14) * 172 + Math.sin(index / 5) * 18),
  y: Array.from({ length: 140 }, (_, index) => Math.sin(index / 14) * 114 + Math.cos(index / 5) * 16)
};

const ProviderCharts = () => {
  const { telemetry, cursorProps, theme, setTheme } = useTelemetryContext();
  if (!telemetry) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          Toggle Theme
        </button>
      </div>
      <SpeedChart time={telemetry.time} speed={telemetry.speed} title="Provider Speed" theme={theme} {...cursorProps} />
      <ThrottleBrakeChart
        time={telemetry.time}
        throttle={telemetry.throttle}
        brake={telemetry.brake}
        title="Provider Inputs"
        theme={theme}
        {...cursorProps}
      />
    </div>
  );
};

const ProviderDemo = () => (
  <TelemetryProvider
    initialData={telemetry}
    theme="dark"
    processing={{ maxPoints: 100, downsampleStrategy: "min-max" }}
  >
    <ProviderCharts />
  </TelemetryProvider>
);

const meta = {
  title: "Telemetry/TelemetryProvider",
  component: ProviderDemo
} satisfies Meta<typeof ProviderDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
