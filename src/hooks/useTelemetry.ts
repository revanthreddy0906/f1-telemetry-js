import { useCallback, useEffect, useRef, useState } from "react";
import { formatTelemetry } from "../utils/formatTelemetry";
import { processSeriesData } from "../utils/processing";
import { validateTelemetry } from "../utils/validation";
import type {
  DataProcessingOptions,
  FormattedTelemetry,
  RawTelemetryInput,
  TelemetryExtraChannel,
  ValidationMode,
  TelemetryValidationResult
} from "../types/telemetry";

export interface UseTelemetryOptions {
  data?: unknown;
  adapter?: (data: unknown) => FormattedTelemetry;
  fetcher?: () => Promise<unknown>;
  validate?: boolean;
  validationMode?: ValidationMode;
  processing?: DataProcessingOptions;
}

export interface UseTelemetryResult {
  telemetry: FormattedTelemetry | null;
  isLoading: boolean;
  error: Error | null;
  validation: TelemetryValidationResult | null;
  setTelemetry: (data: FormattedTelemetry) => void;
  refetch: () => void;
  reset: () => void;
}

const EMPTY_TELEMETRY: FormattedTelemetry = {
  time: [],
  speed: [],
  throttle: [],
  brake: [],
  x: [],
  y: []
};

const processTelemetry = (
  telemetry: FormattedTelemetry,
  processing?: DataProcessingOptions
): FormattedTelemetry => {
  if (!processing) {
    return telemetry;
  }

  const result = processSeriesData<{
    speed: number[];
    throttle: number[];
    brake: number[];
    x: number[];
    y: number[];
  }>({
    context: "useTelemetry",
    time: telemetry.time,
    seriesMap: {
      speed: telemetry.speed,
      throttle: telemetry.throttle,
      brake: telemetry.brake,
      x: telemetry.x,
      y: telemetry.y
    },
    processing
  });

  const processedChannels = telemetry.channels
    ? (Object.fromEntries(
        Object.entries(telemetry.channels).map(([channel, values]) => {
          const channelResult = processSeriesData<{ values: number[] }>({
            context: `useTelemetry.channels.${channel}`,
            time: telemetry.time,
            seriesMap: {
              values: values ?? []
            },
            processing
          });
          return [channel, channelResult.seriesMap.values ?? []];
        })
      ) as Partial<Record<TelemetryExtraChannel, number[]>>)
    : undefined;

  const processedEvents = telemetry.events
    ? telemetry.events.filter((event) => {
        const start = processing.window?.startTime;
        const end = processing.window?.endTime;
        if (typeof start === "number" && event.time < start) {
          return false;
        }
        if (typeof end === "number" && event.time > end) {
          return false;
        }
        return true;
      })
    : undefined;

  return {
    time: result.time,
    speed: result.seriesMap.speed ?? EMPTY_TELEMETRY.speed,
    throttle: result.seriesMap.throttle ?? EMPTY_TELEMETRY.throttle,
    brake: result.seriesMap.brake ?? EMPTY_TELEMETRY.brake,
    x: result.seriesMap.x ?? EMPTY_TELEMETRY.x,
    y: result.seriesMap.y ?? EMPTY_TELEMETRY.y,
    channels: processedChannels,
    events: processedEvents,
    timeReference: telemetry.timeReference
  };
};

/**
 * Parse, validate, process, and optionally fetch telemetry data.
 */
export const useTelemetry = (options: UseTelemetryOptions = {}): UseTelemetryResult => {
  const {
    data,
    adapter,
    fetcher,
    validate: shouldValidate = true,
    validationMode = "strict",
    processing
  } = options;

  const [telemetry, setTelemetryState] = useState<FormattedTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validation, setValidation] = useState<TelemetryValidationResult | null>(null);

  const fetcherRef = useRef(fetcher);
  const requestIdRef = useRef(0);
  fetcherRef.current = fetcher;

  const parseTelemetry = useCallback(
    (rawData: unknown): FormattedTelemetry => {
      if (adapter) {
        return adapter(rawData);
      }
      return formatTelemetry(rawData as RawTelemetryInput);
    },
    [adapter]
  );

  const applyAndStore = useCallback(
    (nextTelemetry: FormattedTelemetry) => {
      const processed = processTelemetry(nextTelemetry, processing);
      setTelemetryState(processed);
      setError(null);
      if (shouldValidate) {
        setValidation(validateTelemetry(processed, "useTelemetry", { mode: validationMode }));
      } else {
        setValidation(null);
      }
    },
    [processing, shouldValidate, validationMode]
  );

  useEffect(() => {
    if (data === undefined || data === null) {
      return;
    }

    try {
      const parsed = parseTelemetry(data);
      applyAndStore(parsed);
    } catch (err) {
      setTelemetryState(null);
      setValidation(null);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [data, parseTelemetry, applyAndStore]);

  const refetch = useCallback(() => {
    const runFetcher = fetcherRef.current;
    if (!runFetcher) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setError(null);

    runFetcher()
      .then((rawData) => {
        if (requestIdRef.current !== requestId) {
          return;
        }
        const parsed = parseTelemetry(rawData);
        applyAndStore(parsed);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) {
          return;
        }
        setTelemetryState(null);
        setValidation(null);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      });
  }, [parseTelemetry, applyAndStore]);

  useEffect(() => {
    if (fetcher) {
      refetch();
    }
  }, [fetcher, refetch]);

  const setTelemetry = useCallback(
    (nextTelemetry: FormattedTelemetry) => {
      applyAndStore(nextTelemetry);
    },
    [applyAndStore]
  );

  const reset = useCallback(() => {
    setTelemetryState(null);
    setIsLoading(false);
    setError(null);
    setValidation(null);
  }, []);

  return {
    telemetry,
    isLoading,
    error,
    validation,
    setTelemetry,
    refetch,
    reset
  };
};
