import {
  isContainer,
  type Block,
  type BlockDocument,
  type BlockLayout,
  type BlockType,
  type LayoutDirection,
} from './editor.types';
import { sanitizeStyle, sanitizeStyleVariants } from './style-variants';
import {
  collectRegisteredMediaIds,
  collectRegisteredPatternIds,
  createRegisteredBlock,
  isRegisteredBlockType,
  normalizeRegisteredBlockFields,
} from './blocks/block-registry';

const DOCUMENT_VERSION = 1 as const;

function generateId(): string {
  // crypto.randomUUID está disponible tanto en el navegador como en Node 18+.
  return crypto.randomUUID();
}

// Crea un bloque vacío del tipo indicado. Los contenedores nacen con su layout
// por defecto; «columns» nace con dos columnas para ser útil al instante.
export function createBlock(type: BlockType): Block {
  return createRegisteredBlock(type);
}

// Comprueba que un valor desconocido tenga la forma de un Block válido (solo el
// nivel superior; los children se sanean en normalizeBlock).
function isValidBlock(value: unknown): value is Block {
  if (!value || typeof value !== 'object') return false;
  const block = value as Record<string, unknown>;
  return (
    typeof block.id === 'string' &&
    typeof block.type === 'string' &&
    isRegisteredBlockType(block.type) &&
    typeof block.text === 'string'
  );
}

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

// Sanea el layout de un contenedor conservando solo propiedades conocidas.
function sanitizeLayout(value: unknown): BlockLayout | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const layout: BlockLayout = {};
  if (raw.direction === 'row' || raw.direction === 'column') {
    layout.direction = raw.direction as LayoutDirection;
  }
  if (typeof raw.gap === 'string' && raw.gap.trim() !== '') layout.gap = raw.gap;
  if (typeof raw.justify === 'string' && raw.justify.trim() !== '') layout.justify = raw.justify;
  if (typeof raw.align === 'string' && raw.align.trim() !== '') layout.align = raw.align;
  if (typeof raw.wrap === 'boolean') layout.wrap = raw.wrap;
  return Object.keys(layout).length > 0 ? layout : undefined;
}

// Normaliza un bloque ya validado a una forma limpia (descarta props extra,
// sanea url/style/layout y recurre en los children de los contenedores).
function normalizeBlock(block: Block): Block {
  const clean: Block = { id: block.id, type: block.type, text: block.text };
  if (typeof block.ariaLabel === 'string' && block.ariaLabel.trim() !== '') {
    clean.ariaLabel = block.ariaLabel;
  }
  if (typeof block.title === 'string' && block.title.trim() !== '') {
    clean.title = block.title;
  }
  const visibility = sanitizeVisibility(block.visibility);
  if (visibility) clean.visibility = visibility;
  Object.assign(clean, normalizeRegisteredBlockFields(block));
  const style = sanitizeStyle(block.style);
  if (style) clean.style = style;
  const styleVariants = sanitizeStyleVariants(block.styleVariants);
  if (styleVariants) clean.styleVariants = styleVariants;
  if (block.align === 'wide' || block.align === 'full') clean.align = block.align;
  if (isContainer(block.type)) {
    if (!hasOwn(clean, 'layout')) {
      const layout = sanitizeLayout(block.layout);
      if (layout) clean.layout = layout;
    }
    if (!hasOwn(clean, 'children')) {
      const children = Array.isArray(block.children) ? block.children : [];
      clean.children = children.filter(isValidBlock).map(normalizeBlock);
    }
  }
  return clean;
}

function sanitizeVisibility(value: unknown): Block['visibility'] | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const visibility: NonNullable<Block['visibility']> = {};

  for (const device of ['desktop', 'tablet', 'mobile'] as const) {
    if (typeof raw[device] === 'boolean') {
      visibility[device] = raw[device];
    }
  }

  return Object.keys(visibility).length > 0 ? visibility : undefined;
}

// Convierte el contenido almacenado (string JSON, texto plano legacy o null) en
// un BlockDocument. Nunca lanza: el contenido inválido se trata como vacío y el
// texto plano antiguo se envuelve en un único bloque de párrafo.
export function parseDocument(content: string | null | undefined): BlockDocument {
  if (!content) {
    return { version: DOCUMENT_VERSION, blocks: [] };
  }

  try {
    const data = JSON.parse(content);
    if (data && typeof data === 'object' && Array.isArray((data as { blocks: unknown[] }).blocks)) {
      const blocks = (data as { blocks: unknown[] }).blocks
        .filter(isValidBlock)
        .map(normalizeBlock);
      return { version: DOCUMENT_VERSION, blocks };
    }
  } catch {
    // No es JSON: contenido legacy en texto plano.
  }

  return {
    version: DOCUMENT_VERSION,
    blocks: [{ id: generateId(), type: 'paragraph', text: content }],
  };
}

// Serializa una lista de bloques al JSON que se guarda en post_content.
export function serializeDocument(blocks: Block[]): string {
  const document: BlockDocument = { version: DOCUMENT_VERSION, blocks };
  return JSON.stringify(document);
}

// --- Operaciones puras sobre el árbol de bloques (recursivas) -----------------
// Estas funciones devuelven una nueva lista sin mutar la original, para usarse
// con setState en el editor y poder testearse sin React.

// Busca un bloque por id en cualquier nivel del árbol.
export function findBlockById(blocks: Block[], id: string): Block | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Aplica `fn` al bloque con ese id (en cualquier nivel) y devuelve un árbol nuevo.
export function mapBlockById(blocks: Block[], id: string, fn: (block: Block) => Block): Block[] {
  return blocks.map((block) => {
    if (block.id === id) return fn(block);
    if (block.children) return { ...block, children: mapBlockById(block.children, id, fn) };
    return block;
  });
}

// Elimina el bloque con ese id en cualquier nivel del árbol.
export function removeBlockById(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) =>
      block.children ? { ...block, children: removeBlockById(block.children, id) } : block
    );
}

// Inserta un bloque al final de los children del contenedor `parentId`, o al
// final de la raíz si `parentId` es null.
export function insertBlock(blocks: Block[], parentId: string | null, block: Block): Block[] {
  if (parentId === null) return [...blocks, block];
  return blocks.map((current) => {
    if (current.id === parentId) {
      return { ...current, children: [...(current.children ?? []), block] };
    }
    if (current.children) {
      return { ...current, children: insertBlock(current.children, parentId, block) };
    }
    return current;
  });
}

// Mueve el bloque `id` una posición arriba (-1) o abajo (1) entre sus hermanos.
// Encuentra la posiciÃ³n del bloque entre sus hermanos.
function findBlockLocation(
  blocks: Block[],
  id: string,
  parentId: string | null = null
): { parentId: string | null; index: number } | null {
  const index = blocks.findIndex((block) => block.id === id);
  if (index >= 0) return { parentId, index };

  for (const block of blocks) {
    if (!block.children) continue;
    const found = findBlockLocation(block.children, id, block.id);
    if (found) return found;
  }

  return null;
}

export function insertBlockAtIndex(
  blocks: Block[],
  parentId: string | null,
  index: number,
  block: Block
): Block[] {
  if (parentId === null) {
    const next = [...blocks];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, block);
    return next;
  }

  return blocks.map((current) => {
    if (current.id === parentId) {
      const children = [...(current.children ?? [])];
      children.splice(Math.max(0, Math.min(index, children.length)), 0, block);
      return { ...current, children };
    }
    if (current.children) {
      return { ...current, children: insertBlockAtIndex(current.children, parentId, index, block) };
    }
    return current;
  });
}

export function moveBlockToIndex(
  blocks: Block[],
  id: string,
  targetParentId: string | null,
  targetIndex: number
): Block[] {
  const location = findBlockLocation(blocks, id);
  if (!location) return blocks;

  const block = findBlockById(blocks, id);
  if (!block) return blocks;

  const without = removeBlockById(blocks, id);
  const adjustedIndex =
    location.parentId === targetParentId && location.index < targetIndex ? targetIndex - 1 : targetIndex;

  return insertBlockAtIndex(without, targetParentId, adjustedIndex, block);
}

export function moveBlockById(blocks: Block[], id: string, direction: -1 | 1): Block[] {
  const index = blocks.findIndex((block) => block.id === id);
  if (index >= 0) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return blocks;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }
  return blocks.map((block) =>
    block.children ? { ...block, children: moveBlockById(block.children, id, direction) } : block
  );
}

// Posición del bloque entre sus hermanos y total de hermanos (para deshabilitar
// mover ↑/↓ en los extremos). Devuelve { index: -1, total: 0 } si no se halla.
export function findSiblings(blocks: Block[], id: string): { index: number; total: number } {
  const index = blocks.findIndex((block) => block.id === id);
  if (index >= 0) return { index, total: blocks.length };
  for (const block of blocks) {
    if (block.children) {
      const result = findSiblings(block.children, id);
      if (result.index >= 0) return result;
    }
  }
  return { index: -1, total: 0 };
}

// Recolecta todos los mediaId (punteros de imagen) del árbol, para resolver las
// URLs en SSR y en el preview.
export function collectMediaIds(blocks: Block[]): string[] {
  const ids: string[] = [];
  for (const block of blocks) {
    ids.push(...collectRegisteredMediaIds(block));
    if (block.children) ids.push(...collectMediaIds(block.children));
  }
  return ids;
}

// Recolecta todos los patternId del árbol. Los componentes sincronizados se
// resuelven aparte porque viven como objetos compartidos fuera del post.
export function collectPatternIds(blocks: Block[]): string[] {
  const ids: string[] = [];
  for (const block of blocks) {
    ids.push(...collectRegisteredPatternIds(block));
    if (block.children) ids.push(...collectPatternIds(block.children));
  }
  return Array.from(new Set(ids));
}
