import { createBlock, parseDocument, serializeDocument } from '@/components/editor/editor.helpers';
import type { Block } from '@/components/editor/editor.types';

describe('createBlock', () => {
  it('crea un bloque con id, tipo y texto vacío', () => {
    const block = createBlock('paragraph');
    expect(block.id).toEqual(expect.any(String));
    expect(block.id.length).toBeGreaterThan(0);
    expect(block.type).toBe('paragraph');
    expect(block.text).toBe('');
    expect(block.url).toBeUndefined();
  });

  it('inicializa url vacía para bloques de imagen', () => {
    const block = createBlock('image');
    expect(block.type).toBe('image');
    expect(block.url).toBe('');
  });

  it('genera ids distintos en cada llamada', () => {
    expect(createBlock('heading').id).not.toBe(createBlock('heading').id);
  });
});

describe('serializeDocument', () => {
  it('serializa a JSON con version 1 y los bloques', () => {
    const blocks: Block[] = [{ id: 'b1', type: 'heading', text: 'Hola' }];
    const json = serializeDocument(blocks);
    expect(JSON.parse(json)).toEqual({ version: 1, blocks });
  });
});

describe('parseDocument', () => {
  it('devuelve documento vacío para null/undefined/""', () => {
    expect(parseDocument(null).blocks).toEqual([]);
    expect(parseDocument(undefined).blocks).toEqual([]);
    expect(parseDocument('').blocks).toEqual([]);
  });

  it('parsea un JSON de bloques válido', () => {
    const blocks: Block[] = [
      { id: 'b1', type: 'heading', text: 'Título' },
      { id: 'b2', type: 'image', text: 'alt', url: 'https://x/y.png' },
    ];
    const result = parseDocument(serializeDocument(blocks));
    expect(result.blocks).toEqual(blocks);
  });

  it('descarta bloques inválidos dentro del JSON', () => {
    const json = JSON.stringify({
      version: 1,
      blocks: [
        { id: 'ok', type: 'paragraph', text: 'bien' },
        { id: 'malo', type: 'desconocido', text: 'x' },
        { type: 'paragraph', text: 'sin id' },
      ],
    });
    const result = parseDocument(json);
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0].id).toBe('ok');
  });

  it('envuelve texto plano legacy en un único bloque de párrafo', () => {
    const result = parseDocument('Contenido antiguo en texto plano');
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0].type).toBe('paragraph');
    expect(result.blocks[0].text).toBe('Contenido antiguo en texto plano');
  });

  it('conserva los estilos válidos y descarta valores no string', () => {
    const json = JSON.stringify({
      version: 1,
      blocks: [
        {
          id: 'b1',
          type: 'heading',
          text: 'Hola',
          style: { textAlign: 'center', fontSize: '20px', invalido: 5, vacio: '' },
        },
      ],
    });
    const result = parseDocument(json);
    expect(result.blocks[0].style).toEqual({ textAlign: 'center', fontSize: '20px' });
  });
});
