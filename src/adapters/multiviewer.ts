import { formatTelemetry } from "../utils/formatTelemetry";
import type { FormattedTelemetry, RawTelemetryPoint } from "../types/telemetry";
import { parseLapTimeString, toNumber } from "./shared";

export interface MultiViewerCarData {
  timestamp: string;
  driverNumber: number;
  channels: {
    speed?: number;
    rpm?: number;
    gear?: number;
    throttle?: number;
    brake?: number | boolean;
    drs?: number;
  };
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface MultiViewerTimingData {
  driverNumber: number;
  driverCode: string;
  position: number;
  gapToLeader?: string;
  lastLapTime?: string;
  bestLapTime?: string;
  sector1?: string;
  sector2?: string;
  sector3?: string;
  tyreCompound?: string;
  tyreAge?: number;
}

export interface MultiViewerSessionData {
  sessionType: string;
  carData?: MultiViewerCarData[];
  timingData?: MultiViewerTimingData[];
}

export interface MultiViewerParsedTiming {
  driverNumber: number;
  driverCode: string;
  position: number;
  gapToLeader: number | null;
  lastLapTime: number | null;
  bestLapTime: number | null;
  sectors: Array<number | null>;
  tyreCompound: string | null;
  tyreAge: number | null;
}

const parseGap = (gap: string | undefined): number | null => {
  if (!gap) {
    return null;
  }
  const normalized = gap.trim();
  if (!normalized || /lap/i.test(normalized)) {
    return null;
  }
  const parsed = toNumber(normalized.replace(/^\+/, ""));
  return parsed ?? null;
};

export const fromMultiViewerCarData = (data: MultiViewerCarData[]): FormattedTelemetry => {
  if (!Array.isArray(data) || data.length === 0) {
    return formatTelemetry([]);
  }

  const sorted = [...data].sort(
    (left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp)
  );
  const start = Date.parse(sorted[0].timestamp);

  const points = sorted.map((entry, index): RawTelemetryPoint => {
    const brakeValue =
      typeof entry.channels.brake === "boolean"
        ? entry.channels.brake
          ? 100
          : 0
        : entry.channels.brake;

    return {
      time: Number.isFinite(start)
        ? (Date.parse(entry.timestamp) - start) / 1_000
        : index,
      speed: toNumber(entry.channels.speed) ?? 0,
      throttle: toNumber(entry.channels.throttle) ?? 0,
      brake: toNumber(brakeValue) ?? 0,
      x: toNumber(entry.position?.x) ?? 0,
      y: toNumber(entry.position?.y) ?? 0
    };
  });

  return formatTelemetry(points);
};

export const fromMultiViewerTiming = (
  data: MultiViewerTimingData[]
): MultiViewerParsedTiming[] =>
  data.map((entry) => ({
    driverNumber: entry.driverNumber,
    driverCode: entry.driverCode,
    position: entry.position,
    gapToLeader: parseGap(entry.gapToLeader),
    lastLapTime: entry.lastLapTime ? parseLapTimeString(entry.lastLapTime) : null,
    bestLapTime: entry.bestLapTime ? parseLapTimeString(entry.bestLapTime) : null,
    sectors: [
      entry.sector1 ? parseLapTimeString(entry.sector1) : null,
      entry.sector2 ? parseLapTimeString(entry.sector2) : null,
      entry.sector3 ? parseLapTimeString(entry.sector3) : null
    ],
    tyreCompound: entry.tyreCompound ?? null,
    tyreAge: toNumber(entry.tyreAge) ?? null
  }));
