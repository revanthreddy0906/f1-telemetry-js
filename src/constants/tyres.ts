import type { TyreCompound } from "../types/telemetry";

export interface TyreCompoundInfo {
  compound: TyreCompound;
  label: string;
  color: string;
  pirelli: string;
}

export interface RaceCompoundAllocation {
  trackId: string;
  hard: string;
  medium: string;
  soft: string;
}

export const TYRE_COMPOUNDS: Record<TyreCompound, TyreCompoundInfo> = {
  soft: { compound: "soft", label: "Soft", color: "#FF3333", pirelli: "C3-C5" },
  medium: { compound: "medium", label: "Medium", color: "#FFC700", pirelli: "C2-C4" },
  hard: { compound: "hard", label: "Hard", color: "#FFFFFF", pirelli: "C1-C3" },
  intermediate: {
    compound: "intermediate",
    label: "Intermediate",
    color: "#47C747",
    pirelli: "Intermediate"
  },
  wet: { compound: "wet", label: "Wet", color: "#3D9BE9", pirelli: "Full Wet" }
} as const;

export const RACE_COMPOUND_ALLOCATIONS: RaceCompoundAllocation[] = [
  { trackId: "bahrain", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "jeddah", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "albert_park", hard: "C2", medium: "C3", soft: "C4" },
  { trackId: "monaco", hard: "C3", medium: "C4", soft: "C5" },
  { trackId: "silverstone", hard: "C1", medium: "C2", soft: "C3" },
  { trackId: "monza", hard: "C2", medium: "C3", soft: "C4" },
  { trackId: "singapore", hard: "C3", medium: "C4", soft: "C5" },
  { trackId: "spa", hard: "C1", medium: "C2", soft: "C3" }
];

export const getRaceCompounds = (trackId: string): RaceCompoundAllocation | undefined =>
  RACE_COMPOUND_ALLOCATIONS.find((allocation) => allocation.trackId === trackId);

export const getTyreColor = (compound: TyreCompound): string =>
  TYRE_COMPOUNDS[compound]?.color ?? "#FFFFFF";
