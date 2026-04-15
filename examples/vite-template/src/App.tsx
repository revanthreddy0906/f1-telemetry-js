import { TelemetryDashboard, fromCsvTelemetry } from "f1-telemetry-js";

const csv = `time,speed,throttle,brake,x,y
0,125,30,0,10,8
1,150,52,0,16,11
2,184,78,4,22,16
3,214,88,0,28,18
4,202,64,20,32,14`;

const telemetry = fromCsvTelemetry(csv);

export const App = () => (
  <div style={{ padding: 20, background: "#060d1a", minHeight: "100vh" }}>
    <TelemetryDashboard
      telemetry={telemetry}
      lapMode="delta"
      annotations={[
        { type: "corner", time: 1.4, label: "T1" },
        { type: "drs", time: 2.6, label: "DRS" },
        { type: "incident", time: 3.2, label: "Lock-up" }
      ]}
      styleTokens={{
        background: "#0e1628",
        border: "rgba(255,255,255,0.1)"
      }}
    />
  </div>
);
