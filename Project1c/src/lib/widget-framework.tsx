import type { WidgetDefinition, WidgetInstance } from './types';

const registry = new Map<string, WidgetDefinition<Record<string, unknown>>>();

export const registerWidget = <TConfig extends Record<string, unknown>>(
  definition: WidgetDefinition<TConfig>
): void => {
  registry.set(definition.type, definition as WidgetDefinition<Record<string, unknown>>);
};

export const getWidgetDefinition = (type: string) => registry.get(type);

export const getAllWidgets = (): WidgetDefinition[] => Array.from(registry.values());

export const renderWidget = (instance: WidgetInstance, data: unknown, onConfigure: () => void) => {
  const definition = getWidgetDefinition(instance.widgetType);
  if (!definition) {
    return <div className="widget-widget-missing">Widget not found</div>;
  }
  return definition.render({ instance, config: instance.config, data, onConfigure });
};
