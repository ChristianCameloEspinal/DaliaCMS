'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icon from '@/components/ui/icons';
import type { BlockType } from '@/components/editor/editor.types';
import { getAddableBlockTypes, getBlockLabel } from '@/components/editor/blocks/block-registry';
import { BlockTypeIcon } from '@/components/editor/editor-icons';

interface BlockToolsProps {
  visible: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMoveDragStart: () => void;
  onMoveDragEnd: () => void;
  onQuickAdd: (type: BlockType) => void;
  onOpenBlocksPanel: () => void;
}

// Caja reutilizable de acciones del bloque seleccionado.
// Se mantiene pequeña para que BlockPreviewer solo la instancie.
export function BlockTools({
  visible,
  onEdit,
  onRemove,
  onMoveDragStart,
  onMoveDragEnd,
  onQuickAdd,
  onOpenBlocksPanel,
}: BlockToolsProps) {
  const [quickOpen, setQuickOpen] = useState(false);
  const quickTypes = useMemo(() => getQuickBlockTypes(), []);

  if (!visible) return null;

  return (
    <div className="absolute left-[-0.25rem] top-[-2.5rem] z-20">
      <div className="flex gap-1">
        <Button
          type="button"
          variant="secondary"
          buttonSize="iconSm"
          className="border-slate-200 bg-white text-slate-700 shadow-sm cursor-grab active:cursor-grabbing"
          aria-label="Mover bloque"
          title="Mover bloque"
          draggable
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', 'move-block');
            onMoveDragStart();
          }}
          onDragEnd={(event) => {
            event.stopPropagation();
            onMoveDragEnd();
          }}
        >
          <Icon.MoveIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          buttonSize="iconSm"
          selected={quickOpen}
          className="border-slate-200 bg-white text-slate-700 shadow-sm"
          aria-label="Añadir bloque rápido"
          title="Añadir bloque"
          aria-expanded={quickOpen}
          onClick={(event) => {
            event.stopPropagation();
            setQuickOpen((current) => !current);
          }}
        >
          <Icon.PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          buttonSize="iconSm"
          className="border-slate-200 bg-white text-slate-700 shadow-sm"
          aria-label="Editar bloque"
          title="Editar bloque"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <Icon.EditIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          buttonSize="iconSm"
          className="border-slate-200 bg-white text-slate-700 shadow-sm"
          aria-label="Eliminar bloque"
          title="Eliminar bloque"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <Icon.IdeaIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          buttonSize="iconSm"
          className="border-slate-200 bg-white text-slate-700 shadow-sm"
          aria-label="Eliminar bloque"
          title="Eliminar bloque"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <Icon.TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      {quickOpen && (
        <div
          className="absolute left-full top-0 ml-2 w-64 border border-slate-200 bg-white p-2 shadow-lg"
          role="dialog"
          aria-label="Añadir bloque rápido"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-1.5">
            {quickTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onQuickAdd(type);
                  setQuickOpen(false);
                }}
                className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border border-slate-200 bg-white p-1 text-center text-[11px] font-medium text-slate-700 hover:border-slate-900 hover:text-slate-900"
                aria-label={`Añadir ${getBlockLabel(type)}`}
              >
                <BlockTypeIcon type={type} className="h-5 w-5" />
                <span className="max-w-full truncate">{getBlockLabel(type)}</span>
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            buttonSize="sm"
            className="mt-2 w-full"
            onClick={() => {
              setQuickOpen(false);
              onOpenBlocksPanel();
            }}
          >
            Mas bloques
          </Button>
        </div>
      )}
    </div>
  );
}

function getQuickBlockTypes(): BlockType[] {
  const priority: BlockType[] = [
    'heading',
    'paragraph',
    'image',
    'group',
    'columns',
    'quote',
    'list',
    'pattern',
    'content',
  ];
  const addable = getAddableBlockTypes();
  const ordered = priority.filter((type) => addable.includes(type));
  const rest = addable.filter((type) => !ordered.includes(type));
  return [...ordered, ...rest].slice(0, 9);
}
