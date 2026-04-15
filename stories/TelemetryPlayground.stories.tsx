import type { Meta, StoryObj } from "@storybook/react";
import { TelemetryPlayground } from "../src/components/TelemetryPlayground";

const meta = {
  title: "Telemetry/TelemetryPlayground",
  component: TelemetryPlayground,
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof TelemetryPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chartHeight: 220
  }
};

export const DashboardView: Story = {
  args: {
    charts: ["dashboard"],
    chartHeight: 200
  }
};
