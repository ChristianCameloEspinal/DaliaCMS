'use client';

import { useState } from 'react';
import { type Block, type PatternBlockMap } from '@/components/editor/editor.types';
import { getBlockLabel } from '@/components/editor/blocks/block-registry';
import * as Icon from '@/components/ui/icons';
import { blockSummary } from './block-meta';

export function BlockHtmlOutline({
  title,
  blocks,
  selectedId,
  patterns,
  onSelect,
  filterText = '',
}: {
  title?: string;
  blocks: Block[];
  selectedId: string | null;
  patterns?: PatternBlockMap;
  onSelect?: (id: string) => void;
  filterText?: string;
}) {
  const query = filterText.trim().toLowerCase();
  const filteredBlocks = query ? blocks.filter((block) => matchesTree(block, query, patterns)) : blocks;
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-2 p-2">
      <div className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Estructura SEO
      </div>
      <ul className="space-y-1 text-sm">
        {title && (
          <li className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700">
            <span className="font-mono text-xs text-slate-500">&lt;h1&gt;</span>
            <span className="ml-2 truncate font-medium">{title}</span>
          </li>
        )}
        {filteredBlocks.map((block) => (
          <HtmlOutlineNode
            key={block.id}
            block={block}
            selectedId={selectedId}
            patterns={patterns}
            onSelect={onSelect}
            collapsed={collapsed}
            onToggle={toggle}
            query={query}
          />
        ))}
      </ul>
      {!title && filteredBlocks.length === 0 && (
        <div className="rounded-md border border-dashed border-slate-300 px-2 py-3 text-center text-xs text-slate-400">
          Sin estructura
        </div>
      )}
    </div>
  );
}

function HtmlOutlineNode({
  block,
  selectedId,
  patterns,
  onSelect,
  collapsed,
  onToggle,
  query,
}: {
  block: Block;
  selectedId: string | null;
  patterns?: PatternBlockMap;
  onSelect?: (id: string) => void;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
  query: string;
}) {
  const tag = getHtmlTag(block);
  const children = getRenderedChildren(block, patterns).filter((child) =>
    query ? matchesTree(child, query, patterns) : true
  );
  const hasChildren = children.length > 0;
  const isOpen = query ? true : !collapsed.has(block.id);
  const isSelected = block.id === selectedId;

  return (
    <li>
      <div
        className={`flex w-full items-start gap-2 rounded-md border px-2 py-1.5 text-left transition ${
          isSelected
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle(block.id);
            }}
            aria-label={isOpen ? 'Contraer' : 'Expandir'}
            className="mt-0.5 shrink-0 rounded p-0.5 hover:bg-black/10"
          >
            <Icon.NavChevron className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="mt-0.5 inline-block w-4 shrink-0" />
        )}
        <span className={`shrink-0 font-mono text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
          &lt;{tag}&gt;
        </span>
        <button
          type="button"
          onClick={() => onSelect?.(block.id)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate font-medium">{getBlockLabel(block.type)}</span>
          <span className={`block truncate text-xs ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
            {blockSummary(block) || block.type}
          </span>
        </button>
      </div>
      {hasChildren && isOpen && (
        <ul className="ml-4 border-l border-slate-200 pl-2 pt-1">
          {children.map((child) => (
            <HtmlOutlineNode
              key={child.id}
              block={child}
              selectedId={selectedId}
              patterns={patterns}
              onSelect={onSelect}
              collapsed={collapsed}
              onToggle={onToggle}
              query={query}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function getRenderedChildren(block: Block, patterns?: PatternBlockMap): Block[] {
  if (block.type === 'pattern' && block.patternId) {
    return patterns?.[block.patternId]?.blocks ?? [];
  }
  return block.children ?? [];
}

function matchesTree(block: Block, query: string, patterns?: PatternBlockMap): boolean {
  const label = getBlockLabel(block.type).toLowerCase();
  const summary = blockSummary(block).toLowerCase();
  const tag = getHtmlTag(block);
  const text = block.text.toLowerCase();
  if (label.includes(query) || summary.includes(query) || tag.includes(query) || text.includes(query)) {
    return true;
  }
  return getRenderedChildren(block, patterns).some((child) => matchesTree(child, query, patterns));
}

function getHtmlTag(block: Block): string {
  if (block.type === 'heading') return 'h2';
  if (block.type === 'paragraph') return 'p';
  if (block.type === 'quote') return 'blockquote';
  if (block.type === 'list') return 'ul';
  if (block.type === 'image') return 'img';
  if (block.type === 'group') return 'section';
  if (block.type === 'columns' || block.type === 'column') return 'div';
  if (block.type === 'pattern') return 'div';
  return 'div';
}
