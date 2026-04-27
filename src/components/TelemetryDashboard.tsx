import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type {
  TelemetryDashboardLayout,
  TelemetryDashboardLayoutItem,
  TelemetryDashboardProps,
  TelemetryPanelContextMenuAction,
  TelemetryPanelExtension,
  TelemetryPanelRenderContext,
  TelemetrySharedChannelApi
} from "../types/telemetry";
import { getTelemetryPanels } from "../extensions/registry";
import { LapComparisonChart } from "./LapComparisonChart";
import { SpeedChart } from "./SpeedChart";
import { ThrottleBrakeChart } from "./ThrottleBrakeChart";
import { TrackMap } from "./TrackMap";
import { createTelemetryCssVariables, resolveThemeTokens } from "./chartTheme";

interface DashboardPanelDefinition {
  id: string;
  title: string;
  extension?: TelemetryPanelExtension;
  render: (context: TelemetryPanelRenderContext) => JSX.Element;
}

const LAYOUT_STORAGE_PREFIX = "f1-telemetry-layout";

const sortPanels = (panels: TelemetryPanelExtension[]): TelemetryPanelExtension[] =>
  [...panels].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

const clampWidth = (value: number): 1 | 2 | 3 => {
  if (value <= 1) {
    return 1;
  }
  if (value >= 3) {
    return 3;
  }
  return 2;
};

const defaultPanelWidth = (panelId: string): 1 | 2 | 3 =>
  panelId === "default-track-map" || panelId === "default-lap-comparison" ? 2 : 1;

const createLayoutFromIds = (
  panelIds: string[],
  input?: TelemetryDashboardLayout
): TelemetryDashboardLayout => {
  const inputItems = input?.items ?? [];
  const fromInput = new Map(inputItems.map((item) => [item.id, item]));
  const items: TelemetryDashboardLayoutItem[] = panelIds.map((id, index) => {
    const existing = fromInput.get(id);
    return {
      id,
      order: typeof existing?.order === "number" ? existing.order : index,
      width: clampWidth(existing?.width ?? defaultPanelWidth(id)),
      hidden: existing?.hidden ?? false
    };
  });
  items.sort((left, right) => left.order - right.order);
  return {
    items: items.map((item, index) => ({ ...item, order: index }))
  };
};

const getLayoutStorageKey = (key: string): string => `${LAYOUT_STORAGE_PREFIX}:${key}`;

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const storage = window.localStorage as Partial<Storage> | undefined;
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return null;
  }
  return storage as Storage;
};

const loadLayout = (
  key: string,
  panelIds: string[],
  fallback?: TelemetryDashboardLayout
): TelemetryDashboardLayout => {
  const safeFallback = createLayoutFromIds(panelIds, fallback);
  const storage = getStorage();
  if (!storage) {
    return safeFallback;
  }

  try {
    const raw = storage.getItem(getLayoutStorageKey(key));
    if (!raw) {
      return safeFallback;
    }
    const parsed = JSON.parse(raw) as TelemetryDashboardLayout;
    return createLayoutFromIds(panelIds, parsed);
  } catch {
    return safeFallback;
  }
};

const controlButtonStyle = (
  border: string,
  background: string,
  text: string
): CSSProperties => ({
  border: `1px solid ${border}`,
  background,
  color: text,
  borderRadius: 8,
  padding: "4px 8px",
  fontSize: 12,
  cursor: "pointer"
});

export const TelemetryDashboard = ({
  telemetry,
  comparison,
  lapMode = "overlay",
  sectorMarkers,
  annotations,
  theme = "dark",
  styleTokens,
  processing,
  syncCursor = true,
  className,
  chartHeight = 320,
  trackMapHeight = 360,
  panelGap = 16,
  minPanelWidth = 320,
  includeDefaultPanels = true,
  extensions = [],
  enableLayoutEditor = true,
  persistLayout = true,
  layoutStorageKey = "default",
  defaultLayout,
  onLayoutChange
}: TelemetryDashboardProps) => {
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const sharedCursor = syncCursor ? cursorTime : null;
  const onCursorChange = syncCursor ? setCursorTime : undefined;
  const palette = useMemo(() => resolveThemeTokens(theme, styleTokens), [theme, styleTokens]);

  const driver2 = useMemo(
    () =>
      comparison ?? {
        time: telemetry.time,
        speed: telemetry.speed,
        label: "Comparison"
      },
    [comparison, telemetry.time, telemetry.speed]
  );

  const extensionPanels = useMemo(() => {
    const allPanels = new Map<string, TelemetryPanelExtension>();
    getTelemetryPanels().forEach((panel) => allPanels.set(panel.id, panel));
    extensions.forEach((panel) => allPanels.set(panel.id, panel));
    return sortPanels(Array.from(allPanels.values()));
  }, [extensions]);

  const panelDefinitions = useMemo<DashboardPanelDefinition[]>(() => {
    const definitions: DashboardPanelDefinition[] = [];

    if (includeDefaultPanels) {
      definitions.push(
        {
          id: "default-speed",
          title: "Speed",
          render: (context) => (
            <SpeedChart
              title="Speed"
              time={context.telemetry.time}
              speed={context.telemetry.speed}
              theme={context.theme}
              processing={context.processing}
              styleTokens={context.styleTokens}
              annotations={context.annotations}
              height={chartHeight}
              cursorTime={context.cursorTime}
              onCursorTimeChange={onCursorChange}
              showCursor={syncCursor}
            />
          )
        },
        {
          id: "default-inputs",
          title: "Driver Inputs",
          render: (context) => (
            <ThrottleBrakeChart
              title="Driver Inputs"
              time={context.telemetry.time}
              throttle={context.telemetry.throttle}
              brake={context.telemetry.brake}
              theme={context.theme}
              processing={context.processing}
              styleTokens={context.styleTokens}
              annotations={context.annotations}
              height={chartHeight}
              cursorTime={context.cursorTime}
              onCursorTimeChange={onCursorChange}
              showCursor={syncCursor}
            />
          )
        },
        {
          id: "default-lap-comparison",
          title: lapMode === "delta" ? "Lap Delta" : "Lap Comparison",
          render: (context) => (
            <LapComparisonChart
              title={context.lapMode === "delta" ? "Lap Delta" : "Lap Comparison"}
              driver1={{ time: context.telemetry.time, speed: context.telemetry.speed, label: "Driver 1" }}
              driver2={context.comparison ?? driver2}
              mode={context.lapMode}
              sectorMarkers={context.sectorMarkers}
              annotations={context.annotations}
              theme={context.theme}
              processing={context.processing}
              styleTokens={context.styleTokens}
              height={chartHeight}
              cursorTime={context.cursorTime}
              onCursorTimeChange={onCursorChange}
              showCursor={syncCursor}
            />
          )
        },
        {
          id: "default-track-map",
          title: "Track Position",
          render: (context) => (
            <TrackMap
              title="Track Position"
              x={context.telemetry.x}
              y={context.telemetry.y}
              time={context.telemetry.time}
              annotations={context.annotations}
              theme={context.theme}
              processing={context.processing}
              styleTokens={context.styleTokens}
              height={trackMapHeight}
              cursorTime={context.cursorTime}
              onCursorTimeChange={onCursorChange}
              showCursor={syncCursor}
            />
          )
        }
      );
    }

    extensionPanels.forEach((panel) => {
      definitions.push({
        id: panel.id,
        title: panel.title ?? panel.id,
        extension: panel,
        render: (context) => <>{panel.render(context)}</>
      });
    });

    return definitions;
  }, [
    includeDefaultPanels,
    extensionPanels,
    chartHeight,
    trackMapHeight,
    syncCursor,
    onCursorChange,
    lapMode,
    driver2
  ]);

  const panelIds = useMemo(() => panelDefinitions.map((panel) => panel.id), [panelDefinitions]);

  const [layout, setLayout] = useState<TelemetryDashboardLayout>(() =>
    persistLayout ? loadLayout(layoutStorageKey, panelIds, defaultLayout) : createLayoutFromIds(panelIds, defaultLayout)
  );

  useEffect(() => {
    setLayout((current) => createLayoutFromIds(panelIds, current.items.length > 0 ? current : defaultLayout));
  }, [panelIds, defaultLayout]);

  useEffect(() => {
    const storage = getStorage();
    if (!persistLayout || !storage) {
      onLayoutChange?.(layout);
      return;
    }
    storage.setItem(getLayoutStorageKey(layoutStorageKey), JSON.stringify(layout));
    onLayoutChange?.(layout);
  }, [layout, persistLayout, layoutStorageKey, onLayoutChange]);

  const channelValuesRef = useRef<Map<string, unknown>>(new Map());
  const channelListenersRef = useRef<Map<string, Set<(payload: unknown) => void>>>(new Map());
  const shared = useMemo<TelemetrySharedChannelApi>(
    () => ({
      publish: (channel, payload) => {
        channelValuesRef.current.set(channel, payload);
        const listeners = channelListenersRef.current.get(channel);
        listeners?.forEach((listener) => listener(payload));
      },
      read: (channel) => channelValuesRef.current.get(channel),
      subscribe: (channel, listener) => {
        const listeners = channelListenersRef.current.get(channel) ?? new Set<(payload: unknown) => void>();
        listeners.add(listener);
        channelListenersRef.current.set(channel, listeners);
        return () => {
          const nextListeners = channelListenersRef.current.get(channel);
          if (!nextListeners) {
            return;
          }
          nextListeners.delete(listener);
          if (nextListeners.size === 0) {
            channelListenersRef.current.delete(channel);
          }
        };
      }
    }),
    []
  );

  const basePanelContext = useMemo(
    () => ({
      telemetry,
      comparison: driver2,
      lapMode,
      sectorMarkers,
      annotations,
      theme,
      styleTokens,
      processing,
      setCursorTime,
      shared
    }),
    [telemetry, driver2, lapMode, sectorMarkers, annotations, theme, styleTokens, processing, shared]
  );

  const createPanelContext = useCallback(
    (panelId: string): TelemetryPanelRenderContext => ({
      panelId,
      ...basePanelContext,
      cursorTime: sharedCursor
    }),
    [basePanelContext, sharedCursor]
  );

  const createLifecycleContext = useCallback(
    (panelId: string): TelemetryPanelRenderContext => ({
      panelId,
      ...basePanelContext,
      cursorTime: null
    }),
    [basePanelContext]
  );

  useEffect(() => {
    extensionPanels.forEach((panel) => {
      panel.onMount?.(createLifecycleContext(panel.id));
    });
    return () => {
      extensionPanels.forEach((panel) => {
        panel.onUnmount?.(createLifecycleContext(panel.id));
      });
    };
  }, [extensionPanels, createLifecycleContext]);

  const definitionById = useMemo(
    () => new Map(panelDefinitions.map((definition) => [definition.id, definition])),
    [panelDefinitions]
  );

  const orderedItems = useMemo(
    () => [...layout.items].sort((left, right) => left.order - right.order),
    [layout.items]
  );

  const visibleItems = orderedItems.filter((item) => !item.hidden && definitionById.has(item.id));

  const updateLayoutItems = useCallback(
    (updater: (items: TelemetryDashboardLayoutItem[]) => TelemetryDashboardLayoutItem[]) => {
      setLayout((current) => ({
        items: updater([...current.items]).map((item, index) => ({
          ...item,
          order: index
        }))
      }));
    },
    []
  );

  const moveItem = (id: string, delta: -1 | 1) => {
    updateLayoutItems((items) => {
      const index = items.findIndex((item) => item.id === id);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= items.length) {
        return items;
      }
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const resizeItem = (id: string, delta: -1 | 1) => {
    updateLayoutItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              width: clampWidth(item.width + delta)
            }
          : item
      )
    );
  };

  const toggleItemVisibility = (id: string) => {
    updateLayoutItems((items) =>
      items.map((item) => (item.id === id ? { ...item, hidden: !item.hidden } : item))
    );
  };

  const resetLayout = () => {
    setLayout(createLayoutFromIds(panelIds, defaultLayout));
  };

  const renderContextAction = (
    action: TelemetryPanelContextMenuAction,
    context: TelemetryPanelRenderContext,
    key: string
  ) => {
    if (action.isVisible && !action.isVisible(context)) {
      return null;
    }

    const disabled = action.isDisabled?.(context) ?? false;
    return (
      <button
        key={key}
        type="button"
        onClick={() => action.onSelect(context)}
        disabled={disabled}
        style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}
      >
        {action.label}
      </button>
    );
  };

  const cssTokenStyle = useMemo(
    () => createTelemetryCssVariables(styleTokens ?? {}) as CSSProperties,
    [styleTokens]
  );

  return (
    <div style={{ display: "grid", gap: panelGap }}>
      {enableLayoutEditor ? (
        <section
          style={{
            ...cssTokenStyle,
            borderRadius: 12,
            border: `1px solid ${palette.border}`,
            background: palette.background,
            color: palette.text,
            boxShadow: palette.shadow,
            padding: 12
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <strong>Layout Editor</strong>
            <button type="button" onClick={resetLayout} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
              Reset Layout
            </button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {orderedItems.map((item) => {
              const definition = definitionById.get(item.id);
              if (!definition) {
                return null;
              }
              return (
                <div
                  key={`editor-${item.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto auto auto",
                    gap: 6,
                    alignItems: "center"
                  }}
                >
                  <span style={{ fontSize: 13 }}>{definition.title}</span>
                  <button type="button" onClick={() => moveItem(item.id, -1)} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
                    Up
                  </button>
                  <button type="button" onClick={() => moveItem(item.id, 1)} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
                    Down
                  </button>
                  <button type="button" onClick={() => resizeItem(item.id, -1)} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
                    -
                  </button>
                  <button type="button" onClick={() => resizeItem(item.id, 1)} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
                    +
                  </button>
                  <button type="button" onClick={() => toggleItemVisibility(item.id)} style={controlButtonStyle(palette.border, palette.primarySoft, palette.text)}>
                    {item.hidden ? "Show" : "Hide"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <div
        className={className}
        style={{
          ...cssTokenStyle,
          display: "grid",
          gap: panelGap,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minPanelWidth}px, 1fr))`
        }}
      >
        {visibleItems.map((item) => {
          const definition = definitionById.get(item.id);
          if (!definition) {
            return null;
          }

          const context = createPanelContext(item.id);
          const actions = definition.extension?.contextMenuActions ?? [];

          return (
            <div key={item.id} style={{ gridColumn: `span ${item.width}` }}>
              {actions.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {actions.map((action) => renderContextAction(action, context, `${item.id}:${action.id}`))}
                </div>
              ) : null}
              {definition.render(context)}
            </div>
          );
        })}
      </div>
      {visibleItems.length === 0 ? (
        <p style={{ color: palette.mutedText, margin: 0 }}>No dashboard panels are visible. Use Layout Editor to show panels.</p>
      ) : null}
    </div>
  );
};
