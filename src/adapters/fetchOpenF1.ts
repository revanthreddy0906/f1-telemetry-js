import type { FormattedTelemetry } from "../types/telemetry";
import { fromOpenF1Telemetry, type OpenF1TelemetryPoint } from "./openf1";

export interface OpenF1FetchOptions {
  baseUrl?: string;
  signal?: AbortSignal;
}

export interface OpenF1SessionInfo {
  sessionKey: number;
  sessionName: string;
  sessionType: string;
  circuitShortName: string;
  dateStart: string;
  dateEnd: string;
  year: number;
}

export interface OpenF1DriverInfo {
  driverNumber: number;
  fullName: string;
  nameAcronym: string;
  teamName: string;
  teamColour: string;
}

const DEFAULT_OPEN_F1_BASE_URL = "https://api.openf1.org/v1";

const buildUrl = (baseUrl: string, path: string, query: Record<string, string | number>): string => {
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
};

const fetchJson = async <T>(url: string, options: OpenF1FetchOptions): Promise<T> => {
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) {
    throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
};

export const fetchOpenF1Telemetry = async (
  sessionKey: number,
  driverNumber: number,
  options: OpenF1FetchOptions = {}
): Promise<FormattedTelemetry> => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "car_data", {
    session_key: sessionKey,
    driver_number: driverNumber
  });
  const data = await fetchJson<OpenF1TelemetryPoint[]>(url, options);
  return fromOpenF1Telemetry(data ?? []);
};

export const fetchOpenF1Sessions = async (
  year = new Date().getUTCFullYear(),
  options: OpenF1FetchOptions = {}
): Promise<OpenF1SessionInfo[]> => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "sessions", { year });
  const payload = await fetchJson<Array<Record<string, unknown>>>(url, options);
  return (payload ?? []).map((entry) => ({
    sessionKey: Number(entry.session_key ?? entry.sessionKey ?? 0),
    sessionName: String(entry.session_name ?? entry.sessionName ?? ""),
    sessionType: String(entry.session_type ?? entry.sessionType ?? ""),
    circuitShortName: String(entry.circuit_short_name ?? entry.circuitShortName ?? ""),
    dateStart: String(entry.date_start ?? entry.dateStart ?? ""),
    dateEnd: String(entry.date_end ?? entry.dateEnd ?? ""),
    year: Number(entry.year ?? 0)
  }));
};

export const fetchOpenF1Drivers = async (
  sessionKey: number,
  options: OpenF1FetchOptions = {}
): Promise<OpenF1DriverInfo[]> => {
  const baseUrl = options.baseUrl ?? DEFAULT_OPEN_F1_BASE_URL;
  const url = buildUrl(baseUrl, "drivers", { session_key: sessionKey });
  const payload = await fetchJson<Array<Record<string, unknown>>>(url, options);
  return (payload ?? []).map((entry) => ({
    driverNumber: Number(entry.driver_number ?? entry.driverNumber ?? 0),
    fullName: String(entry.full_name ?? entry.fullName ?? ""),
    nameAcronym: String(entry.name_acronym ?? entry.nameAcronym ?? ""),
    teamName: String(entry.team_name ?? entry.teamName ?? ""),
    teamColour: String(entry.team_colour ?? entry.teamColour ?? "")
  }));
};
