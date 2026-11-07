'use client';

import { useState } from 'react';
import { type Block, type BlockType } from '@/components/editor/editor.types';
import { getAddableBlockTypes, getBlockLabel } from '@/components/editor/blocks/block-registry';
import * as Icon from '@/components/ui/icons';
import { BlockTypeIcon } from './editor-icons';
import { blockSummary } from './blocks/block-meta';

// Navegador en árbol colapsable (estilo explorador) de los bloques del
// documento. Opcionalmente muestra una sección «Añadir» en la raíz.
export function Navigator({
  blocks,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
  filterText = '',
}: {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd?: (type: BlockType) => void;
  onRemove?: (id: string) => void;
  filterText?: string;
}) {
  const query = filterText.trim().toLowerCase();
  // Ids de contenedores plegados (por defecto todos abiertos).
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function matchesBlock(block: Block): boolean {
    if (query.length === 0) return true;
    const summary = blockSummary(block).toLowerCase();
    const label = getBlockLabel(block.type).toLowerCase();
    const text = block.text.toLowerCase();
    return label.includes(query) || summary.includes(query) || text.includes(query);
  }

  function matchesTree(block: Block): boolean {
    if (matchesBlock(block)) return true;
    return (block.children ?? []).some(matchesTree);
  }

  return (
    <div className="space-y-4 p-2">
      <div>
        <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Elementos
        </div>
        {blocks.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 px-2 py-3 text-center text-xs text-slate-400">
            Sin elementos
          </div>
        ) : (
          <ul className="text-sm">
            {blocks.filter(matchesTree).map((block) => (
              <NavigatorNode
                key={block.id}
                block={block}
                selectedId={selectedId}
                collapsed={collapsed}
                onSelect={onSelect}
                onToggle={toggle}
                onRemove={onRemove}
                filterText={query}
              />
            ))}
          </ul>
        )}
      </div>

      {onAdd && (
        <div>
          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Añadir
          </div>
          <div className="flex flex-wrap gap-1">
            {getAddableBlockTypes().map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onAdd(type)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                + {getBlockLabel(type)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Nodo recursivo del navegador: fila con chevron (si tiene hijos), icono del
// tipo y etiqueta; los hijos se indentan con una guía vertical y se pliegan.
function NavigatorNode({
  block,
  selectedId,
  collapsed,
  onSelect,
  onToggle,
  onRemove,
  filterText = '',
}: {
  block: Block;
  selectedId: string | null;
  collapsed: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
  filterText?: string;
}) {
  const children = block.children ?? [];
  const hasChildren = children.length > 0;
  const isOpen = !collapsed.has(block.id);
  const isSelected = block.id === selectedId;
  const query = filterText.trim().toLowerCase();
  const childMatches = children.filter((child) => {
    const label = getBlockLabel(child.type).toLowerCase();
    const summary = blockSummary(child).toLowerCase();
    const text = child.text.toLowerCase();
    return query.length === 0 || label.includes(query) || summary.includes(query) || text.includes(query);
  });

  return (
    <li>
      <div
        className={`flex items-center gap-1 rounded-md border px-1.5 py-1.5 ${
          isSelected
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(block.id)}
            aria-label={isOpen ? 'Contraer' : 'Expandir'}
            className="shrink-0 rounded p-0.5 hover:bg-black/10"
          >
            <Icon.NavChevron className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="inline-block w-4 shrink-0" />
        )}
        <BlockTypeIcon type={block.type} className="h-3.5 w-3.5 shrink-0 opacity-70" />
        <button
          type="button"
          onClick={() => onSelect(block.id)}
          className="flex min-w-0 flex-1 items-baseline gap-1 truncate text-left"
        >
          <span className="font-medium">{getBlockLabel(block.type)}</span>
          <span className={`truncate text-xs ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
            {blockSummary(block)}
          </span>
        </button>
        {children.length > 0 && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {children.length}
          </span>
        )}
        {onRemove && isSelected && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(block.id);
            }}
            className={`shrink-0 rounded border p-1 ${
              isSelected
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
            aria-label="Eliminar bloque"
            title="Eliminar bloque"
          >
            <Icon.TrashIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {hasChildren && isOpen && childMatches.length > 0 && (
        <ul className="ml-3 border-l border-slate-200 pl-2">
          {children
            .filter((child) => {
              if (query.length === 0) return true;
              const label = getBlockLabel(child.type).toLowerCase();
              const summary = blockSummary(child).toLowerCase();
              const text = child.text.toLowerCase();
              return label.includes(query) || summary.includes(query) || text.includes(query) || (child.children ?? []).some((nested) => {
                const nestedLabel = getBlockLabel(nested.type).toLowerCase();
                const nestedSummary = blockSummary(nested).toLowerCase();
                const nestedText = nested.text.toLowerCase();
                return nestedLabel.includes(query) || nestedSummary.includes(query) || nestedText.includes(query);
              });
            })
            .map((child) => (
            <NavigatorNode
              key={child.id}
              block={child}
              selectedId={selectedId}
              collapsed={collapsed}
              onSelect={onSelect}
              onToggle={onToggle}
              onRemove={onRemove}
              filterText={query}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
