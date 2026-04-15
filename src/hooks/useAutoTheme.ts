import { useEffect, useState } from "react";
import type { ThemeMode } from "../types/telemetry";

/**
 * Resolve theme from OS color-scheme preference.
 */
export const useAutoTheme = (fallback: ThemeMode = "dark"): ThemeMode => {
  const getPreferredTheme = (): ThemeMode => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return fallback;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateTheme = (matchesLight: boolean) => setTheme(matchesLight ? "light" : "dark");
    updateTheme(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      const handler = (event: MediaQueryListEvent) => updateTheme(event.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }

    if (typeof mediaQuery.addListener === "function") {
      const legacyHandler = (event: MediaQueryListEvent) => updateTheme(event.matches);
      mediaQuery.addListener(legacyHandler);
      return () => mediaQuery.removeListener(legacyHandler);
    }
  }, [fallback]);

  return theme;
};
