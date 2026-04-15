import { describe, expect, it } from "vitest";
import {
  classifyTyreCompound,
  computeLapTimes,
  computeSectorTimes,
  computeSpeedDelta,
  computeTimeDelta,
  detectOvertakes,
  exportToCsv,
  exportToJson,
  fromCsvTelemetry,
  interpolateTelemetry,
  mergeTelemetry,
  normalizeDistance,
  type FormattedTelemetry
} from "../src";

const sampleTelemetry: FormattedTelemetry = {
  time: [0, 1, 2, 3],
  speed: [120, 130, 140, 150],
  throttle: [20, 40, 60, 80],
  brake: [0, 0, 10, 20],
  x: [0, 100, 200, 300],
  y: [0, 0, 0, 0]
};

const createCircularTelemetry = (laps = 3, pointsPerLap = 40, lapDuration = 80): FormattedTelemetry => {
  const totalPoints = laps * pointsPerLap + 1;
  const time: number[] = [];
  const x: number[] = [];
  const y: number[] = [];
  const speed: number[] = [];
  const throttle: number[] = [];
  const brake: number[] = [];

  for (let index = 0; index < totalPoints; index += 1) {
    const lapProgress = index / pointsPerLap;
    const angle = 2 * Math.PI * (lapProgress % 1);
    time.push(lapProgress * lapDuration);
    x.push(100 * Math.cos(angle));
    y.push(100 * Math.sin(angle));
    speed.push(220);
    throttle.push(80);
    brake.push(0);
  }

  return { time, speed, throttle, brake, x, y };
};

describe("computeLapTimes", () => {
  it("computes laps from explicit boundaries", () => {
    const laps = computeLapTimes(sampleTelemetry, [0, 82.4, 163.1, 244.8]);
    expect(laps).toHaveLength(3);
    expect(laps[0]).toEqual({ lap: 1, startTime: 0, endTime: 82.4, duration: 82.4 });
    expect(laps[1].duration).toBeCloseTo(80.7, 6);
  });

  it("returns empty for empty telemetry", () => {
    const laps = computeLapTimes({
      time: [],
      speed: [],
      throttle: [],
      brake: [],
      x: [],
      y: []
    });
    expect(laps).toEqual([]);
  });

  it("auto-detects laps from circular track coordinates", () => {
    const telemetry = createCircularTelemetry(3, 40, 80);
    const laps = computeLapTimes(telemetry);
    expect(laps).toHaveLength(3);
    expect(laps[0].duration).toBeCloseTo(80, 1);
  });
});

describe("computeSectorTimes", () => {
  const laps = [
    { lap: 1, startTime: 0, endTime: 80, duration: 80 },
    { lap: 2, startTime: 80, endTime: 161, duration: 81 }
  ];

  it("computes 3-sector split times", () => {
    const sectors = computeSectorTimes(laps, [30, 55], sampleTelemetry);
    expect(sectors).toHaveLength(2);
    expect(sectors[0].sectors.map((sector) => sector.duration)).toEqual([30, 25, 25]);
    expect(sectors[1].sectors).toHaveLength(3);
  });

  it("returns full lap as one sector when markers are empty", () => {
    const sectors = computeSectorTimes(laps, [], sampleTelemetry);
    expect(sectors[0].sectors).toEqual([{ sector: 1, duration: 80 }]);
  });

  it("clamps markers beyond lap duration", () => {
    const sectors = computeSectorTimes(laps, [200], sampleTelemetry);
    expect(sectors[0].sectors).toEqual([{ sector: 1, duration: 80 }]);
  });
});

describe("computeSpeedDelta", () => {
  it("subtracts directly on matching time bases", () => {
    const delta = computeSpeedDelta(
      { time: [0, 1, 2], speed: [100, 110, 120] },
      { time: [0, 1, 2], speed: [102, 108, 125] }
    );
    expect(delta).toEqual([
      { time: 0, delta: 2 },
      { time: 1, delta: -2 },
      { time: 2, delta: 5 }
    ]);
  });

  it("handles different lengths using nearest points and shorter output", () => {
    const delta = computeSpeedDelta(
      { time: [0, 1, 2, 3], speed: [100, 100, 100, 100] },
      { time: [0, 2], speed: [110, 90] }
    );
    expect(delta).toHaveLength(2);
  });

  it("returns empty on empty input", () => {
    const delta = computeSpeedDelta({ time: [], speed: [] }, { time: [0], speed: [100] });
    expect(delta).toEqual([]);
  });
});

describe("computeTimeDelta", () => {
  it("computes reasonable midpoint delta on known path", () => {
    const driver1: FormattedTelemetry = {
      ...sampleTelemetry,
      time: [0, 1, 2, 3]
    };
    const driver2: FormattedTelemetry = {
      ...sampleTelemetry,
      time: [0, 0.9, 1.8, 2.7]
    };
    const delta = computeTimeDelta(driver1, driver2);
    const midpoint = delta.find((point) => point.distance === 150);
    expect(midpoint?.timeDelta ?? 0).toBeCloseTo(0.15, 2);
  });

  it("returns empty for insufficient points", () => {
    const delta = computeTimeDelta(
      { ...sampleTelemetry, time: [0], x: [0], y: [0], speed: [100], throttle: [10], brake: [0] },
      sampleTelemetry
    );
    expect(delta).toEqual([]);
  });
});

describe("normalizeDistance", () => {
  it("computes cumulative euclidean distance", () => {
    const normalized = normalizeDistance({
      ...sampleTelemetry,
      x: [0, 3, 6],
      y: [0, 4, 8],
      time: [0, 1, 2],
      speed: [100, 110, 120],
      throttle: [10, 20, 30],
      brake: [0, 0, 0]
    });
    expect(normalized.time).toEqual([0, 5, 10]);
  });

  it("handles stationary car", () => {
    const normalized = normalizeDistance({
      ...sampleTelemetry,
      x: [5, 5, 5],
      y: [2, 2, 2],
      time: [0, 1, 2],
      speed: [0, 0, 0],
      throttle: [0, 0, 0],
      brake: [100, 100, 100]
    });
    expect(normalized.time).toEqual([0, 0, 0]);
  });

  it("returns empty telemetry for empty input", () => {
    const normalized = normalizeDistance({
      time: [],
      speed: [],
      throttle: [],
      brake: [],
      x: [],
      y: []
    });
    expect(normalized.time).toEqual([]);
  });
});

describe("detectOvertakes", () => {
  it("detects a direct position swap", () => {
    const events = detectOvertakes([
      { driver: "VER", positions: [1, 2] },
      { driver: "NOR", positions: [2, 1] }
    ]);
    expect(events).toEqual([{ lap: 2, overtaker: "NOR", overtaken: "VER", newPosition: 1 }]);
  });

  it("returns no events for stable order", () => {
    const events = detectOvertakes([
      { driver: "VER", positions: [1, 1, 1] },
      { driver: "LEC", positions: [2, 2, 2] }
    ]);
    expect(events).toEqual([]);
  });

  it("detects multiple events in a three-way swap", () => {
    const events = detectOvertakes([
      { driver: "VER", positions: [1, 3] },
      { driver: "LEC", positions: [2, 1] },
      { driver: "NOR", positions: [3, 2] }
    ]);
    expect(events).toHaveLength(2);
    expect(events[0].lap).toBe(2);
  });
});

describe("classifyTyreCompound", () => {
  it("classifies a fast-degrading stint as soft", () => {
    const result = classifyTyreCompound([80.0, 80.2, 80.5, 80.9, 81.4], 79.8);
    expect(result.compound).toBe("soft");
    expect(result.degradationRate).toBeGreaterThan(0.1);
  });

  it("classifies flat stint as hard", () => {
    const result = classifyTyreCompound([82, 82, 82, 82], 80);
    expect(result.compound).toBe("hard");
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it("returns hard with zero confidence when data is too short", () => {
    const result = classifyTyreCompound([81.2, 81.5], 80);
    expect(result).toMatchObject({ compound: "hard", confidence: 0 });
  });
});

describe("interpolateTelemetry", () => {
  it("aligns streams at the finer sample rate", () => {
    const [aligned1, aligned2] = interpolateTelemetry(
      sampleTelemetry,
      {
        ...sampleTelemetry,
        time: [0, 0.5, 1, 1.5, 2, 2.5, 3],
        speed: [120, 125, 130, 135, 140, 145, 150],
        throttle: [20, 30, 40, 50, 60, 70, 80],
        brake: [0, 0, 0, 5, 10, 15, 20],
        x: [0, 50, 100, 150, 200, 250, 300],
        y: [0, 0, 0, 0, 0, 0, 0]
      }
    );
    expect(aligned1.time).toEqual(aligned2.time);
    expect(aligned1.time).toHaveLength(7);
  });

  it("returns empty streams for non-overlapping ranges", () => {
    const [aligned1, aligned2] = interpolateTelemetry(
      sampleTelemetry,
      { ...sampleTelemetry, time: [10, 11, 12, 13] }
    );
    expect(aligned1.time).toEqual([]);
    expect(aligned2.time).toEqual([]);
  });

  it("uses custom resolution", () => {
    const [aligned1] = interpolateTelemetry(sampleTelemetry, sampleTelemetry, 1);
    expect(aligned1.time).toEqual([0, 1, 2, 3]);
  });
});

describe("mergeTelemetry", () => {
  it("concatenates telemetry and keeps time continuity", () => {
    const merged = mergeTelemetry(
      {
        time: [0, 1],
        speed: [100, 110],
        throttle: [40, 50],
        brake: [0, 0],
        x: [0, 1],
        y: [0, 0]
      },
      {
        time: [0, 1],
        speed: [120, 130],
        throttle: [60, 70],
        brake: [0, 5],
        x: [2, 3],
        y: [0, 0]
      }
    );
    expect(merged.time).toHaveLength(4);
    expect(merged.time[2]).toBeGreaterThan(merged.time[1]);
  });

  it("returns a copy for single source", () => {
    const merged = mergeTelemetry(sampleTelemetry);
    expect(merged).toEqual(sampleTelemetry);
    expect(merged).not.toBe(sampleTelemetry);
  });
});

describe("exportToJson", () => {
  it("exports rows format and round-trips shape", () => {
    const json = exportToJson(sampleTelemetry, "rows");
    const rows = JSON.parse(json) as Array<Record<string, number>>;
    expect(rows).toHaveLength(sampleTelemetry.time.length);
    expect(rows[0]).toMatchObject({ time: 0, speed: 120 });
  });

  it("exports columns format", () => {
    const json = exportToJson(sampleTelemetry, "columns");
    const columns = JSON.parse(json) as FormattedTelemetry;
    expect(columns.time).toEqual(sampleTelemetry.time);
    expect(columns.speed).toEqual(sampleTelemetry.speed);
  });
});

describe("exportToCsv", () => {
  it("includes header by default", () => {
    const csv = exportToCsv(sampleTelemetry);
    expect(csv.split("\n")[0]).toBe("time,speed,throttle,brake,x,y");
  });

  it("supports delimiter, precision, and channel filtering", () => {
    const csv = exportToCsv(sampleTelemetry, {
      delimiter: ";",
      precision: 0,
      channels: ["time", "speed"]
    });
    const [header, firstRow] = csv.split("\n");
    expect(header).toBe("time;speed");
    expect(firstRow).toBe("0;120");
  });

  it("round-trips with fromCsvTelemetry", () => {
    const csv = exportToCsv(sampleTelemetry, { precision: 3 });
    const parsed = fromCsvTelemetry(csv);
    expect(parsed.time[2]).toBeCloseTo(sampleTelemetry.time[2], 3);
    expect(parsed.speed[2]).toBeCloseTo(sampleTelemetry.speed[2], 3);
  });
});
