import type { BlockType } from '@/components/editor/editor.types';
import {
  getAddableBlockDefinitions,
  getBlockLabel,
  type BlockCategory,
} from '@/components/editor/blocks/block-registry';
import { BlockTypeIcon } from '../editor-icons';
import { Button } from '@/components/ui/button';

// Inserter de bloques agrupado por categorías (Texto / Layout / Media), como el
// inserter de Gutenberg.
export function BlockInserter({
  onAdd,
  filterText = '',
}: {
  onAdd: (type: BlockType) => void;
  filterText?: string;
}) {
  const query = filterText.trim().toLowerCase();
  const addableBlocks = getAddableBlockDefinitions();
  const matches = (type: BlockType) =>
    query.length === 0 || getBlockLabel(type).toLowerCase().includes(query);
  const textBlocks = addableBlocks
    .filter((block) => block.category === 'text' && matches(block.type))
    .map((block) => block.type);
  const layoutBlocks = addableBlocks
    .filter((block) => block.category === 'layout' && matches(block.type))
    .map((block) => block.type);
  const mediaBlocks = addableBlocks
    .filter((block) => block.category === 'media' && matches(block.type))
    .map((block) => block.type);
  const specialBlocks = addableBlocks
    .filter((block) => block.category === 'special' && matches(block.type))
    .map((block) => block.type);
  const customBlocks = addableBlocks
    .filter(
      (block) =>
        !(['text', 'layout', 'media', 'special'] as BlockCategory[]).includes(block.category) &&
        matches(block.type)
    )
    .map((block) => block.type);

  return (
    <div className="space-y-8 p-4">
      {query && (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Filtrando por "{filterText.trim()}"
        </p>
      )}
      <InserterGroup label="Texto" types={textBlocks} onAdd={onAdd} />
      <InserterGroup label="Layout" types={layoutBlocks} onAdd={onAdd} />
      <InserterGroup label="Media" types={mediaBlocks} onAdd={onAdd} />
      <InserterGroup label="Especiales" types={specialBlocks} onAdd={onAdd} />
      <InserterGroup label="Otros" types={customBlocks} onAdd={onAdd} />
    </div>
  );
}

function InserterGroup({
  label,
  types,
  onAdd,
}: {
  label: string;
  types: BlockType[];
  onAdd: (type: BlockType) => void;
}) {
  if (types.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</h3>
      <div className="grid grid-cols-3 gap-2">
        {types.map((type) => (
          <Button
            key={type}
            variant='ghost'
            type="button"
            aria-label={getBlockLabel(type)}
            onClick={() => onAdd(type)}
            className="!grid grid-rows-2 min-h-16 justify-items-center gap-1 rounded-md bg-white p-1 text-center text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <BlockTypeIcon type={type} className="h-5 w-5" />
            <span>{getBlockLabel(type)}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}
