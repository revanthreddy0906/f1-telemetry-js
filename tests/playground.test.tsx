import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TelemetryPlayground } from "../src";

describe("TelemetryPlayground", () => {
  it("renders textarea and parse control", () => {
    render(<TelemetryPlayground />);
    expect(screen.getByLabelText("Telemetry CSV input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Parse" })).toBeInTheDocument();
  });

  it("load example fills textarea with telemetry csv", () => {
    render(<TelemetryPlayground defaultCsv="" />);
    const textarea = screen.getByLabelText("Telemetry CSV input") as HTMLTextAreaElement;
    expect(textarea.value).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Load Example" }));
    expect(textarea.value).toContain("time,speed,throttle,brake,x,y");
  });

  it("parsing valid csv renders charts", () => {
    render(<TelemetryPlayground defaultCsv="" />);
    const textarea = screen.getByLabelText("Telemetry CSV input");
    fireEvent.change(textarea, {
      target: {
        value: [
          "time,speed,throttle,brake,x,y",
          "0,120,20,0,10,15",
          "1,150,55,0,14,19",
          "2,180,80,4,19,22"
        ].join("\n")
      }
    });

    fireEvent.click(screen.getByRole("button", { name: "Parse" }));
    expect(screen.getByText("Speed vs Time")).toBeInTheDocument();
    expect(screen.getByText("Throttle & Brake")).toBeInTheDocument();
    expect(screen.getByText("Track Map")).toBeInTheDocument();
  });

  it("parsing invalid csv shows validation message", () => {
    render(<TelemetryPlayground defaultCsv="" />);
    fireEvent.click(screen.getByRole("button", { name: "Parse" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Unable to parse CSV:")).toBeInTheDocument();
  });
});
