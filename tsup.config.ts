import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core.ts",
    performance: "src/performance.ts",
    adapters: "src/adapters-entry.ts",
    react: "src/react.ts",
    extensions: "src/extensions.ts"
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "chart.js", "react-chartjs-2"]
});
