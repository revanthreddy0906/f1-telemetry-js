import { parseLapTimeString, toNumber } from "./shared";

export interface ErgastDriver {
  driverId: string;
  permanentNumber: string;
  code: string;
  givenName: string;
  familyName: string;
}

export interface ErgastConstructor {
  constructorId: string;
  name: string;
}

export interface ErgastRaceResult {
  number: string;
  position: string;
  points: string;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed: { speed: string; units: string };
  };
}

export interface ErgastLapTime {
  number: string;
  Timings: Array<{
    driverId: string;
    position: string;
    time: string;
  }>;
}

export interface ErgastRaceData {
  raceName: string;
  round: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  Results?: ErgastRaceResult[];
  Laps?: ErgastLapTime[];
}

export interface ParsedRaceResult {
  driver: string;
  driverFullName: string;
  team: string;
  position: number;
  gridPosition: number;
  points: number;
  lapsCompleted: number;
  status: string;
  totalTimeMs?: number;
  fastestLapTime?: number;
  fastestLapNumber?: number;
  fastestLapRank?: number;
  averageSpeedKmh?: number;
}

export interface ParsedLapTimes {
  driver: string;
  laps: Array<{
    lap: number;
    position: number;
    time: number;
  }>;
}

export interface ErgastParsedData {
  raceName: string;
  round: number;
  circuit: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    locality: string;
    country: string;
  };
  results: ParsedRaceResult[];
  lapTimes: ParsedLapTimes[];
}

const asRequiredNumber = (value: unknown): number => toNumber(value) ?? 0;

export const fromErgastApi = (data: ErgastRaceData): ErgastParsedData => {
  const results = (data.Results ?? []).map<ParsedRaceResult>((result) => {
    const fastestLapTime = result.FastestLap?.Time?.time
      ? parseLapTimeString(result.FastestLap.Time.time) ?? undefined
      : undefined;

    return {
      driver: result.Driver.code,
      driverFullName: `${result.Driver.givenName} ${result.Driver.familyName}`.trim(),
      team: result.Constructor.name,
      position: asRequiredNumber(result.position),
      gridPosition: asRequiredNumber(result.grid),
      points: asRequiredNumber(result.points),
      lapsCompleted: asRequiredNumber(result.laps),
      status: result.status,
      totalTimeMs: toNumber(result.Time?.millis) ?? undefined,
      fastestLapTime,
      fastestLapNumber: toNumber(result.FastestLap?.lap) ?? undefined,
      fastestLapRank: toNumber(result.FastestLap?.rank) ?? undefined,
      averageSpeedKmh: toNumber(result.FastestLap?.AverageSpeed?.speed) ?? undefined
    };
  });

  const driverIdToCode = new Map<string, string>();
  (data.Results ?? []).forEach((result) => {
    driverIdToCode.set(result.Driver.driverId, result.Driver.code);
  });

  const lapMap = new Map<string, ParsedLapTimes["laps"]>();
  (data.Laps ?? []).forEach((lap) => {
    const lapNumber = asRequiredNumber(lap.number);
    lap.Timings.forEach((timing) => {
      const parsedLapTime = parseLapTimeString(timing.time);
      if (!Number.isFinite(parsedLapTime)) {
        return;
      }
      const driverCode = driverIdToCode.get(timing.driverId) ?? timing.driverId.toUpperCase();
      const current = lapMap.get(driverCode) ?? [];
      current.push({
        lap: lapNumber,
        position: asRequiredNumber(timing.position),
        time: parsedLapTime as number
      });
      lapMap.set(driverCode, current);
    });
  });

  const lapTimes: ParsedLapTimes[] = Array.from(lapMap.entries())
    .map(([driver, laps]) => ({
      driver,
      laps: laps.sort((left, right) => left.lap - right.lap)
    }))
    .sort((left, right) => left.driver.localeCompare(right.driver));

  return {
    raceName: data.raceName,
    round: asRequiredNumber(data.round),
    circuit: {
      id: data.Circuit.circuitId,
      name: data.Circuit.circuitName,
      lat: asRequiredNumber(data.Circuit.Location.lat),
      lng: asRequiredNumber(data.Circuit.Location.long),
      locality: data.Circuit.Location.locality,
      country: data.Circuit.Location.country
    },
    results,
    lapTimes
  };
};
