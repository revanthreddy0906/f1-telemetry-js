import React from "react";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  TelemetryProvider,
  useAutoTheme,
  useChartExport,
  useCursorSync,
  useTelemetry,
  useTelemetryContext
} from "../src";
import type { FormattedTelemetry } from "../src/types/telemetry";

const sampleRawData = [
  { time: 0, speed: 120, throttle: 20, brake: 0, x: 10, y: 14 },
  { time: 1, speed: 150, throttle: 55, brake: 0, x: 14, y: 19 }
];

const sampleTelemetry: FormattedTelemetry = {
  time: [0, 1, 2],
  speed: [100, 120, 140],
  throttle: [30, 50, 70],
  brake: [0, 4, 2],
  x: [10, 15, 20],
  y: [12, 16, 19]
};

const setMatchMedia = (matchesLight: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      media: query,
      matches: query.includes("light") ? matchesLight : !matchesLight,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
};

describe("hooks", () => {
  describe("useTelemetry", () => {
    it("returns null telemetry initially when no data is provided", () => {
      const { result } = renderHook(() => useTelemetry());
      expect(result.current.telemetry).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("parses and validates telemetry from data prop", async () => {
      const { result } = renderHook(() => useTelemetry({ data: sampleRawData }));
      await waitFor(() => expect(result.current.telemetry?.time).toEqual([0, 1]));
      expect(result.current.validation?.isValid).toBe(true);
    });

    it("sets loading state and parses fetcher payload", async () => {
      const fetcher = vi.fn(async () => sampleRawData);
      const { result } = renderHook(() => useTelemetry({ fetcher }));

      await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.telemetry?.speed).toEqual([120, 150]);
    });

    it("handles fetch errors", async () => {
      const fetcher = vi.fn(async () => {
        throw new Error("network failed");
      });
      const { result } = renderHook(() => useTelemetry({ fetcher }));
      await waitFor(() => expect(result.current.error?.message).toContain("network failed"));
      expect(result.current.telemetry).toBeNull();
    });

    it("reset clears all state", async () => {
      const { result } = renderHook(() => useTelemetry({ data: sampleRawData }));
      await waitFor(() => expect(result.current.telemetry).not.toBeNull());

      act(() => result.current.reset());

      expect(result.current.telemetry).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.validation).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("calls custom adapter when provided", async () => {
      const raw = { records: [1, 2, 3] };
      const adapter = vi.fn((raw: unknown) => {
        expect(raw).toEqual({ records: [1, 2, 3] });
        return sampleTelemetry;
      });

      const { result } = renderHook(() => useTelemetry({ data: raw, adapter }));
      await waitFor(() => expect(result.current.telemetry?.time.length).toBe(3));
      expect(adapter).toHaveBeenCalledTimes(1);
    });
  });

  describe("useCursorSync", () => {
    it("tracks cursor state and reset behavior", () => {
      const { result } = renderHook(() => useCursorSync());
      expect(result.current.cursorTime).toBeNull();
      expect(result.current.cursorProps.showCursor).toBe(true);

      act(() => result.current.setCursorTime(12.5));
      expect(result.current.cursorTime).toBe(12.5);
      expect(result.current.cursorProps.cursorTime).toBe(12.5);

      act(() => result.current.resetCursor());
      expect(result.current.cursorTime).toBeNull();
    });
  });

  describe("useAutoTheme", () => {
    it("returns light when prefers-color-scheme light matches", () => {
      setMatchMedia(true);
      const { result } = renderHook(() => useAutoTheme());
      expect(result.current).toBe("light");
    });

    it("returns dark when prefers-color-scheme light does not match", () => {
      setMatchMedia(false);
      const { result } = renderHook(() => useAutoTheme());
      expect(result.current).toBe("dark");
    });

    it("returns fallback when matchMedia is unavailable", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: undefined
      });
      const { result } = renderHook(() => useAutoTheme("light"));
      expect(result.current).toBe("light");
    });
  });

  describe("TelemetryProvider", () => {
    it("renders children and exposes telemetry context values", async () => {
      const Consumer = () => {
        const context = useTelemetryContext();
        return (
          <div>
            <span>theme:{context.theme}</span>
            <span>samples:{context.telemetry?.time.length ?? 0}</span>
            <button onClick={() => context.setTheme("light")}>set-light</button>
          </div>
        );
      };

      render(
        <TelemetryProvider initialData={sampleTelemetry} theme="dark">
          <Consumer />
        </TelemetryProvider>
      );

      await waitFor(() => expect(screen.getByText("samples:3")).toBeInTheDocument());
      expect(screen.getByText("theme:dark")).toBeInTheDocument();

      act(() => screen.getByText("set-light").click());
      expect(screen.getByText("theme:light")).toBeInTheDocument();
    });

    it("throws when useTelemetryContext is called outside provider", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => renderHook(() => useTelemetryContext())).toThrow(
        "useTelemetryContext must be used within a <TelemetryProvider>"
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("useChartExport", () => {
    it("starts with null chart ref and returns null export when canvas is missing", () => {
      const { result } = renderHook(() => useChartExport());
      expect(result.current.chartRef.current).toBeNull();
      expect(result.current.toDataURL()).toBeNull();
    });
  });
});
