import React from "react";
import { Text, View } from "react-native";
import { fromCsvTelemetry, toReactNativeTrackSeries } from "@f1-telemetry-js/react-native-core";

const telemetry = fromCsvTelemetry(`time,speed,throttle,brake,x,y
0,120,20,0,10,15
1,145,45,0,14,19
2,180,80,4,19,22`);

const series = toReactNativeTrackSeries(telemetry);

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>React Native telemetry template</Text>
      <Text>Track points: {series.length}</Text>
      <Text>Top speed: {Math.max(...series.map((point) => point.speed)).toFixed(1)} km/h</Text>
    </View>
  );
}
