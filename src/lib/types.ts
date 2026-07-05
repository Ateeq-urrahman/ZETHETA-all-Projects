export type DeviceMode = 'desktop' | 'mobile';

export type BlockType =
  | 'hero'
  | 'richText'
  | 'callout'
  | 'quiz'
  | 'emiCalculator'
  | 'sipCalculator'
  | 'compoundInterest'
  | 'conceptExplainer'
  | 'progressTracker'
  | 'achievementBadge'
  | 'videoEmbed'
  | 'glossary';

export type QuizOption = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type ModuleBlock = {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
};

export type EducationModule = {
  id: string;
  title: string;
  audience: string;
  objective: string;
  estimatedMinutes: number;
  blocks: ModuleBlock[];
  updatedAt: string;
};

export type HistoryEntry = {
  module: EducationModule;
  reason: string;
  timestamp: string;
};

export type CalculatorResult = {
  label: string;
  value: number;
  formatted: string;
};

export type BoardReview = {
  name: string;
  verdict: 'pass' | 'watch' | 'fail';
  score: number;
  findings: string[];
};
