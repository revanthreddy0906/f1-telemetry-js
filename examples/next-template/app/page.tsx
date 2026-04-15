"use client";

import { TelemetryDashboard, fromOpenF1Telemetry } from "@revanthreddy0906/f1-telemetry-js";

const telemetry = fromOpenF1Telemetry(
  Array.from({ length: 200 }, (_, index) => {
    const time = index * 0.1;
    return {
      session_time: time,
      speed: 205 + Math.sin(time * 1.8) * 40,
      throttle: Math.max(0, Math.min(100, 70 + Math.sin(time * 2) * 30)),
      brake: index % 45 > 36 ? 42 : 0,
      x: Math.cos(time / 2.5) * 280,
      y: Math.sin(time / 2.5) * 175
    };
  })
);

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <TelemetryDashboard
        telemetry={telemetry}
        lapMode="overlay"
        processing={{ maxPoints: 350, downsampleStrategy: "min-max" }}
        annotations={[
          { type: "corner", time: 2.6, label: "T1" },
          { type: "drs", time: 7.4, label: "DRS" }
        ]}
      />
    </main>
  );
}
