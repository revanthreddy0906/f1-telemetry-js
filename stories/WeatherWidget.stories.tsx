import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { WeatherWidget } from "../src/components/WeatherWidget";

const time = Array.from({ length: 18 }, (_, index) => index * 3);
const weather = time.map((t, index) => ({
  time: t,
  airTemp: 27 + Math.sin(t / 18) * 2,
  trackTemp: 41 + Math.sin(t / 10) * 4,
  humidity: 42 + index * 0.8,
  windSpeed: 10 + Math.cos(t / 8) * 2,
  windDirection: 300 + index * 5,
  rainfall: index < 10 ? 0 : index < 14 ? 0.35 : 0.8
}));

const meta = {
  title: "Telemetry/WeatherWidget",
  component: WeatherWidget
} satisfies Meta<typeof WeatherWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullMode: Story = {
  args: {
    data: weather,
    compactMode: false
  }
};

export const CompactMode: Story = {
  args: {
    data: weather,
    compactMode: true
  }
};
