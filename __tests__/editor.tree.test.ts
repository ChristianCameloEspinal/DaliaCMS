import {
  collectMediaIds,
  collectPatternIds,
  createBlock,
  findBlockById,
  findSiblings,
  insertBlock,
  mapBlockById,
  moveBlockById,
  parseDocument,
  removeBlockById,
  serializeDocument,
} from '@/components/editor/editor.helpers';
import type { Block } from '@/components/editor/editor.types';

describe('createBlock (contenedores)', () => {
  it('crea un grupo vertical vacío con layout por defecto', () => {
    const group = createBlock('group');
    expect(group.type).toBe('group');
    expect(group.children).toEqual([]);
    expect(group.layout).toEqual({ direction: 'column', gap: '16px' });
  });

  it('crea columnas con dos columnas hijas', () => {
    const columns = createBlock('columns');
    expect(columns.type).toBe('columns');
    expect(columns.children).toHaveLength(2);
    expect(columns.children?.every((child) => child.type === 'column')).toBe(true);
  });

  it('crea un bloque de patrón sincronizado vacío', () => {
    const pattern = createBlock('pattern');
    expect(pattern.type).toBe('pattern');
    expect(pattern.patternId).toBe('');
  });

  it('crea un bloque de contenido dinamico para plantillas', () => {
    const content = createBlock('content');
    expect(content.type).toBe('content');
    expect(content.text).toBe('Contenido');
  });

  it('crea un bloque de lista como bloque de texto insertable', () => {
    const list = createBlock('list');
    expect(list.type).toBe('list');
    expect(list.text).toBe('');
  });
});

describe('parseDocument (anidado)', () => {
  it('conserva y sanea contenedores anidados, descartando hijos inválidos', () => {
    const json = JSON.stringify({
      version: 1,
      blocks: [
        {
          id: 'g1',
          type: 'group',
          text: '',
          layout: { direction: 'row', gap: '8px', basura: 1 },
          children: [
            { id: 'h1', type: 'heading', text: 'Título' },
            { id: 'bad', type: 'desconocido', text: 'x' },
            {
              id: 'c1',
              type: 'columns',
              text: '',
              children: [{ id: 'col1', type: 'column', text: '', children: [] }],
            },
          ],
        },
      ],
    });
    const { blocks } = parseDocument(json);
    expect(blocks).toHaveLength(1);
    const group = blocks[0];
    expect(group.layout).toEqual({ direction: 'row', gap: '8px' });
    // El hijo inválido se descarta: quedan heading + columns.
    expect(group.children).toHaveLength(2);
    expect(group.children?.[1].children?.[0].type).toBe('column');
  });

  it('round-trip de un árbol con serializeDocument/parseDocument', () => {
    const tree: Block[] = [
      {
        id: 'g',
        type: 'group',
        text: '',
        layout: { direction: 'column', gap: '16px' },
        children: [{ id: 'p', type: 'paragraph', text: 'hola' }],
      },
    ];
    expect(parseDocument(serializeDocument(tree)).blocks).toEqual(tree);
  });

  it('conserva referencias a patrones sincronizados', () => {
    const tree: Block[] = [{ id: 'pat', type: 'pattern', text: '', patternId: 'pattern-1' }];
    expect(parseDocument(serializeDocument(tree)).blocks).toEqual(tree);
  });

  it('conserva el bloque de contenido dinamico', () => {
    const tree: Block[] = [{ id: 'content', type: 'content', text: 'Contenido' }];
    expect(parseDocument(serializeDocument(tree)).blocks).toEqual(tree);
  });

  it('conserva el bloque de lista', () => {
    const tree: Block[] = [{ id: 'list', type: 'list', text: 'Uno\nDos' }];
    expect(parseDocument(serializeDocument(tree)).blocks).toEqual(tree);
  });
});

describe('operaciones del árbol', () => {
  const tree: Block[] = [
    {
      id: 'g',
      type: 'group',
      text: '',
      children: [
        { id: 'a', type: 'paragraph', text: 'A' },
        { id: 'b', type: 'paragraph', text: 'B' },
      ],
    },
    { id: 'top', type: 'heading', text: 'Top' },
  ];

  it('findBlockById encuentra en cualquier nivel', () => {
    expect(findBlockById(tree, 'b')?.text).toBe('B');
    expect(findBlockById(tree, 'top')?.type).toBe('heading');
    expect(findBlockById(tree, 'noexiste')).toBeNull();
  });

  it('insertBlock añade dentro del contenedor indicado', () => {
    const next = insertBlock(tree, 'g', { id: 'c', type: 'paragraph', text: 'C' });
    expect(findBlockById(next, 'g')?.children).toHaveLength(3);
    // No muta el original.
    expect(findBlockById(tree, 'g')?.children).toHaveLength(2);
  });

  it('insertBlock con parentId null añade en la raíz', () => {
    const next = insertBlock(tree, null, { id: 'z', type: 'paragraph', text: 'Z' });
    expect(next).toHaveLength(3);
    expect(next[2].id).toBe('z');
  });

  it('removeBlockById elimina un hijo anidado', () => {
    const next = removeBlockById(tree, 'a');
    expect(findBlockById(next, 'a')).toBeNull();
    expect(findBlockById(next, 'g')?.children).toHaveLength(1);
  });

  it('mapBlockById aplica el patch al bloque correcto', () => {
    const next = mapBlockById(tree, 'b', (block) => ({ ...block, text: 'B!' }));
    expect(findBlockById(next, 'b')?.text).toBe('B!');
  });

  it('moveBlockById reordena entre hermanos', () => {
    const next = moveBlockById(tree, 'b', -1);
    expect(findBlockById(next, 'g')?.children?.map((c) => c.id)).toEqual(['b', 'a']);
  });

  it('moveBlockById no hace nada en los extremos', () => {
    const next = moveBlockById(tree, 'a', -1);
    expect(findBlockById(next, 'g')?.children?.map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('findSiblings devuelve índice y total entre hermanos', () => {
    expect(findSiblings(tree, 'b')).toEqual({ index: 1, total: 2 });
    expect(findSiblings(tree, 'top')).toEqual({ index: 1, total: 2 });
    expect(findSiblings(tree, 'noexiste')).toEqual({ index: -1, total: 0 });
  });

  it('collectMediaIds recolecta punteros de imagen en todo el árbol', () => {
    const withImages: Block[] = [
      { id: 'i1', type: 'image', text: '', mediaId: 'm1' },
      {
        id: 'g',
        type: 'group',
        text: '',
        children: [{ id: 'i2', type: 'image', text: '', mediaId: 'm2' }],
      },
    ];
    expect(collectMediaIds(withImages)).toEqual(['m1', 'm2']);
  });

  it('collectPatternIds recolecta patrones sincronizados sin duplicados', () => {
    const withPatterns: Block[] = [
      { id: 'p1', type: 'pattern', text: '', patternId: 'sync-1' },
      {
        id: 'g',
        type: 'group',
        text: '',
        children: [
          { id: 'p2', type: 'pattern', text: '', patternId: 'sync-2' },
          { id: 'p3', type: 'pattern', text: '', patternId: 'sync-1' },
        ],
      },
    ];
    expect(collectPatternIds(withPatterns)).toEqual(['sync-1', 'sync-2']);
  });
});
