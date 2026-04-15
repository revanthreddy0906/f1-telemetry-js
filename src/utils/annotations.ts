import type { ChartDataset } from "chart.js";
import type { TelemetryAnnotation, TelemetryStyleTokens } from "../types/telemetry";
import { findNearestIndex } from "./processing";

const TYPE_COLORS: Record<TelemetryAnnotation["type"], keyof TelemetryStyleTokens> = {
  corner: "primary",
  drs: "accent",
  incident: "danger"
};

const TYPE_LABELS: Record<TelemetryAnnotation["type"], string> = {
  corner: "Corners",
  drs: "DRS Zones",
  incident: "Incidents"
};

export const getAnnotationColor = (
  annotation: TelemetryAnnotation,
  palette: TelemetryStyleTokens
): string => annotation.color ?? palette[TYPE_COLORS[annotation.type]];

export const getAnnotationTimes = (annotations: TelemetryAnnotation[] | undefined): number[] =>
  (annotations ?? [])
    .map((annotation) => annotation.time)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

export const createLineAnnotationDatasets = (
  annotations: TelemetryAnnotation[] | undefined,
  time: number[],
  valueSeries: number[],
  palette: TelemetryStyleTokens
): ChartDataset<"line", { x: number; y: number }[]>[] => {
  if (!annotations || annotations.length === 0 || time.length === 0) {
    return [];
  }

  const grouped = new Map<TelemetryAnnotation["type"], Array<{ x: number; y: number }>>();

  annotations.forEach((annotation) => {
    const annotationTime = annotation.time;
    if (annotationTime === undefined) {
      return;
    }
    const index = findNearestIndex(time, annotationTime);
    if (index < 0) {
      return;
    }

    const points = grouped.get(annotation.type) ?? [];
    points.push({
      x: time[index],
      y: valueSeries[index]
    });
    grouped.set(annotation.type, points);
  });

  return Array.from(grouped.entries()).map(([type, points]) => {
    const color = palette[TYPE_COLORS[type]];
    const pointStyle = type === "corner" ? "triangle" : type === "drs" ? "rectRounded" : "crossRot";

    return {
      label: TYPE_LABELS[type],
      data: points,
      showLine: false,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointStyle,
      borderColor: color,
      backgroundColor: color
    };
  });
};

export const createTrackAnnotationDataset = (
  annotations: TelemetryAnnotation[] | undefined,
  trackPoints: Array<{ x: number; y: number }>,
  time: number[],
  palette: TelemetryStyleTokens
): ChartDataset<"scatter", { x: number; y: number }[]>[] => {
  if (!annotations || annotations.length === 0) {
    return [];
  }

  const byType = new Map<TelemetryAnnotation["type"], Array<{ x: number; y: number }>>();

  annotations.forEach((annotation) => {
    if (typeof annotation.x === "number" && typeof annotation.y === "number") {
      const points = byType.get(annotation.type) ?? [];
      points.push({ x: annotation.x, y: annotation.y });
      byType.set(annotation.type, points);
      return;
    }

    if (typeof annotation.time === "number" && time.length > 0) {
      const index = findNearestIndex(time, annotation.time);
      if (index >= 0 && trackPoints[index]) {
        const points = byType.get(annotation.type) ?? [];
        points.push(trackPoints[index]);
        byType.set(annotation.type, points);
      }
    }
  });

  return Array.from(byType.entries()).map(([type, points]) => {
    const color = palette[TYPE_COLORS[type]];
    const pointStyle = type === "corner" ? "triangle" : type === "drs" ? "rectRounded" : "crossRot";

    return {
      label: TYPE_LABELS[type],
      data: points,
      showLine: false,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointStyle,
      borderColor: color,
      backgroundColor: color
    };
  });
};
