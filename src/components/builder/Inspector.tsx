'use client';

import type { ModuleBlock } from '../../lib/types';
import { RichTextEditor } from './RichTextEditor';

type InspectorProps = {
  block: ModuleBlock | undefined;
  onChange: (patch: Partial<ModuleBlock>) => void;
};

export function Inspector({ block, onChange }: InspectorProps) {
  if (!block) {
    return (
      <aside className="panel inspector" aria-label="Block inspector">
        <h2>Inspector</h2>
        <p>Select a block to edit its copy and configuration.</p>
      </aside>
    );
  }

  return (
    <aside className="panel inspector" aria-label="Block inspector">
      <h2>Inspector</h2>
      <label>
        Block title
        <input value={block.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>

      {block.type === 'richText' ? (
        <RichTextEditor value={block.content} onChange={(content) => onChange({ content })} />
      ) : (
        <label>
          Learner-facing copy
          <textarea value={block.content} onChange={(event) => onChange({ content: event.target.value })} rows={5} />
        </label>
      )}

      <MetadataEditor block={block} onChange={onChange} />
    </aside>
  );
}

function MetadataEditor({ block, onChange }: InspectorProps & { block: ModuleBlock }) {
  const updateMetadata = (key: string, value: unknown) => {
    onChange({ metadata: { ...block.metadata, [key]: value } });
  };

  if (block.type === 'emiCalculator') {
    return (
      <div className="metadata-grid">
        <NumberField label="Principal" value={block.metadata.principal} onChange={(value) => updateMetadata('principal', value)} />
        <NumberField label="Annual rate" value={block.metadata.annualRate} onChange={(value) => updateMetadata('annualRate', value)} />
        <NumberField label="Months" value={block.metadata.months} onChange={(value) => updateMetadata('months', value)} />
      </div>
    );
  }

  if (block.type === 'sipCalculator') {
    return (
      <div className="metadata-grid">
        <NumberField
          label="Monthly investment"
          value={block.metadata.monthlyInvestment}
          onChange={(value) => updateMetadata('monthlyInvestment', value)}
        />
        <NumberField label="Annual return" value={block.metadata.annualReturn} onChange={(value) => updateMetadata('annualReturn', value)} />
        <NumberField label="Years" value={block.metadata.years} onChange={(value) => updateMetadata('years', value)} />
      </div>
    );
  }

  if (block.type === 'compoundInterest') {
    return (
      <div className="metadata-grid">
        <NumberField label="Principal" value={block.metadata.principal} onChange={(value) => updateMetadata('principal', value)} />
        <NumberField label="Annual rate" value={block.metadata.annualRate} onChange={(value) => updateMetadata('annualRate', value)} />
        <NumberField label="Years" value={block.metadata.years} onChange={(value) => updateMetadata('years', value)} />
      </div>
    );
  }

  if (block.type === 'progressTracker') {
    return (
      <div className="metadata-grid">
        <NumberField label="Completed" value={block.metadata.completed} onChange={(value) => updateMetadata('completed', value)} />
        <NumberField label="Total" value={block.metadata.total} onChange={(value) => updateMetadata('total', value)} />
      </div>
    );
  }

  if (block.type === 'achievementBadge') {
    return (
      <label>
        Badge level
        <input value={String(block.metadata.level ?? '')} onChange={(event) => updateMetadata('level', event.target.value)} />
      </label>
    );
  }

  return (
    <label>
      Metadata JSON
      <textarea
        value={JSON.stringify(block.metadata, null, 2)}
        onChange={(event) => {
          try {
            onChange({ metadata: JSON.parse(event.target.value) as Record<string, unknown> });
          } catch {
            updateMetadata('draftError', 'Invalid JSON');
          }
        }}
        rows={5}
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: unknown; onChange: (value: number) => void }) {
  return (
    <label>
      {label}
      <input type="number" value={Number(value ?? 0)} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
