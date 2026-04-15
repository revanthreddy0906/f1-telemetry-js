import { useCallback, useMemo, useState } from "react";

export interface UseCursorSyncResult {
  cursorTime: number | null;
  setCursorTime: (time: number | null) => void;
  cursorProps: {
    showCursor: true;
    cursorTime: number | null;
    onCursorTimeChange: (time: number | null) => void;
  };
  resetCursor: () => void;
}

/**
 * Shared cursor state helper for synchronizing hover position across charts.
 */
export const useCursorSync = (): UseCursorSyncResult => {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const resetCursor = useCallback(() => setCursorTime(null), []);

  const cursorProps = useMemo(
    () => ({
      showCursor: true as const,
      cursorTime,
      onCursorTimeChange: setCursorTime
    }),
    [cursorTime]
  );

  return { cursorTime, setCursorTime, cursorProps, resetCursor };
};
