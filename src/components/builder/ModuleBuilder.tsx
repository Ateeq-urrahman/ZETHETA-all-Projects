'use client';

import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { blockCatalog } from '../../lib/blockCatalog';
import { runArchitectureReview, runContentCreatorPanel } from '../../lib/review';
import type { DeviceMode } from '../../lib/types';
import { HISTORY_LIMIT, useModuleStore } from '../../store/moduleStore';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { Inspector } from './Inspector';
import { SortableBlock } from './SortableBlock';

export function ModuleBuilder() {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const {
    module,
    past,
    future,
    selectedBlockId,
    jsonDraft,
    importError,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    setSelectedBlock,
    updateModuleMeta,
    undo,
    redo,
    exportJson,
    setJsonDraft,
    importJson,
    resetModule
  } = useModuleStore();

  const selectedBlock = module.blocks.find((block) => block.id === selectedBlockId);
  const creatorReview = useMemo(() => runContentCreatorPanel(module), [module]);
  const architectureReview = useMemo(() => runArchitectureReview(module), [module]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
  };

  return (
    <main className="builder-shell">
      <header className="topbar">
        <div>
          <span>EduForge Financial Technologies</span>
          <h1>Interactive Module Builder</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" onClick={undo} disabled={past.length === 0} aria-label="Undo last change">
            Undo
          </button>
          <button type="button" onClick={redo} disabled={future.length === 0} aria-label="Redo last change">
            Redo
          </button>
          <button type="button" onClick={() => setJsonDraft(exportJson())}>
            Export JSON
          </button>
          <button type="button" onClick={resetModule}>
            Reset
          </button>
        </div>
      </header>

      <section className="workspace" aria-label="Module builder workspace">
        <aside className="panel palette" aria-label="Block palette">
          <h2>Blocks</h2>
          <p>{blockCatalog.length} production blocks for financial education teams.</p>
          <div className="palette-grid">
            {blockCatalog.map((block) => (
              <button key={block.type} type="button" onClick={() => addBlock(block.type)}>
                <strong>{block.label}</strong>
                <span>{block.description}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="canvas-panel" aria-label="Editable module canvas">
          <div className="module-meta panel">
            <label>
              Module title
              <input value={module.title} onChange={(event) => updateModuleMeta({ title: event.target.value })} />
            </label>
            <label>
              Audience
              <input value={module.audience} onChange={(event) => updateModuleMeta({ audience: event.target.value })} />
            </label>
            <label>
              Minutes
              <input
                type="number"
                value={module.estimatedMinutes}
                onChange={(event) => updateModuleMeta({ estimatedMinutes: Number(event.target.value) })}
              />
            </label>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={module.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              <div className="canvas-list">
                {module.blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    selected={block.id === selectedBlockId}
                    onSelect={() => setSelectedBlock(block.id)}
                    onRemove={() => removeBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        <Inspector block={selectedBlock} onChange={(patch) => selectedBlock && updateBlock(selectedBlock.id, patch)} />
      </section>

      <section className="lower-grid" aria-label="Preview and export tools">
        <section className="panel preview-panel">
          <div className="panel-heading">
            <div>
              <h2>Live Preview</h2>
              <p>{device === 'desktop' ? 'Desktop learning view' : 'Mobile learning view'}</p>
            </div>
            <div className="segmented" aria-label="Preview device">
              <button type="button" className={device === 'desktop' ? 'active' : ''} onClick={() => setDevice('desktop')}>
                Desktop
              </button>
              <button type="button" className={device === 'mobile' ? 'active' : ''} onClick={() => setDevice('mobile')}>
                Mobile
              </button>
            </div>
          </div>
          <motion.div layout className={`preview-device preview-device--${device}`}>
            {module.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </motion.div>
        </section>

        <section className="panel json-panel" aria-label="JSON import and export">
          <div className="panel-heading">
            <div>
              <h2>Portable JSON</h2>
              <p>Backend-ready module schema for CMS migration.</p>
            </div>
            <button type="button" onClick={importJson}>
              Import
            </button>
          </div>
          <textarea value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} />
          {importError ? <p className="error-text">{importError}</p> : null}
        </section>

        <section className="panel review-panel" aria-label="Readiness reviews">
          <h2>Readiness</h2>
          <div className="metric-strip">
            <Metric label="Blocks" value={String(module.blocks.length)} />
            <Metric label="History" value={`${past.length}/${HISTORY_LIMIT}`} />
            <Metric label="Turnaround" value="<2h" />
          </div>
          <ReviewCard review={creatorReview} />
          <ReviewCard review={architectureReview} />
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ReviewCard({ review }: { review: ReturnType<typeof runContentCreatorPanel> }) {
  return (
    <article className={`review-card review-card--${review.verdict}`}>
      <div>
        <h3>{review.name}</h3>
        <strong>{review.score}%</strong>
      </div>
      <ul>
        {review.findings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
    </article>
  );
}
