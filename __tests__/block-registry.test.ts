import {
  collectRegisteredMediaIds,
  collectRegisteredPatternIds,
  getAddableBlockTypes,
  getBlockLabel,
  renderRegisteredBlock,
  registerBlockType,
  unregisterBlockType,
} from '@/components/editor/blocks/block-registry';
import { createBlock, parseDocument, serializeDocument } from '@/components/editor/editor.helpers';
import type { Block } from '@/components/editor/editor.types';

describe('block registry', () => {
  afterEach(() => {
    unregisterBlockType('test-card');
  });

  it('registra un bloque custom y lo expone como addable', () => {
    registerBlockType({
      type: 'test-card',
      label: 'Test card',
      category: 'layout',
      isAddable: true,
      create: () => ({ id: 'custom-id', type: 'test-card', text: 'Demo' }),
    });

    expect(getBlockLabel('test-card')).toBe('Test card');
    expect(getAddableBlockTypes()).toContain('test-card');
    expect(createBlock('test-card')).toEqual({ id: 'custom-id', type: 'test-card', text: 'Demo' });
  });

  it('parseDocument conserva bloques custom si su tipo esta registrado', () => {
    registerBlockType({
      type: 'test-card',
      label: 'Test card',
      category: 'layout',
      isAddable: true,
    });

    const blocks: Block[] = [{ id: 'b1', type: 'test-card', text: 'Contenido custom' }];
    expect(parseDocument(serializeDocument(blocks)).blocks).toEqual(blocks);
  });

  it('delega normalizacion, coleccion y render en la definicion registrada', () => {
    registerBlockType({
      type: 'test-card',
      label: 'Test card',
      category: 'layout',
      normalize: (block) => ({
        url: typeof block.url === 'string' ? block.url : 'fallback',
        mediaId: block.mediaId,
        patternId: block.patternId,
      }),
      collectMediaIds: (block) => (block.mediaId ? [block.mediaId] : []),
      collectPatternIds: (block) => (block.patternId ? [block.patternId] : []),
      render: ({ block }) => `render:${block.text}`,
    });

    const blocks: Block[] = [
      { id: 'b1', type: 'test-card', text: 'Demo', mediaId: 'm1', patternId: 'p1' },
    ];
    const parsed = parseDocument(serializeDocument(blocks)).blocks[0];

    expect(parsed.url).toBe('fallback');
    expect(collectRegisteredMediaIds(parsed)).toEqual(['m1']);
    expect(collectRegisteredPatternIds(parsed)).toEqual(['p1']);
    expect(renderRegisteredBlock({ block: parsed })).toBe('render:Demo');
  });
});
