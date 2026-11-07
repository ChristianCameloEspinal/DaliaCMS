import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { blockAlignStyle } from '@/core/editor-variables/editor-variables.styles';
import type { MediaMap } from '@/media/media.types';
import {
  isContainer,
  type Block,
  type PatternBlockMap,
  type StyleDevice,
  type StyleState,
} from '@/components/editor/editor.types';
import type { BlockType } from '@/components/editor/editor.types';
import { getBlockDefaultStyle, getBlockLabel, renderRegisteredBlock } from '@/components/editor/blocks/block-registry';
import { BlockView, containerLayoutStyle } from '@/components/editor/blocks/block-view';
import { BlockTools } from './block-tools';
import { isEmptyLeaf } from './block-meta';
import { resolveBlockStyle } from '@/components/editor/style-variants';

// Render recursivo de un bloque en el preview del editor: aplica el mismo layout
// que el render público (containerLayoutStyle / BlockView) y añade la selección.
// El ancho por alineación (content/wide/full) solo se aplica en el nivel raíz
// (depth 0); dentro de un contenedor los bloques son ítems flex. Soporta
// referencias a componentes (renderiza sus bloques, seleccionables con su patternId).
export function BlockPreviewer({
  block,
  depth,
  parentId = null,
  index,
  selectedId,
  selectedPatternId,
  media,
  patterns,
  patternId = null,
  styleDevice,
  styleState,
  draggingId,
  dropTarget,
  onSelect,
  onEdit,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onQuickAdd,
  onOpenBlocksPanel,
  onTextChange,
}: {
  block: Block;
  depth: number;
  parentId?: string | null;
  index: number;
  selectedId: string | null;
  selectedPatternId: string | null;
  media: MediaMap;
  patterns: PatternBlockMap;
  patternId?: string | null;
  styleDevice: StyleDevice;
  styleState: StyleState;
  draggingId: string | null;
  dropTarget: { id: string; parentId: string | null; index: number; position: 'before' | 'after' } | null;
  onSelect: (id: string, patternId?: string | null) => void;
  onEdit: (id: string, patternId?: string | null) => void;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (target: {
    id: string;
    parentId: string | null;
    index: number;
    position: 'before' | 'after';
  }) => void;
  onDrop: (target: {
    id: string;
    parentId: string | null;
    index: number;
    position: 'before' | 'after';
  }) => void;
  onDragEnd: () => void;
  onQuickAdd: (
    type: BlockType,
    target: { parentId: string | null; index: number; patternId: string | null }
  ) => void;
  onOpenBlocksPanel: () => void;
  onTextChange: (id: string, text: string, patternId: string | null) => void;
}) {
  const isSelected = block.id === selectedId && patternId === selectedPatternId;
  const isDragging = draggingId === block.id && patternId === null;
  const isHidden = block.visibility?.[styleDevice] === false;
  const hiddenOverlayClass =
    'after:pointer-events-none after:absolute after:inset-0 after:opacity-30 after:bg-[repeating-linear-gradient(45deg,#606dbc,#606dbc_10px,#465298_10px,#465298_20px)]';
  const isDropTarget =
    dropTarget?.id === block.id && dropTarget.parentId === parentId && dropTarget.index === index;
  const ringClass = `relative cursor-pointer ring-offset-2 transition ${
    isDragging ? 'opacity-50' : ''
  } ${
    isSelected ? 'ring-2 ring-slate-500' : 'hover:ring-2 hover:ring-slate-200'
  }`;
  const alignStyle = depth === 0 ? blockAlignStyle(block.align) : undefined;

  function handleClick(event: MouseEvent) {
    // Evita que al pinchar un hijo se seleccione también su contenedor.
    event.stopPropagation();
    onSelect(block.id, patternId);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (draggingId === block.id) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    onDragOver({ id: block.id, parentId, index, position });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (draggingId === block.id) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    onDrop({ id: block.id, parentId, index, position });
  }

  if (block.type === 'pattern') {
    const pattern = block.patternId ? patterns[block.patternId] : undefined;
    return (
      <div
        onClick={handleClick}
        style={alignStyle}
        className={`${ringClass} ${isHidden ? hiddenOverlayClass : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDropTarget && dropTarget?.position === 'before' && (
          <div className="absolute left-0 right-0 top-0 z-10 h-0.5 bg-slate-900" />
        )}
        <BlockTools
          visible={isSelected}
          onEdit={() => onEdit(block.id, patternId)}
          onRemove={() => onRemove(block.id)}
          onMoveDragStart={() => onDragStart(block.id)}
          onMoveDragEnd={onDragEnd}
          onQuickAdd={(type) => onQuickAdd(type, { parentId, index: index + 1, patternId })}
          onOpenBlocksPanel={onOpenBlocksPanel}
        />
        <div className="mb-2 inline-flex bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
          Component sincronizado: {pattern?.label ?? 'no encontrado'}
        </div>
        {pattern ? (
          <div className="space-y-6">
            {pattern.blocks.map((child) => (
              <BlockPreviewer
                key={child.id}
                block={child}
                depth={0}
                parentId={null}
                index={pattern.blocks.indexOf(child)}
                selectedId={selectedId}
                selectedPatternId={selectedPatternId}
                media={media}
                patterns={patterns}
                patternId={block.patternId}
                styleDevice={styleDevice}
                styleState={styleState}
                onSelect={onSelect}
                onEdit={onEdit}
                onRemove={onRemove}
                draggingId={draggingId}
                dropTarget={dropTarget}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                onQuickAdd={onQuickAdd}
                onOpenBlocksPanel={onOpenBlocksPanel}
                onTextChange={onTextChange}
              />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-slate-300 p-3 text-sm text-slate-400">
            Component no encontrado
          </p>
        )}
      </div>
    );
  }

  if (isContainer(block.type)) {
    const children = block.children ?? [];
    const style: CSSProperties = {
      ...alignStyle,
      ...containerLayoutStyle(block),
      ...getBlockDefaultStyle(block.type),
      ...(resolveBlockStyle(block, styleDevice, styleState) as CSSProperties),
    };
    return (
      <div
        onClick={handleClick}
        style={style}
        className={`${ringClass} ${isHidden ? hiddenOverlayClass : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDropTarget && dropTarget?.position === 'before' && (
          <div className="absolute left-0 right-0 top-0 z-10 h-0.5 bg-slate-900" />
        )}
        <BlockTools
          visible={isSelected}
          onEdit={() => onEdit(block.id, patternId)}
          onRemove={() => onRemove(block.id)}
          onMoveDragStart={() => onDragStart(block.id)}
          onMoveDragEnd={onDragEnd}
          onQuickAdd={(type) => onQuickAdd(type, { parentId, index: index + 1, patternId })}
          onOpenBlocksPanel={onOpenBlocksPanel}
        />
        {children.length === 0 ? (
          <p className="w-full px-2 py-4 text-center text-xs italic text-slate-400">
            ({getBlockLabel(block.type)} vacío — añade bloques dentro desde el inspector)
          </p>
        ) : (
          children.map((child) => (
            <BlockPreviewer
              key={child.id}
              block={child}
              depth={depth + 1}
              parentId={block.id}
              index={children.indexOf(child)}
              selectedId={selectedId}
              selectedPatternId={selectedPatternId}
              media={media}
              patterns={patterns}
              patternId={patternId}
              styleDevice={styleDevice}
              styleState={styleState}
              onSelect={onSelect}
              onEdit={onEdit}
              onRemove={onRemove}
              draggingId={draggingId}
              dropTarget={dropTarget}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onQuickAdd={onQuickAdd}
              onOpenBlocksPanel={onOpenBlocksPanel}
              onTextChange={onTextChange}
            />
          ))
        )}
        {isDropTarget && dropTarget?.position === 'after' && (
          <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-slate-900" />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={alignStyle}
      className={`${ringClass} ${isHidden ? hiddenOverlayClass : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDropTarget && dropTarget?.position === 'before' && (
        <div className="absolute left-0 right-0 top-0 z-10 h-0.5 bg-slate-900" />
      )}
      <BlockTools
        visible={isSelected}
        onEdit={() => onEdit(block.id, patternId)}
        onRemove={() => onRemove(block.id)}
        onMoveDragStart={() => onDragStart(block.id)}
        onMoveDragEnd={onDragEnd}
        onQuickAdd={(type) => onQuickAdd(type, { parentId, index: index + 1, patternId })}
        onOpenBlocksPanel={onOpenBlocksPanel}
      />
      {isEditableTextBlock(block) ? (
        <EditableTextBlock
          block={block}
          styleDevice={styleDevice}
          styleState={styleState}
          onFocus={() => onSelect(block.id, patternId)}
          onChange={(text) => onTextChange(block.id, text, patternId)}
        />
      ) : isEmptyLeaf(block) ? (
        <p className="text-sm italic text-slate-400">({getBlockLabel(block.type)} vacio)</p>
      ) : (
        <BlockView
          block={block}
          media={media}
          patterns={patterns}
          styleDevice={styleDevice}
          styleState={styleState}
          showHidden
        />
      )}
      {isDropTarget && dropTarget?.position === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-slate-900" />
      )}
    </div>
  );
}

function isEditableTextBlock(block: Block) {
  return block.type === 'heading' || block.type === 'paragraph' || block.type === 'quote' || block.type === 'list';
}

function EditableTextBlock({
  block,
  styleDevice,
  styleState,
  onFocus,
  onChange,
}: {
  block: Block;
  styleDevice: StyleDevice;
  styleState: StyleState;
  onFocus: () => void;
  onChange: (text: string) => void;
}) {
  const ref = useRef<any>(null);
  const renderedBlock = renderRegisteredBlock({ block, styleDevice, styleState, showHidden: true });

  useLayoutEffect(() => {
    if (!ref.current || document.activeElement === ref.current) return;
    if (normalizeEditableText(ref.current.innerText) !== block.text) {
      ref.current.innerText = block.text;
    }
  }, [block.id, block.text]);

  function handleInput(event: FormEvent<HTMLElement>) {
    onChange(normalizeEditableText(event.currentTarget.innerText));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    event.stopPropagation();
    if (block.type === 'heading' && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  const editableProps = {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus,
    onBlur: handleInput,
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    role: 'textbox',
    'aria-label': `Editar ${getBlockLabel(block.type)}`,
  };

  if (!isValidElement(renderedBlock)) {
    return <p {...editableProps} className={editableClassName()} />;
  }

  const renderedProps = renderedBlock.props as { className?: string };
  return cloneElement(
    renderedBlock as ReactElement<{
      className?: string;
      contentEditable?: boolean;
      suppressContentEditableWarning?: boolean;
      onFocus?: () => void;
      onBlur?: (event: FormEvent<HTMLElement>) => void;
      onInput?: (event: FormEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
      role?: string;
      'aria-label'?: string;
    }>,
    {
      ...editableProps,
      className: [renderedProps.className, editableClassName()].filter(Boolean).join(' '),
    },
    undefined
  );
}

function editableClassName() {
  return 'min-h-[1.5em] cursor-text outline-none';
}

function normalizeEditableText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/\n+$/g, '');
}
