import type { BlockType, ModuleBlock } from './types';

type CatalogBlock = {
  type: BlockType;
  label: string;
  description: string;
  defaultBlock: Omit<ModuleBlock, 'id'>;
};

export const blockCatalog: CatalogBlock[] = [
  {
    type: 'hero',
    label: 'Lesson Hero',
    description: 'Opening objective and context',
    defaultBlock: {
      type: 'hero',
      title: 'Start here',
      content: 'Learn one money decision clearly, then practice it safely.',
      metadata: { eyebrow: 'Financial Foundations' }
    }
  },
  {
    type: 'richText',
    label: 'Rich Text',
    description: 'TipTap powered lesson copy',
    defaultBlock: {
      type: 'richText',
      title: 'Core idea',
      content: '<p>Explain the concept with examples, trade-offs, and plain-language definitions.</p>',
      metadata: {}
    }
  },
  {
    type: 'callout',
    label: 'Risk Callout',
    description: 'Highlight warnings and rules',
    defaultBlock: {
      type: 'callout',
      title: 'Remember',
      content: 'Never borrow only because the EMI looks affordable. Check total interest too.',
      metadata: { tone: 'warning' }
    }
  },
  {
    type: 'quiz',
    label: 'Embedded Quiz',
    description: 'Single-question knowledge check',
    defaultBlock: {
      type: 'quiz',
      title: 'Quick check',
      content: 'What does an EMI include?',
      metadata: {
        options: [
          { id: 'a', label: 'Only principal', isCorrect: false },
          { id: 'b', label: 'Principal and interest', isCorrect: true },
          { id: 'c', label: 'Only processing fee', isCorrect: false }
        ]
      }
    }
  },
  {
    type: 'emiCalculator',
    label: 'EMI Calculator',
    description: 'Loan instalment simulator',
    defaultBlock: {
      type: 'emiCalculator',
      title: 'EMI simulator',
      content: 'Change loan inputs and see the monthly instalment.',
      metadata: { principal: 800000, annualRate: 9.5, months: 60 }
    }
  },
  {
    type: 'sipCalculator',
    label: 'SIP Calculator',
    description: 'Recurring investment projection',
    defaultBlock: {
      type: 'sipCalculator',
      title: 'SIP growth simulator',
      content: 'Estimate how monthly investing can compound over time.',
      metadata: { monthlyInvestment: 5000, annualReturn: 12, years: 10 }
    }
  },
  {
    type: 'compoundInterest',
    label: 'Compound Interest',
    description: 'Lump-sum compounding model',
    defaultBlock: {
      type: 'compoundInterest',
      title: 'Compounding lens',
      content: 'See how time changes the result when returns are reinvested.',
      metadata: { principal: 100000, annualRate: 10, years: 8 }
    }
  },
  {
    type: 'conceptExplainer',
    label: 'Animated Explainer',
    description: 'Motion based step-through concept',
    defaultBlock: {
      type: 'conceptExplainer',
      title: 'How compounding builds',
      content: 'Principal earns returns; returns start earning returns; time magnifies the curve.',
      metadata: { steps: ['Invest', 'Earn', 'Reinvest', 'Accelerate'] }
    }
  },
  {
    type: 'progressTracker',
    label: 'Progress Tracker',
    description: 'Completion milestone block',
    defaultBlock: {
      type: 'progressTracker',
      title: 'Module progress',
      content: 'Track the learner journey across this module.',
      metadata: { completed: 3, total: 6 }
    }
  },
  {
    type: 'achievementBadge',
    label: 'Achievement Badge',
    description: 'Motivational completion reward',
    defaultBlock: {
      type: 'achievementBadge',
      title: 'Debt Decoder',
      content: 'Awarded after learners explain EMI and total interest in their own words.',
      metadata: { level: 'Silver' }
    }
  },
  {
    type: 'videoEmbed',
    label: 'Video Embed',
    description: 'Responsive media placeholder',
    defaultBlock: {
      type: 'videoEmbed',
      title: 'Two-minute walkthrough',
      content: 'Embed a short explainer video from the learning media library.',
      metadata: { duration: '02:14' }
    }
  },
  {
    type: 'glossary',
    label: 'Glossary',
    description: 'Key terms learners can scan',
    defaultBlock: {
      type: 'glossary',
      title: 'Terms to know',
      content: 'Principal: money borrowed or invested. Interest: cost of borrowing or return earned.',
      metadata: { terms: ['Principal', 'Interest', 'Tenure', 'Return'] }
    }
  }
];

export function createBlock(type: BlockType): ModuleBlock {
  const definition = blockCatalog.find((block) => block.type === type) ?? blockCatalog[0];
  return {
    id: `${definition.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...definition.defaultBlock,
    metadata: { ...definition.defaultBlock.metadata }
  };
}
