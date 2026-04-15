export interface FlagType {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  causesNeutralization: boolean;
}

export const FLAG_TYPES: readonly FlagType[] = [
  {
    id: "green",
    name: "Green Flag",
    description: "Track clear, racing resumes",
    color: "#00CC00",
    emoji: "🟢",
    causesNeutralization: false
  },
  {
    id: "yellow",
    name: "Yellow Flag",
    description: "Caution, danger on or near the track. No overtaking in the yellowed sector.",
    color: "#FFC700",
    emoji: "🟡",
    causesNeutralization: false
  },
  {
    id: "double_yellow",
    name: "Double Yellow Flag",
    description: "Great danger, slow down significantly. Be prepared to stop.",
    color: "#FFC700",
    emoji: "🟡🟡",
    causesNeutralization: false
  },
  {
    id: "red",
    name: "Red Flag",
    description: "Session stopped. All cars must return to the pit lane.",
    color: "#FF0000",
    emoji: "🔴",
    causesNeutralization: true
  },
  {
    id: "safety_car",
    name: "Safety Car",
    description: "Safety car deployed. All cars must form up behind the safety car.",
    color: "#FFA500",
    emoji: "🏎️",
    causesNeutralization: true
  },
  {
    id: "virtual_safety_car",
    name: "Virtual Safety Car (VSC)",
    description: "All cars must reduce speed to a delta time. No overtaking.",
    color: "#FFA500",
    emoji: "⚠️",
    causesNeutralization: true
  },
  {
    id: "blue",
    name: "Blue Flag",
    description: "Shown to a lapped car: let the faster car behind you pass.",
    color: "#0066FF",
    emoji: "🔵",
    causesNeutralization: false
  },
  {
    id: "white",
    name: "White Flag",
    description: "Slow-moving vehicle on track (recovery vehicle, medical car).",
    color: "#FFFFFF",
    emoji: "⚪",
    causesNeutralization: false
  },
  {
    id: "black",
    name: "Black Flag",
    description: "Driver disqualified. Must return to pits immediately.",
    color: "#000000",
    emoji: "⬛",
    causesNeutralization: false
  },
  {
    id: "black_orange",
    name: "Black and Orange Flag (Meatball)",
    description: "Car has mechanical issue. Driver must pit for repairs.",
    color: "#FF6600",
    emoji: "🟠",
    causesNeutralization: false
  },
  {
    id: "chequered",
    name: "Chequered Flag",
    description: "End of session.",
    color: "#000000",
    emoji: "🏁",
    causesNeutralization: false
  }
] as const;

export const getFlag = (id: string): FlagType | undefined =>
  FLAG_TYPES.find((flag) => flag.id === id);
