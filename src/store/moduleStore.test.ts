import { act } from '@testing-library/react';
import { HISTORY_LIMIT, useModuleStore } from './moduleStore';

describe('module store', () => {
  beforeEach(() => {
    act(() => {
      useModuleStore.getState().resetModule();
      useModuleStore.setState({ past: [], future: [] });
    });
  });

  it('adds blocks and supports undo and redo', () => {
    const initialCount = useModuleStore.getState().module.blocks.length;

    act(() => {
      useModuleStore.getState().addBlock('sipCalculator');
    });

    expect(useModuleStore.getState().module.blocks).toHaveLength(initialCount + 1);

    act(() => {
      useModuleStore.getState().undo();
    });

    expect(useModuleStore.getState().module.blocks).toHaveLength(initialCount);

    act(() => {
      useModuleStore.getState().redo();
    });

    expect(useModuleStore.getState().module.blocks).toHaveLength(initialCount + 1);
  });

  it('caps history at fifty changes', () => {
    act(() => {
      for (let index = 0; index < HISTORY_LIMIT + 5; index += 1) {
        useModuleStore.getState().addBlock('callout');
      }
    });

    expect(useModuleStore.getState().past).toHaveLength(HISTORY_LIMIT);
  });

  it('rejects invalid JSON imports with a clear error', () => {
    act(() => {
      useModuleStore.getState().setJsonDraft('{ nope');
      useModuleStore.getState().importJson();
    });

    expect(useModuleStore.getState().importError).toBeTruthy();
  });
});
