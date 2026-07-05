'use client';

import { motion } from 'framer-motion';
import { calculateCompoundInterest, calculateEmi, calculateSip } from '../../lib/calculators';
import type { ModuleBlock, QuizOption } from '../../lib/types';

type BlockRendererProps = {
  block: ModuleBlock;
};

function numberValue(value: unknown, fallback: number) {
  return typeof value === 'number' ? value : fallback;
}

function stringList(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : fallback;
}

function options(value: unknown): QuizOption[] {
  return Array.isArray(value) ? (value as QuizOption[]) : [];
}

export function BlockRenderer({ block }: BlockRendererProps) {
  if (block.type === 'hero') {
    return (
      <section className="lesson-block lesson-hero" aria-label={block.title}>
        <span>{String(block.metadata.eyebrow ?? 'EduForge')}</span>
        <h1>{block.title}</h1>
        <p>{block.content}</p>
      </section>
    );
  }

  if (block.type === 'richText') {
    return (
      <section className="lesson-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <div className="lesson-copy" dangerouslySetInnerHTML={{ __html: block.content }} />
      </section>
    );
  }

  if (block.type === 'quiz') {
    const quizOptions = options(block.metadata.options);
    return (
      <section className="lesson-block quiz-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <p>{block.content}</p>
        <div className="quiz-options">
          {quizOptions.map((option) => (
            <button key={option.id} type="button" aria-label={`Quiz option ${option.label}`}>
              {option.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'emiCalculator') {
    const result = calculateEmi(
      numberValue(block.metadata.principal, 800000),
      numberValue(block.metadata.annualRate, 9.5),
      numberValue(block.metadata.months, 60)
    );
    return <CalculatorShell block={block} result={result.formatted} note="Estimated monthly instalment" />;
  }

  if (block.type === 'sipCalculator') {
    const result = calculateSip(
      numberValue(block.metadata.monthlyInvestment, 5000),
      numberValue(block.metadata.annualReturn, 12),
      numberValue(block.metadata.years, 10)
    );
    return <CalculatorShell block={block} result={result.formatted} note="Projected investment value" />;
  }

  if (block.type === 'compoundInterest') {
    const result = calculateCompoundInterest(
      numberValue(block.metadata.principal, 100000),
      numberValue(block.metadata.annualRate, 10),
      numberValue(block.metadata.years, 8)
    );
    return <CalculatorShell block={block} result={result.formatted} note="Projected maturity value" />;
  }

  if (block.type === 'conceptExplainer') {
    const steps = stringList(block.metadata.steps, ['Learn', 'Practice', 'Reflect']);
    return (
      <section className="lesson-block explainer-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <p>{block.content}</p>
        <div className="explainer-steps">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="explainer-step"
            >
              <span>{index + 1}</span>
              {step}
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'progressTracker') {
    const completed = numberValue(block.metadata.completed, 3);
    const total = Math.max(numberValue(block.metadata.total, 6), 1);
    const percent = Math.min(100, Math.round((completed / total) * 100));
    return (
      <section className="lesson-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <p>{block.content}</p>
        <div className="progress-track" aria-label={`${percent}% complete`}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <strong>{percent}% complete</strong>
      </section>
    );
  }

  if (block.type === 'achievementBadge') {
    return (
      <section className="lesson-block badge-block" aria-label={block.title}>
        <div className="badge-medal">{String(block.metadata.level ?? 'Core')}</div>
        <div>
          <h2>{block.title}</h2>
          <p>{block.content}</p>
        </div>
      </section>
    );
  }

  if (block.type === 'videoEmbed') {
    return (
      <section className="lesson-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <div className="video-frame">
          <span>Media</span>
          <strong>{String(block.metadata.duration ?? '02:00')}</strong>
        </div>
        <p>{block.content}</p>
      </section>
    );
  }

  if (block.type === 'glossary') {
    const terms = stringList(block.metadata.terms, ['Principal', 'Interest']);
    return (
      <section className="lesson-block glossary-block" aria-label={block.title}>
        <h2>{block.title}</h2>
        <p>{block.content}</p>
        <div>
          {terms.map((term) => (
            <span key={term}>{term}</span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="lesson-block callout-block" aria-label={block.title}>
      <h2>{block.title}</h2>
      <p>{block.content}</p>
    </section>
  );
}

function CalculatorShell({ block, result, note }: { block: ModuleBlock; result: string; note: string }) {
  return (
    <section className="lesson-block calculator-block" aria-label={block.title}>
      <h2>{block.title}</h2>
      <p>{block.content}</p>
      <div className="calculator-result">
        <span>{note}</span>
        <strong>{result}</strong>
      </div>
    </section>
  );
}
