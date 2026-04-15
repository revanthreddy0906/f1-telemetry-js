export const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const parseClockLikeTime = (value: string): number | null => {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return Number(normalized);
  }

  const dayMatch = normalized.match(/(\d+)\s+days?\s+(\d+):(\d+):(\d+(?:\.\d+)?)/i);
  if (dayMatch) {
    const [, days, hours, minutes, seconds] = dayMatch;
    return (
      Number(days) * 86_400 +
      Number(hours) * 3_600 +
      Number(minutes) * 60 +
      Number(seconds)
    );
  }

  const segments = normalized.split(":");
  if (segments.length === 3) {
    return Number(segments[0]) * 3_600 + Number(segments[1]) * 60 + Number(segments[2]);
  }
  if (segments.length === 2) {
    return Number(segments[0]) * 60 + Number(segments[1]);
  }

  return null;
};

export const toSeconds = (value: unknown): number | null => {
  const direct = toNumber(value);
  if (direct !== null) {
    return direct;
  }

  if (value instanceof Date) {
    return value.getTime() / 1_000;
  }

  if (typeof value === "string") {
    const clock = parseClockLikeTime(value);
    if (clock !== null && Number.isFinite(clock)) {
      return clock;
    }

    const dateTimestamp = Date.parse(value);
    if (Number.isFinite(dateTimestamp)) {
      return dateTimestamp / 1_000;
    }
  }

  return null;
};

export const pickField = <T extends Record<string, unknown>>(
  point: T,
  keys: string[]
): unknown => {
  for (const key of keys) {
    if (key in point) {
      return point[key];
    }
  }
  return undefined;
};
