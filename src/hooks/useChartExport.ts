import { useCallback, useRef, type RefObject } from "react";

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ChartExportOptions {
  format?: ExportFormat;
  quality?: number;
  backgroundColor?: string;
  scale?: number;
  filename?: string;
}

export interface UseChartExportResult {
  chartRef: RefObject<HTMLDivElement>;
  toDataURL: (options?: ChartExportOptions) => string | null;
  toBlob: (options?: ChartExportOptions) => Promise<Blob | null>;
  downloadImage: (options?: ChartExportOptions) => void;
}

const resolveMimeType = (format: ExportFormat): string => `image/${format}`;

/**
 * Utilities for exporting Chart.js canvases to image formats.
 */
export const useChartExport = (): UseChartExportResult => {
  const chartRef = useRef<HTMLDivElement>(null);

  const getCanvas = useCallback((): HTMLCanvasElement | null => {
    if (!chartRef.current) {
      return null;
    }
    return chartRef.current.querySelector("canvas");
  }, []);

  const toDataURL = useCallback(
    (options: ChartExportOptions = {}): string | null => {
      const sourceCanvas = getCanvas();
      if (!sourceCanvas) {
        return null;
      }

      const {
        format = "png",
        quality = 0.92,
        backgroundColor,
        scale = 2
      } = options;

      const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = Math.max(1, Math.floor(sourceCanvas.width * safeScale));
      exportCanvas.height = Math.max(1, Math.floor(sourceCanvas.height * safeScale));

      const context = exportCanvas.getContext("2d");
      if (!context) {
        return null;
      }

      if (backgroundColor) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }

      context.scale(safeScale, safeScale);
      context.drawImage(sourceCanvas, 0, 0);

      return exportCanvas.toDataURL(resolveMimeType(format), quality);
    },
    [getCanvas]
  );

  const toBlob = useCallback(
    async (options: ChartExportOptions = {}): Promise<Blob | null> => {
      const dataUrl = toDataURL(options);
      if (!dataUrl) {
        return null;
      }

      const response = await fetch(dataUrl);
      return response.blob();
    },
    [toDataURL]
  );

  const downloadImage = useCallback(
    (options: ChartExportOptions = {}) => {
      const { filename = "f1-telemetry-chart", format = "png" } = options;
      const dataUrl = toDataURL(options);
      if (!dataUrl) {
        return;
      }

      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    },
    [toDataURL]
  );

  return { chartRef, toDataURL, toBlob, downloadImage };
};
