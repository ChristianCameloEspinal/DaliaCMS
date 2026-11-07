import {
  getAddableBlockTypes,
  getBlockLabel,
  getBlockTypes,
  isRegisteredContainer,
} from './blocks/block-registry';

// Modelo de bloques del editor. El core trae tipos nativos, pero `BlockType`
// queda abierto a tipos registrados por modulos/plugins mediante el registry.
export type CoreBlockType =
  | 'heading'
  | 'paragraph'
  | 'quote'
  | 'list'
  | 'image'
  | 'content'
  | 'pattern'
  | 'group'
  | 'columns'
  | 'column';

export type BlockType = CoreBlockType | (string & {});

export const CORE_BLOCK_TYPES: CoreBlockType[] = [
  'heading',
  'paragraph',
  'quote',
  'list',
  'image',
  'content',
  'pattern',
  'group',
  'columns',
  'column',
];

// Constantes de compatibilidad para imports existentes. La UI nueva usa las
// funciones del registry para que los tipos registrados despues sean visibles.
export const BLOCK_TYPES: BlockType[] = getBlockTypes();
export const CONTAINER_TYPES: BlockType[] = CORE_BLOCK_TYPES.filter((type) =>
  isRegisteredContainer(type)
);
export const ADDABLE_TYPES: BlockType[] = getAddableBlockTypes();
export const BLOCK_LABELS: Record<string, string> = Object.fromEntries(
  getBlockTypes().map((type) => [type, getBlockLabel(type)])
);

export function isContainer(type: BlockType): boolean {
  return isRegisteredContainer(type);
}

// Estilos del bloque: pares clave/valor donde la clave es una propiedad CSS en
// notacion camelCase y el valor es un string CSS.
export type BlockStyle = Record<string, string>;

export type StyleDevice = 'desktop' | 'tablet' | 'mobile';
export type StyleState = 'default' | 'hover' | 'active';

export type BlockStyleVariants = Partial<
  Record<StyleDevice, Partial<Record<StyleState, BlockStyle>>>
>;

// Alineacion/ancho del bloque, como en WP: sin valor = ancho de contenido;
// 'wide' = ancho amplio; 'full' = ancho completo.
export type BlockAlign = 'wide' | 'full';

// Orientacion de un contenedor "group" (los "columns" son siempre horizontales).
export type LayoutDirection = 'row' | 'column';

export interface BlockLayout {
  direction?: LayoutDirection;
  gap?: string;
  justify?: string;
  align?: string;
  wrap?: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  text: string;
  ariaLabel?: string;
  title?: string;
  // Imagen: `mediaId` es el puntero a la biblioteca; `url` queda como legacy.
  url?: string;
  mediaId?: string;
  // Patron sincronizado: referencia al objeto compartido Pattern.
  patternId?: string;
  style?: BlockStyle;
  styleVariants?: BlockStyleVariants;
  align?: BlockAlign;
  // Visibilidad en dispositivos
  visibility?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  }
  // Contenedores (group/columns/column): disposicion flex y bloques hijos.
  layout?: BlockLayout;
  children?: Block[];
}

export interface BlockDocument {
  version: 1;
  blocks: Block[];
}

export interface PatternBlockMap {
  [id: string]: {
    label: string;
    blocks: Block[];
  };
}
