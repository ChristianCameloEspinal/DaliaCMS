import {
  Fragment,
  cloneElement,
  createElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { MediaMap } from '@/media/media.types';
import type { Block, BlockStyle, BlockType, PatternBlockMap, StyleDevice, StyleState } from '../editor.types';
import { resolveBlockStyle } from '../style-variants';
import { blockStyleClassName } from '../../../../(frontend)/helpers/block-style-css';

export type BlockCategory = 'text' | 'layout' | 'media' | 'special' | 'interactive' | 'marketing';

export interface BlockRenderProps {
  block: Block;
  media?: MediaMap;
  patterns?: PatternBlockMap;
  renderBlock: (block: Block) => ReactNode;
}

export interface BlockInspectorDefinition {
  content: 'container' | 'image' | 'text' | 'none';
  textLabel?: string;
  textRows?: number;
  typography?: boolean;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: BlockCategory;
  isContainer?: boolean;
  isAddable?: boolean;
  create?: () => Block;
  normalize?: (block: Block) => Partial<Block>;
  render?: (props: BlockRenderProps) => ReactNode;
  collectMediaIds?: (block: Block) => string[];
  collectPatternIds?: (block: Block) => string[];
  inspector?: BlockInspectorDefinition;
}

const registry = new Map<BlockType, BlockDefinition>();

function createBaseBlock(type: BlockType): Block {
  return { id: crypto.randomUUID(), type, text: '' };
}

// Defaults are resolved at render time so global variables update existing blocks.
export function getBlockDefaultStyle(type: BlockType): BlockStyle {
  switch (type) {
    case 'heading':
      return { fontFamily: 'var(--dalia-font-heading)', fontSize: 'var(--dalia-font-size-heading)' };
    case 'paragraph':
    case 'list':
      return { fontSize: 'var(--dalia-font-size-body)' };
    case 'quote':
      return { fontSize: 'var(--dalia-font-size-body)', borderColor: 'var(--dalia-color-border)' };
    case 'subheading':
      return { color: 'var(--dalia-color-muted)', fontSize: 'calc(var(--dalia-font-size-body) + 0.125rem)' };
    case 'eyebrow':
      return { color: 'var(--dalia-color-muted)' };
    case 'button':
      return {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--dalia-color-on-primary)',
        borderRadius: 'var(--dalia-radius-control)',
        fontSize: 'var(--dalia-font-size-body)',
      };
    case 'image':
      return { borderRadius: 'var(--dalia-radius-control)' };
    case 'divider':
      return { marginTop: '24px', marginBottom: '24px', borderColor: 'var(--dalia-color-border)' };
    case 'spacer':
      return { height: '32px' };
    case 'section':
      return {
        paddingTop: '64px', paddingBottom: '64px',
        paddingLeft: 'var(--dalia-page-gutter)', paddingRight: 'var(--dalia-page-gutter)',
      };
    case 'container':
      return { maxWidth: 'var(--dalia-wide-size)', marginLeft: 'auto', marginRight: 'auto', width: '100%' };
    case 'card':
      return {
        padding: '24px', borderWidth: '1px', borderStyle: 'solid',
        borderColor: 'var(--dalia-color-border)', borderRadius: 'var(--dalia-radius-card)',
        backgroundColor: 'var(--dalia-color-surface)',
      };
    case 'hero':
      return {
        minHeight: '520px', padding: '64px', textAlign: 'center',
        backgroundColor: 'var(--dalia-color-surface)', borderRadius: 'var(--dalia-radius-card)',
      };
    case 'badge':
      return {
        backgroundColor: 'var(--dalia-color-surface)', color: 'var(--dalia-color-muted)',
        borderRadius: '999px', paddingTop: '4px', paddingRight: '10px',
        paddingBottom: '4px', paddingLeft: '10px',
      };
    case 'testimonial':
      return { padding: '24px', borderRadius: 'var(--dalia-radius-card)', backgroundColor: 'var(--dalia-color-surface)' };
    case 'accordion':
      return { borderColor: 'var(--dalia-color-border)', borderRadius: 'var(--dalia-radius-control)' };
    default:
      return {};
  }
}

export function registerBlockType(definition: BlockDefinition): void {
  registry.set(definition.type, definition);
}

export function unregisterBlockType(type: BlockType): void {
  registry.delete(type);
}

export function getBlockDefinition(type: BlockType): BlockDefinition | undefined {
  return registry.get(type);
}

export function getBlockDefinitions(): BlockDefinition[] {
  return Array.from(registry.values());
}

export function getBlockTypes(): BlockType[] {
  return getBlockDefinitions().map((definition) => definition.type);
}

export function getAddableBlockDefinitions(): BlockDefinition[] {
  return getBlockDefinitions().filter((definition) => definition.isAddable);
}

export function getAddableBlockTypes(): BlockType[] {
  return getAddableBlockDefinitions().map((definition) => definition.type);
}

export function getBlockLabel(type: BlockType): string {
  return registry.get(type)?.label ?? type;
}

export function getBlockInspectorDefinition(type: BlockType): BlockInspectorDefinition {
  return registry.get(type)?.inspector ?? { content: 'text', textRows: 6, typography: false };
}

export function isRegisteredBlockType(type: string): type is BlockType {
  return registry.has(type);
}

export function isRegisteredContainer(type: BlockType): boolean {
  return registry.get(type)?.isContainer === true;
}

export function createRegisteredBlock(type: BlockType): Block {
  const definition = registry.get(type);
  if (!definition) {
    throw new Error(`Tipo de bloque no registrado: ${type}`);
  }
  return definition.create ? definition.create() : createBaseBlock(type);
}

export function normalizeRegisteredBlockFields(block: Block): Partial<Block> {
  return registry.get(block.type)?.normalize?.(block) ?? {};
}

export function collectRegisteredMediaIds(block: Block): string[] {
  return registry.get(block.type)?.collectMediaIds?.(block) ?? [];
}

export function collectRegisteredPatternIds(block: Block): string[] {
  return registry.get(block.type)?.collectPatternIds?.(block) ?? [];
}

export function containerLayoutStyle(block: Block): CSSProperties {
  const layout = block.layout ?? {};
  if (block.type === 'columns') {
    return {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: layout.wrap ? 'wrap' : 'nowrap',
      gap: layout.gap ?? '24px',
      alignItems: layout.align ?? 'stretch',
      justifyContent: layout.justify,
    };
  }
  if (block.type === 'column') {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: layout.gap ?? '16px',
      flex: '1 1 0%',
      minWidth: 0,
    };
  }
  return {
    display: 'flex',
    flexDirection: layout.direction === 'row' ? 'row' : 'column',
    flexWrap: layout.wrap ? 'wrap' : undefined,
    gap: layout.gap ?? '16px',
    alignItems: layout.align,
    justifyContent: layout.justify,
  };
}

export function renderRegisteredBlock({
  block,
  media,
  patterns,
  styleDevice = 'desktop',
  styleState = 'default',
  showHidden = false,
}: {
  block: Block;
  media?: MediaMap;
  patterns?: PatternBlockMap;
  styleDevice?: StyleDevice;
  styleState?: StyleState;
  showHidden?: boolean;
}): ReactNode {
  if (!showHidden && block.visibility?.[styleDevice] === false) return null;

  const definition = registry.get(block.type);
  const effectiveBlock = {
    ...block,
    style: { ...getBlockDefaultStyle(block.type), ...resolveBlockStyle(block, styleDevice, styleState) },
  };
  const renderBlock = (child: Block) =>
    renderRegisteredBlock({ block: child, media, patterns, styleDevice, styleState, showHidden });
  const rendered = definition?.render
    ? definition.render({ block: effectiveBlock, media, patterns, renderBlock })
    : createElement('p', { style: effectiveBlock.style as CSSProperties | undefined }, block.text);
  return attachBlockProps(rendered, block);
}

function attachBlockProps(node: ReactNode, block: Block): ReactNode {
  if (!isValidElement(node)) return node;

  const props = node.props as { className?: string };
  const className = [props.className, blockStyleClassName(block.id)].filter(Boolean).join(' ');
  return cloneElement(
    node as ReactElement<{
      'aria-label'?: string;
      className?: string;
      title?: string;
    }>,
    {
      ...(block.ariaLabel ? { 'aria-label': block.ariaLabel } : {}),
      ...(block.title ? { title: block.title } : {}),
      className,
    }
  );
}

registerBlockType({
  type: 'heading',
  label: 'Encabezado',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del encabezado',
    typography: true,
  },
  render: ({ block }) =>
    createElement(
      'h2',
      {
        style: block.style as CSSProperties | undefined,
        className: 'mt-6 font-bold',
      },
      block.text
    ),
});

registerBlockType({
  type: 'paragraph',
  label: 'P\u00e1rrafo',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del p\u00e1rrafo',
    textRows: 6,
    typography: true,
  },
  render: ({ block }) =>
    createElement(
      'p',
      {
        style: block.style as CSSProperties | undefined,
        className: 'whitespace-pre-wrap leading-relaxed',
      },
      block.text
    ),
});

registerBlockType({
  type: 'quote',
  label: 'Cita',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto de la cita',
    textRows: 3,
    typography: true,
  },
  render: ({ block }) =>
    createElement(
      'blockquote',
      {
        style: block.style as CSSProperties | undefined,
        className: 'border-l-4 pl-4 italic opacity-80',
      },
      block.text
    ),
});

registerBlockType({
  type: 'list',
  label: 'Lista',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Elementos de la lista',
    textRows: 6,
    typography: true,
  },
  render: ({ block }) => {
    const items = block.text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    return createElement(
      'ul',
      {
        style: block.style as CSSProperties | undefined,
        className: 'list-disc space-y-1 pl-6 leading-relaxed',
      },
      items.map((item, index) => createElement('li', { key: index }, item))
    );
  },
});

registerBlockType({
  type: 'image',
  label: 'Imagen',
  category: 'media',
  isAddable: true,
  inspector: { content: 'image' },
  create: () => ({ ...createBaseBlock('image'), url: '' }),
  normalize: (block) => ({
    url: typeof block.url === 'string' ? block.url : '',
    ...(typeof block.mediaId === 'string' && block.mediaId ? { mediaId: block.mediaId } : {}),
  }),
  collectMediaIds: (block) => (block.mediaId ? [block.mediaId] : []),
  render: ({ block, media }) => {
    const ref = block.mediaId ? media?.[block.mediaId] : undefined;
    const src = ref?.url ?? block.url;
    const alt = block.text || ref?.alt || '';
    return src
      ? createElement('img', {
        src,
        alt,
        style: block.style as CSSProperties | undefined,
        className: 'h-auto w-full',
      })
      : null;
  },
});

registerBlockType({
  type: 'pattern',
  label: 'Component',
  category: 'special',
  inspector: { content: 'none' },
  create: () => ({ ...createBaseBlock('pattern'), patternId: '' }),
  normalize: (block) =>
    typeof block.patternId === 'string' ? { patternId: block.patternId } : {},
  collectPatternIds: (block) => (block.patternId ? [block.patternId] : []),
  render: ({ block, patterns, renderBlock }) => {
    const pattern = block.patternId ? patterns?.[block.patternId] : undefined;
    return pattern
      ? createElement(
        'div',
        { style: block.style as CSSProperties | undefined, 'data-pattern-id': block.patternId },
        pattern.blocks.map((child) => createElement(Fragment, { key: child.id }, renderBlock(child)))
      )
      : createElement(
        'p',
        {
          className:
            'rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-400',
        },
        'Component no encontrado'
      );
  },
});

registerBlockType({
  type: 'group',
  label: 'Grupo',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: { content: 'container' },
  create: () => ({
    ...createBaseBlock('group'),
    layout: { direction: 'column', gap: '16px' },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      { style: { ...containerLayoutStyle(block), ...(block.style as CSSProperties) } },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'column',
  label: 'Columna',
  category: 'layout',
  isContainer: true,
  inspector: { content: 'container' },
  create: () => ({
    ...createBaseBlock('column'),
    layout: { gap: '16px' },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      { style: { ...containerLayoutStyle(block), ...(block.style as CSSProperties) } },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'columns',
  label: 'Columnas',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: { content: 'container' },
  create: () => ({
    ...createBaseBlock('columns'),
    layout: { gap: '24px' },
    children: [createRegisteredBlock('column'), createRegisteredBlock('column')],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      { style: { ...containerLayoutStyle(block), ...(block.style as CSSProperties) } },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'subheading',
  label: 'Subtítulo',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del subtítulo',
    textRows: 3,
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('subheading'),
    text: 'Subtítulo de sección',
  }),
  render: ({ block }) =>
    createElement(
      'p',
      {
        style: block.style as CSSProperties | undefined,
        className: 'leading-relaxed',
      },
      block.text
    ),
});

registerBlockType({
  type: 'eyebrow',
  label: 'Etiqueta superior',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto de la etiqueta',
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('eyebrow'),
    text: 'Etiqueta',
  }),
  render: ({ block }) =>
    createElement(
      'p',
      {
        style: block.style as CSSProperties | undefined,
        className: 'text-xs font-semibold uppercase tracking-widest',
      },
      block.text
    ),
});

registerBlockType({
  type: 'button',
  label: 'Botón',
  category: 'interactive',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del botón',
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('button'),
    text: 'Botón',
    url: '#',
  }),
  normalize: (block) => ({
    url: typeof block.url === 'string' ? block.url : '#',
  }),
  render: ({ block }) =>
    createElement(
      'a',
      {
        href: block.url || '#',
        style: block.style as CSSProperties | undefined,
        className:
          'inline-flex items-center justify-center px-4 py-2 font-medium transition hover:opacity-90',
      },
      block.text
    ),
});

registerBlockType({
  type: 'divider',
  label: 'Separador',
  category: 'layout',
  isAddable: true,
  inspector: {
    content: 'none',
  },
  create: () => createBaseBlock('divider'),
  render: ({ block }) =>
    createElement('hr', {
      style: block.style as CSSProperties | undefined,
      className: 'border-t',
    }),
});

registerBlockType({
  type: 'spacer',
  label: 'Espaciador',
  category: 'layout',
  isAddable: true,
  inspector: {
    content: 'none',
  },
  create: () => createBaseBlock('spacer'),
  render: ({ block }) =>
    createElement('div', {
      style: block.style as CSSProperties | undefined,
      'aria-hidden': true,
    }),
});

registerBlockType({
  type: 'section',
  label: 'Sección',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: {
    content: 'container',
  },
  create: () => ({
    ...createBaseBlock('section'),
    layout: { direction: 'column', gap: '24px' },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'section',
      {
        style: {
          ...containerLayoutStyle(block),
          ...(block.style as CSSProperties),
        },
      },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'container',
  label: 'Contenedor',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: {
    content: 'container',
  },
  create: () => ({
    ...createBaseBlock('container'),
    layout: { direction: 'column', gap: '16px' },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      {
        style: {
          ...containerLayoutStyle(block),
          ...(block.style as CSSProperties),
        },
      },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'card',
  label: 'Tarjeta',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: {
    content: 'container',
  },
  create: () => ({
    ...createBaseBlock('card'),
    layout: { direction: 'column', gap: '12px' },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      {
        style: {
          ...containerLayoutStyle(block),
          ...(block.style as CSSProperties),
        },
      },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'hero',
  label: 'Hero',
  category: 'layout',
  isContainer: true,
  isAddable: true,
  inspector: {
    content: 'container',
  },
  create: () => ({
    ...createBaseBlock('hero'),
    layout: { direction: 'column', gap: '24px', align: 'center', justify: 'center' },
    children: [
      {
        ...createRegisteredBlock('eyebrow'),
        text: 'Nueva sección',
      },
      {
        ...createRegisteredBlock('heading'),
        text: 'Título principal de la página',
      },
      {
        ...createRegisteredBlock('paragraph'),
        text: 'Texto descriptivo para explicar la propuesta de valor de esta sección.',
      },
      {
        ...createRegisteredBlock('button'),
        text: 'Llamada a la acción',
        url: '#',
      },
    ],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'section',
      {
        style: {
          ...containerLayoutStyle(block),
          ...(block.style as CSSProperties),
        },
      },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});

registerBlockType({
  type: 'video',
  label: 'Video',
  category: 'media',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'URL del video',
  },
  create: () => ({
    ...createBaseBlock('video'),
    text: '',
  }),
  render: ({ block }) => {
    const src = block.text?.trim();

    return src
      ? createElement(
        'div',
        {
          style: block.style as CSSProperties | undefined,
          className: 'aspect-video overflow-hidden rounded-md bg-slate-100',
        },
        createElement('iframe', {
          src,
          className: 'h-full w-full',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowFullScreen: true,
        })
      )
      : createElement(
        'div',
        {
          className:
            'rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400',
        },
        'Video sin URL'
      );
  },
});

registerBlockType({
  type: 'html',
  label: 'HTML',
  category: 'special',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Código HTML',
    textRows: 8,
  },
  create: () => ({
    ...createBaseBlock('html'),
    text: '<div>HTML personalizado</div>',
  }),
  render: ({ block }) =>
    createElement('div', {
      style: block.style as CSSProperties | undefined,
      dangerouslySetInnerHTML: { __html: block.text },
    }),
});

registerBlockType({
  type: 'code',
  label: 'Código',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Código',
    textRows: 8,
  },
  create: () => ({
    ...createBaseBlock('code'),
    text: 'const value = true;',
  }),
  render: ({ block }) =>
    createElement(
      'pre',
      {
        style: block.style as CSSProperties | undefined,
        className:
          'overflow-auto rounded-md bg-slate-950 p-4 text-sm leading-relaxed text-slate-100',
      },
      createElement('code', null, block.text)
    ),
});

registerBlockType({
  type: 'badge',
  label: 'Badge',
  category: 'text',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del badge',
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('badge'),
    text: 'Badge',
  }),
  render: ({ block }) =>
    createElement(
      'span',
      {
        style: block.style as CSSProperties | undefined,
        className: 'inline-flex w-fit items-center text-xs font-medium',
      },
      block.text
    ),
});

registerBlockType({
  type: 'stat',
  label: 'Dato destacado',
  category: 'marketing',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Dato',
    textRows: 3,
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('stat'),
    text: '120+\nClientes',
  }),
  render: ({ block }) => {
    const [value = '', label = ''] = block.text.split('\n');

    return createElement(
      'div',
      {
        style: block.style as CSSProperties | undefined,
        className: 'space-y-1',
      },
      createElement('div', { className: 'font-bold', style: { fontSize: 'var(--dalia-font-size-heading)' } }, value),
      createElement('div', { className: 'text-sm', style: { color: 'var(--dalia-color-muted)' } }, label)
    );
  },
});

registerBlockType({
  type: 'testimonial',
  label: 'Testimonio',
  category: 'marketing',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Texto del testimonio',
    textRows: 5,
    typography: true,
  },
  create: () => ({
    ...createBaseBlock('testimonial'),
    text: '“Texto del testimonio.”\nNombre del cliente',
  }),
  render: ({ block }) => {
    const [quote = '', author = ''] = block.text.split('\n');

    return createElement(
      'figure',
      {
        style: block.style as CSSProperties | undefined,
        className: 'space-y-3',
      },
      createElement('blockquote', { className: 'leading-relaxed' }, quote),
      author
        ? createElement('figcaption', { className: 'text-sm font-medium', style: { color: 'var(--dalia-color-muted)' } }, author)
        : null
    );
  },
});

registerBlockType({
  type: 'accordion',
  label: 'Acordeón',
  category: 'interactive',
  isAddable: true,
  inspector: {
    content: 'text',
    textLabel: 'Preguntas y respuestas',
    textRows: 8,
  },
  create: () => ({
    ...createBaseBlock('accordion'),
    text: 'Pregunta 1\nRespuesta 1\n\nPregunta 2\nRespuesta 2',
  }),
  render: ({ block }) => {
    const groups = block.text
      .split('\n\n')
      .map((item) => item.split('\n'))
      .filter((item) => item.length > 0);

    return createElement(
      'div',
      {
        style: block.style as CSSProperties | undefined,
        className: 'divide-y border',
      },
      groups.map(([question = '', answer = ''], index) =>
        createElement(
          'details',
          { key: index, className: 'group p-4' },
          createElement(
            'summary',
            { className: 'cursor-pointer font-semibold' },
            question
          ),
          createElement('p', { className: 'mt-2 leading-relaxed', style: { color: 'var(--dalia-color-muted)' } }, answer)
        )
      )
    );
  },
});

registerBlockType({
  type: 'gallery',
  label: 'Galería',
  category: 'media',
  isAddable: true,
  inspector: {
    content: 'container',
  },
  create: () => ({
    ...createBaseBlock('gallery'),
    layout: { direction: 'row', gap: '12px', wrap: true },
    children: [],
  }),
  render: ({ block, renderBlock }) =>
    createElement(
      'div',
      {
        style: {
          ...containerLayoutStyle(block),
          ...(block.style as CSSProperties),
        },
        className: 'grid grid-cols-2 gap-3 md:grid-cols-3',
      },
      (block.children ?? []).map((child) =>
        createElement(Fragment, { key: child.id }, renderBlock(child))
      )
    ),
});
