import { describe, expect, it } from "vitest";
import {
  F1_DRIVERS,
  F1_TEAMS,
  FLAG_TYPES,
  RACE_CALENDAR_2025,
  TEAM_COLORS,
  TRACKS,
  TYRE_COMPOUNDS,
  getDriver,
  getDriverColor,
  getFlag,
  getNextRace,
  getRaceByRound,
  getSprintWeekends,
  getTeam,
  getTrack
} from "../src";

describe("F1 domain constants", () => {
  it("has 10 teams and 20 drivers", () => {
    expect(F1_TEAMS).toHaveLength(10);
    expect(F1_DRIVERS).toHaveLength(20);
  });

  it("ensures each team has exactly two drivers", () => {
    F1_TEAMS.forEach((team) => {
      expect(team.drivers).toHaveLength(2);
    });
  });

  it("ensures every driver's team exists", () => {
    const teamIds = new Set(F1_TEAMS.map((team) => team.id));
    F1_DRIVERS.forEach((driver) => {
      expect(teamIds.has(driver.teamId)).toBe(true);
    });
  });

  it("contains team colors for every team", () => {
    F1_TEAMS.forEach((team) => {
      expect(TEAM_COLORS[team.id]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("looks up team/driver helpers", () => {
    expect(getTeam("red_bull")?.shortName).toBe("Red Bull");
    expect(getDriver("VER")?.fullName).toBe("Max Verstappen");
    expect(getDriverColor("HAM")).toBe("#E8002D");
  });

  it("validates tracks and track helpers", () => {
    expect(TRACKS.length).toBeGreaterThan(0);
    TRACKS.forEach((track) => {
      expect(Number.isFinite(track.lat)).toBe(true);
      expect(Number.isFinite(track.lng)).toBe(true);
    });
    expect(getTrack("monaco")?.name).toContain("Monaco");
  });

  it("contains tyre compounds and valid colors", () => {
    expect(Object.keys(TYRE_COMPOUNDS).sort()).toEqual(
      ["hard", "intermediate", "medium", "soft", "wet"].sort()
    );
    Object.values(TYRE_COMPOUNDS).forEach((compound) => {
      expect(compound.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("contains standard flag types", () => {
    expect(FLAG_TYPES.length).toBeGreaterThanOrEqual(10);
    expect(getFlag("yellow")?.name).toContain("Yellow");
  });

  it("contains full 2025 calendar and helper behavior", () => {
    expect(RACE_CALENDAR_2025).toHaveLength(24);
    expect(getRaceByRound(1)?.trackId).toBe("albert_park");
    expect(getSprintWeekends().length).toBeGreaterThanOrEqual(5);
    expect(getNextRace(new Date("2025-03-10"))?.round).toBe(1);
  });

  it("has no duplicate rounds, teams, or drivers", () => {
    const rounds = RACE_CALENDAR_2025.map((race) => race.round);
    expect(new Set(rounds).size).toBe(rounds.length);

    const teamIds = F1_TEAMS.map((team) => team.id);
    expect(new Set(teamIds).size).toBe(teamIds.length);

    const driverCodes = F1_DRIVERS.map((driver) => driver.code);
    expect(new Set(driverCodes).size).toBe(driverCodes.length);
  });
});
