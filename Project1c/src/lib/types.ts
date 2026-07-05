export type ThemePalette = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
};

export type ThemeDefinition = {
  id: string;
  label: string;
  palette: ThemePalette;
};

export type WidgetData = {
  lastUpdated: number;
  isStale: boolean;
};

export type PortfolioSnapshot = {
  totalAUM: number;
  cashAllocation: number;
  equityAllocation: number;
  fixedIncomeAllocation: number;
  alternativesAllocation: number;
  navChangePct: number;
  varOneDay: number;
};

export type WidgetInstance = {
  id: string;
  widgetType: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  config: Record<string, unknown>;
};

export type WidgetDefinition<TConfig = Record<string, unknown>> = {
  type: string;
  title: string;
  minWidth: number;
  minHeight: number;
  defaultConfig: TConfig;
  render: (props: {
    instance: WidgetInstance;
    config: TConfig;
    data: unknown;
    onConfigure: () => void;
  }) => JSX.Element;
  description: string;
};

export type RealTimeFeed = {
  portfolio: PortfolioSnapshot;
  drawdownSeries: Array<{ timestamp: number; value: number }>;
  performanceSeries: Array<{ timestamp: number; value: number }>;
  correlationMatrix: number[][];
  attribution: Array<{ bucket: string; contribution: number }>;
  exposure: Array<{ factor: string; weight: number }>;
  liquidity: Array<{ timestamp: number; value: number }>;
  benchmarkSpread: Array<{ timestamp: number; value: number }>;
  heatmap: Array<Array<number>>;
};
