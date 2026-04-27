<script setup lang="ts">
import { fromCsvTelemetry, computeLapTimes } from "@f1-telemetry-js/vue";

const telemetry = fromCsvTelemetry(`time,speed,throttle,brake,x,y
0,120,20,0,10,15
1,145,45,0,14,19
2,180,80,4,19,22`);

const lapTimes = computeLapTimes(telemetry);
</script>

<template>
  <main>
    <h1>Vue telemetry template</h1>
    <p>Samples: {{ telemetry.time.length }}</p>
    <p>Computed laps: {{ lapTimes.length }}</p>
  </main>
</template>
