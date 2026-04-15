import type { Preview } from "@storybook/react";
import React from "react";
import { createTelemetryCssVariables } from "../src/components/chartTheme";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global telemetry theme",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" }
        ]
      }
    }
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as "dark" | "light";
      const tokens =
        theme === "dark"
          ? createTelemetryCssVariables({
              background: "#0a0f1f",
              border: "rgba(255, 255, 255, 0.08)",
              text: "#f8fbff",
              mutedText: "#93a0b8",
              grid: "rgba(255, 255, 255, 0.1)"
            })
          : createTelemetryCssVariables({
              background: "#ffffff",
              border: "rgba(15, 23, 42, 0.1)",
              text: "#0f172a",
              mutedText: "#566074",
              grid: "rgba(148, 163, 184, 0.35)"
            });

      return (
        <div
          style={{
            ...tokens,
            minHeight: "100vh",
            padding: 20,
            background: theme === "dark" ? "#050910" : "#eff4ff"
          }}
        >
          <Story />
        </div>
      );
    }
  ]
};

export default preview;
