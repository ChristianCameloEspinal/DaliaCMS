import { useCallback, useMemo, useState } from 'react';
import { blockSummary } from '@/components/editor/blocks/block-meta';
import { type Block, type PatternBlockMap } from '@/components/editor/editor.types';

export interface EditorPatternItem {
  id: string;
  label: string;
  blocks: Block[];
  isNew?: boolean;
  dirty?: boolean;
}

function cloneBlock(block: Block): Block {
  return {
    ...block,
    id: crypto.randomUUID(),
    children: block.children?.map(cloneBlock),
  };
}

export function useEditorPatterns(initialPatterns: EditorPatternItem[]) {
  const [patterns, setPatterns] = useState<EditorPatternItem[]>(initialPatterns);

  const patternMap = useMemo<PatternBlockMap>(
    () =>
      Object.fromEntries(
        patterns.map((pattern) => [pattern.id, { label: pattern.label, blocks: pattern.blocks }])
      ),
    [patterns]
  );

  const updatePatternBlocks = useCallback((patternId: string, update: (blocks: Block[]) => Block[]) => {
    setPatterns((prev) =>
      prev.map((pattern) =>
        pattern.id === patternId
          ? { ...pattern, blocks: update(pattern.blocks), dirty: true }
          : pattern
      )
    );
  }, []);

  const buildPatternFromBlock = useCallback((selected: Block) => {
    if (selected.type === 'pattern') return null;

    const pattern: EditorPatternItem = {
      id: `tmp-${crypto.randomUUID()}`,
      label: blockSummary(selected),
      blocks: [cloneBlock(selected)],
      isNew: true,
      dirty: true,
    };

    const reference: Block = {
      id: crypto.randomUUID(),
      type: 'pattern',
      text: '',
      patternId: pattern.id,
      align: selected.align,
    };

    return { pattern, reference };
  }, []);

  const buildPatternReference = useCallback((patternId: string): Block => {
    return {
      id: crypto.randomUUID(),
      type: 'pattern',
      text: '',
      patternId,
    };
  }, []);

  return {
    patterns,
    setPatterns,
    patternMap,
    updatePatternBlocks,
    buildPatternFromBlock,
    buildPatternReference,
  };
}
