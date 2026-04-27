import type { TelemetryPanelExtension } from "../types/telemetry";

export const TELEMETRY_EXTENSION_API_VERSION = "2.0.0";

export interface VersionedTelemetryPanelExtension extends TelemetryPanelExtension {
  apiVersion?: string;
  minCoreVersion?: string;
}

const getMajorVersion = (value: string): number => {
  const [major] = value.split(".");
  const parsed = Number(major);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const assertTelemetryExtensionCompatible = (extension: VersionedTelemetryPanelExtension): void => {
  const extensionApiVersion = extension.apiVersion ?? TELEMETRY_EXTENSION_API_VERSION;
  if (getMajorVersion(extensionApiVersion) !== getMajorVersion(TELEMETRY_EXTENSION_API_VERSION)) {
    throw new Error(
      `Telemetry extension "${extension.id}" is incompatible with API ${TELEMETRY_EXTENSION_API_VERSION}.`
    );
  }
};

export const normalizeTelemetryPanelExtension = (
  extension: VersionedTelemetryPanelExtension
): VersionedTelemetryPanelExtension => {
  assertTelemetryExtensionCompatible(extension);
  return {
    ...extension,
    apiVersion: extension.apiVersion ?? TELEMETRY_EXTENSION_API_VERSION
  };
};
