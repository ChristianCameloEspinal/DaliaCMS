import { isContainer, type Block } from '@/components/editor/editor.types';

// Resumen textual de un bloque para listas/navegador (recuento de hijos en
// contenedores, estado de imagen/componente, o el texto del bloque).
export function blockSummary(block: Block): string {
  if (isContainer(block.type)) {
    const count = block.children?.length ?? 0;
    return `${count} ${count === 1 ? 'elemento' : 'elementos'}`;
  }
  if (block.type === 'image') return block.mediaId || block.url?.trim() ? 'Imagen' : 'Sin imagen';
  if (block.type === 'pattern') return block.patternId ? 'Sincronizado' : 'Sin Component';
  return block.text.trim() || 'Vacío';
}

// `true` si un bloque hoja no tiene contenido (para mostrar un placeholder).
export function isEmptyLeaf(block: Block): boolean {
  return block.type === 'image' ? !(block.mediaId || block.url?.trim()) : !block.text.trim();
}
