import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), "utf8");

describe("framework wrapper parity", () => {
  it("vue and svelte wrappers re-export core telemetry utilities", () => {
    const vueSource = readSource("packages/vue/src/index.ts");
    const svelteSource = readSource("packages/svelte/src/index.ts");

    expect(vueSource).toContain('export * from "f1-telemetry-js/core"');
    expect(vueSource).toContain("createVueTelemetryState");
    expect(svelteSource).toContain('export * from "f1-telemetry-js/core"');
    expect(svelteSource).toContain("createSvelteTelemetryState");
  });

  it("react-native wrapper includes track-series helper", () => {
    const reactNativeSource = readSource("packages/react-native-core/src/index.ts");
    expect(reactNativeSource).toContain('export * from "f1-telemetry-js/core"');
    expect(reactNativeSource).toContain("toReactNativeTrackSeries");
  });
});
