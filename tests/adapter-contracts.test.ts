import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchOpenF1TelemetryWithDiagnostics,
  fromCsvTelemetryWithDiagnostics,
  fromFastF1TelemetryWithDiagnostics,
  fromJsonTelemetryWithDiagnostics,
  fromMultiViewerCarDataWithDiagnostics,
  fromOpenF1TelemetryWithDiagnostics,
  fromParquetWithDiagnostics
} from "../src";

const fixture = (name: string): string =>
  readFileSync(resolve(process.cwd(), "tests/fixtures/adapters", name), "utf8");

describe("adapter contracts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("validates FastF1 fixture contract", () => {
    const payload = JSON.parse(fixture("fastf1.json"));
    const result = fromFastF1TelemetryWithDiagnostics(payload, { validationMode: "strict" });
    expect(result.telemetry.time.length).toBe(3);
    expect(result.telemetry.channels?.gear).toEqual([4, 5, 6]);
    expect(result.validation.isValid).toBe(true);
  });

  it("validates OpenF1 fixture contract", () => {
    const payload = JSON.parse(fixture("openf1.json"));
    const result = fromOpenF1TelemetryWithDiagnostics(payload, { validationMode: "strict" });
    expect(result.telemetry.channels?.airTemp).toEqual([29, 29.1, 29.3]);
    expect(result.diagnostics.errorCount).toBe(0);
  });

  it("validates CSV fixture contract", () => {
    const csv = fixture("telemetry.csv");
    const result = fromCsvTelemetryWithDiagnostics(csv, { validationMode: "strict" });
    expect(result.telemetry.speed).toEqual([100, 118, 131]);
    expect(result.telemetry.channels?.gear).toEqual([4, 5, 6]);
  });

  it("validates JSON fixture contract with events path", () => {
    const payload = JSON.parse(fixture("json-telemetry.json"));
    const result = fromJsonTelemetryWithDiagnostics(payload, {
      dataPath: "payload.telemetry",
      eventsPath: "payload.events",
      fieldMapping: {
        time: "t",
        speed: "velocity",
        throttle: "controls.throttlePct",
        brake: "controls.brakePct",
        x: "pos.px",
        y: "pos.py",
        gear: "gear"
      },
      validationMode: "strict"
    });
    expect(result.telemetry.events?.[0].type).toBe("drs");
    expect(result.telemetry.channels?.gear).toEqual([3, 4, 5]);
    expect(result.validation.isValid).toBe(true);
  });

  it("validates Parquet fixture contract", () => {
    const payload = JSON.parse(fixture("parquet.json"));
    const result = fromParquetWithDiagnostics(payload, { validationMode: "strict" });
    expect(result.telemetry.time).toEqual([0, 1, 2]);
    expect(result.diagnostics.parsedSamples).toBe(3);
  });

  it("validates MultiViewer fixture contract", () => {
    const payload = JSON.parse(fixture("multiviewer-car-data.json"));
    const result = fromMultiViewerCarDataWithDiagnostics(payload, { validationMode: "strict" });
    expect(result.telemetry.channels?.gear).toEqual([4, 5, 6]);
    expect(result.telemetry.brake).toEqual([0, 0, 100]);
  });

  it("validates OpenF1 fetch contract", async () => {
    const payload = JSON.parse(fixture("openf1.json"));
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await fetchOpenF1TelemetryWithDiagnostics(9159, 1, {
      baseUrl: "https://api.openf1.org/v1",
      validationMode: "strict"
    });

    expect(result.telemetry.speed).toEqual([112, 128, 136]);
    expect(result.diagnostics.adapter).toBe("openf1-fetch");
  });
});
