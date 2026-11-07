import * as Icon from '@/components/ui/icons';
import { isContainer, type BlockType } from '@/components/editor/editor.types';

// Adaptador del dominio editor: convierte un BlockType en un icono UI puro.
export function BlockTypeIcon({ type, className }: { type: BlockType; className?: string }) {
  if (type === 'columns') return <Icon.ColumnsIcon className={className} />;
  if (isContainer(type)) return <Icon.GroupIcon className={className} />;
  if (type === 'image') return <Icon.ImageIcon className={className} />;
  if (type === 'pattern') return <Icon.PatternIcon className={className} />;
  if (type === 'heading') return <Icon.HeadingIcon className={className} />;
  if (type === 'paragraph') return <Icon.ParagraphIcon className={className} />;
  if (type === 'quote') return <Icon.QuoteIcon className={className} />;
  if (type === 'list') return <Icon.ListIcon className={className} />;

  return <Icon.TextIcon className={className} />;
}