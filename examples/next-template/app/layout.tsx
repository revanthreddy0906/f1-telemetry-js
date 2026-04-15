import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "f1-telemetry-js Next.js Template",
  description: "SSR-safe telemetry rendering template"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#040812", color: "#f8fbff" }}>{children}</body>
    </html>
  );
}
