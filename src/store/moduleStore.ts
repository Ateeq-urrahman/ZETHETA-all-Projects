'use client';

import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { createBlock } from '../lib/blockCatalog';
import { sampleModule } from '../lib/sampleModule';
import type { BlockType, EducationModule, HistoryEntry, ModuleBlock } from '../lib/types';

const HISTORY_LIMIT = 50;

type ModuleStore = {
  module: EducationModule;
  past: HistoryEntry[];
  future: HistoryEntry[];
  selectedBlockId: string | null;
  jsonDraft: string;
  importError: string | null;
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, patch: Partial<ModuleBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setSelectedBlock: (id: string | null) => void;
  updateModuleMeta: (patch: Partial<Omit<EducationModule, 'blocks'>>) => void;
  undo: () => void;
  redo: () => void;
  exportJson: () => string;
  setJsonDraft: (value: string) => void;
  importJson: () => boolean;
  resetModule: () => void;
};

function stamp(moduleData: EducationModule): EducationModule {
  return { ...moduleData, updatedAt: new Date().toISOString() };
}

function pushHistory(state: ModuleStore, reason: string) {
  return {
    past: [...state.past, { module: state.module, reason, timestamp: new Date().toISOString() }].slice(-HISTORY_LIMIT),
    future: []
  };
}

function validateModule(value: unknown): EducationModule {
  if (!value || typeof value !== 'object') {
    throw new Error('Import must be a JSON object.');
  }

  const candidate = value as EducationModule;
  if (!candidate.title || !Array.isArray(candidate.blocks)) {
    throw new Error('Module JSON requires a title and blocks array.');
  }

  candidate.blocks.forEach((block) => {
    if (!block.id || !block.type || !block.title) {
      throw new Error('Every block needs id, type, and title fields.');
    }
  });

  return {
    id: candidate.id || `module-${Date.now()}`,
    title: candidate.title,
    audience: candidate.audience || 'General learners',
    objective: candidate.objective || 'Teach a financial concept interactively.',
    estimatedMinutes: Number(candidate.estimatedMinutes) || 10,
    updatedAt: candidate.updatedAt || new Date().toISOString(),
    blocks: candidate.blocks.map((block) => ({
      id: block.id,
      type: block.type,
      title: block.title,
      content: block.content || '',
      metadata: block.metadata || {}
    }))
  };
}

export const useModuleStore = create<ModuleStore>((set, get) => ({
  module: sampleModule,
  past: [],
  future: [],
  selectedBlockId: sampleModule.blocks[0]?.id ?? null,
  jsonDraft: JSON.stringify(sampleModule, null, 2),
  importError: null,
  addBlock: (type) =>
    set((state) => {
      const block = createBlock(type);
      const nextModule = stamp({ ...state.module, blocks: [...state.module.blocks, block] });
      return {
        ...pushHistory(state, `Added ${type}`),
        module: nextModule,
        selectedBlockId: block.id,
        jsonDraft: JSON.stringify(nextModule, null, 2),
        importError: null
      };
    }),
  updateBlock: (id, patch) =>
    set((state) => {
      const nextModule = stamp({
        ...state.module,
        blocks: state.module.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block))
      });
      return { ...pushHistory(state, 'Updated block'), module: nextModule, jsonDraft: JSON.stringify(nextModule, null, 2) };
    }),
  removeBlock: (id) =>
    set((state) => {
      const nextModule = stamp({ ...state.module, blocks: state.module.blocks.filter((block) => block.id !== id) });
      return {
        ...pushHistory(state, 'Removed block'),
        module: nextModule,
        selectedBlockId: nextModule.blocks[0]?.id ?? null,
        jsonDraft: JSON.stringify(nextModule, null, 2)
      };
    }),
  reorderBlocks: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.module.blocks.findIndex((block) => block.id === activeId);
      const newIndex = state.module.blocks.findIndex((block) => block.id === overId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return state;
      }
      const nextModule = stamp({ ...state.module, blocks: arrayMove(state.module.blocks, oldIndex, newIndex) });
      return { ...pushHistory(state, 'Reordered blocks'), module: nextModule, jsonDraft: JSON.stringify(nextModule, null, 2) };
    }),
  setSelectedBlock: (id) => set({ selectedBlockId: id }),
  updateModuleMeta: (patch) =>
    set((state) => {
      const nextModule = stamp({ ...state.module, ...patch });
      return { ...pushHistory(state, 'Updated module settings'), module: nextModule, jsonDraft: JSON.stringify(nextModule, null, 2) };
    }),
  undo: () =>
    set((state) => {
      const previous = state.past.at(-1);
      if (!previous) {
        return state;
      }
      return {
        module: previous.module,
        past: state.past.slice(0, -1),
        future: [{ module: state.module, reason: 'Redo point', timestamp: new Date().toISOString() }, ...state.future],
        selectedBlockId: previous.module.blocks[0]?.id ?? null,
        jsonDraft: JSON.stringify(previous.module, null, 2),
        importError: null
      };
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0];
      if (!next) {
        return state;
      }
      return {
        module: next.module,
        past: [...state.past, { module: state.module, reason: 'Undo point', timestamp: new Date().toISOString() }].slice(
          -HISTORY_LIMIT
        ),
        future: state.future.slice(1),
        selectedBlockId: next.module.blocks[0]?.id ?? null,
        jsonDraft: JSON.stringify(next.module, null, 2),
        importError: null
      };
    }),
  exportJson: () => JSON.stringify(get().module, null, 2),
  setJsonDraft: (value) => set({ jsonDraft: value }),
  importJson: () => {
    try {
      const importedModule = stamp(validateModule(JSON.parse(get().jsonDraft)));
      set((state) => ({
        ...pushHistory(state, 'Imported JSON'),
        module: importedModule,
        selectedBlockId: importedModule.blocks[0]?.id ?? null,
        jsonDraft: JSON.stringify(importedModule, null, 2),
        importError: null
      }));
      return true;
    } catch (error) {
      set({ importError: error instanceof Error ? error.message : 'Invalid JSON import.' });
      return false;
    }
  },
  resetModule: () =>
    set((state) => ({
      ...pushHistory(state, 'Reset module'),
      module: sampleModule,
      selectedBlockId: sampleModule.blocks[0]?.id ?? null,
      jsonDraft: JSON.stringify(sampleModule, null, 2),
      importError: null
    }))
}));

export { HISTORY_LIMIT };
