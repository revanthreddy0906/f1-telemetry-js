import { useMemo, useState, type PropsWithChildren } from "react";
import type { ChartContainerProps } from "../types/telemetry";
import { getCardStyle, getTitleStyle, resolveThemeTokens } from "./chartTheme";

interface TelemetryCardProps extends Pick<ChartContainerProps, "theme" | "height" | "className" | "title" | "styleTokens" | "ariaLabel"> {
  defaultAriaLabel: string;
}

export const TelemetryCard = ({
  theme = "dark",
  height = 320,
  className,
  title,
  styleTokens,
  ariaLabel,
  defaultAriaLabel,
  children
}: PropsWithChildren<TelemetryCardProps>) => {
  const [isFocused, setIsFocused] = useState(false);
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  return (
    <section
      role="figure"
      aria-label={ariaLabel ?? defaultAriaLabel}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={className}
      style={{
        ...getCardStyle(theme, height, styleTokens),
        boxShadow: isFocused ? `${palette.shadow}, ${palette.focusRing}` : palette.shadow,
        outline: "none"
      }}
    >
      <p style={getTitleStyle(theme, styleTokens)}>{title}</p>
      <div style={{ height: "calc(100% - 26px)" }}>{children}</div>
    </section>
  );
};
