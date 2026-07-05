'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockRenderer } from '../blocks/BlockRenderer';
import type { ModuleBlock } from '../../lib/types';

type SortableBlockProps = {
  block: ModuleBlock;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

export function SortableBlock({ block, selected, onSelect, onRemove }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`canvas-block ${selected ? 'canvas-block--selected' : ''} ${isDragging ? 'canvas-block--dragging' : ''}`}
    >
      <div className="canvas-block__bar">
        <button type="button" className="drag-handle" aria-label={`Reorder ${block.title}`} {...attributes} {...listeners}>
          Grip
        </button>
        <button type="button" onClick={onSelect} aria-label={`Edit ${block.title}`}>
          Edit
        </button>
        <button type="button" onClick={onRemove} aria-label={`Remove ${block.title}`}>
          Remove
        </button>
      </div>
      <BlockRenderer block={block} />
    </article>
  );
}
