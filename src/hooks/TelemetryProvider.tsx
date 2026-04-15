import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import type {
  DataProcessingOptions,
  FormattedTelemetry,
  TelemetryStyleTokens,
  TelemetryValidationResult,
  ThemeMode
} from "../types/telemetry";
import { useAutoTheme } from "./useAutoTheme";
import { useCursorSync } from "./useCursorSync";
import { useTelemetry } from "./useTelemetry";

export interface TelemetryContextValue {
  telemetry: FormattedTelemetry | null;
  setTelemetry: (data: FormattedTelemetry) => void;
  isLoading: boolean;
  error: Error | null;
  validation: TelemetryValidationResult | null;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cursorTime: number | null;
  setCursorTime: (time: number | null) => void;
  cursorProps: {
    showCursor: true;
    cursorTime: number | null;
    onCursorTimeChange: (time: number | null) => void;
  };
  processing?: DataProcessingOptions;
  styleTokens?: Partial<TelemetryStyleTokens>;
}

export interface TelemetryProviderProps {
  initialData?: FormattedTelemetry;
  fetcher?: () => Promise<unknown>;
  adapter?: (data: unknown) => FormattedTelemetry;
  theme?: ThemeMode;
  autoTheme?: boolean;
  processing?: DataProcessingOptions;
  styleTokens?: Partial<TelemetryStyleTokens>;
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

/**
 * App-level telemetry context provider with shared theme and cursor sync state.
 */
export const TelemetryProvider = ({
  children,
  initialData,
  fetcher,
  adapter,
  theme: themeProp = "dark",
  autoTheme = false,
  processing,
  styleTokens
}: PropsWithChildren<TelemetryProviderProps>) => {
  const telemetryState = useTelemetry({
    data: initialData,
    fetcher,
    adapter,
    processing
  });
  const detectedTheme = useAutoTheme(themeProp);
  const [manualTheme, setManualTheme] = useState<ThemeMode>(themeProp);
  const { cursorTime, setCursorTime, cursorProps } = useCursorSync();

  const theme = autoTheme ? detectedTheme : manualTheme;

  const value = useMemo<TelemetryContextValue>(
    () => ({
      telemetry: telemetryState.telemetry,
      setTelemetry: telemetryState.setTelemetry,
      isLoading: telemetryState.isLoading,
      error: telemetryState.error,
      validation: telemetryState.validation,
      theme,
      setTheme: setManualTheme,
      cursorTime,
      setCursorTime,
      cursorProps,
      processing,
      styleTokens
    }),
    [
      telemetryState.telemetry,
      telemetryState.setTelemetry,
      telemetryState.isLoading,
      telemetryState.error,
      telemetryState.validation,
      theme,
      cursorTime,
      setCursorTime,
      cursorProps,
      processing,
      styleTokens
    ]
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

/**
 * Access shared telemetry context from a TelemetryProvider tree.
 */
export const useTelemetryContext = (): TelemetryContextValue => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetryContext must be used within a <TelemetryProvider>");
  }
  return context;
};
