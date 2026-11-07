import type {
  Block,
  BlockStyle,
  PatternBlockMap,
  StyleDevice,
  StyleState,
} from '@/components/editor/editor.types';

const DEVICE_MEDIA: Partial<Record<StyleDevice, string>> = {
  tablet: '@media (max-width: 900px)',
  mobile: '@media (max-width: 480px)',
};

const DEVICE_VISIBILITY_MEDIA: Record<StyleDevice, string> = {
  desktop: '@media (min-width: 901px)',
  tablet: '@media (min-width: 481px) and (max-width: 900px)',
  mobile: '@media (max-width: 480px)',
};

const STATE_SELECTOR: Record<Exclude<StyleState, 'default'>, string> = {
  hover: ':hover',
  active: ':active',
};

const INTERACTION_TRANSITION =
  'transition-property:color,background-color,border-color,box-shadow,opacity,transform;' +
  'transition-duration:180ms;' +
  'transition-timing-function:ease;';

export function blockStyleClassName(blockId: string): string {
  return `dalia-block-${sanitizeClassToken(blockId)}`;
}

export function blockVisibilityClassName(blockId: string): string {
  return `dalia-block-visibility-${sanitizeClassToken(blockId)}`;
}

export function generateBlockVariantCss(
  blocks: Block[],
  patterns?: PatternBlockMap
): string {
  const desktopRules: string[] = [];
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];
  const desktopVisibilityRules: string[] = [];
  const tabletVisibilityRules: string[] = [];
  const mobileVisibilityRules: string[] = [];

  for (const block of collectBlocks(blocks, patterns)) {
    const className = `.${blockStyleClassName(block.id)}`;
    const visibilitySelector = `${className},.${blockVisibilityClassName(block.id)}`;
    const variants = block.styleVariants;

    if (block.visibility?.desktop === false) {
      desktopVisibilityRules.push(`${visibilitySelector}{display:none!important;}`);
    }
    if (block.visibility?.tablet === false) {
      tabletVisibilityRules.push(`${visibilitySelector}{display:none!important;}`);
    }
    if (block.visibility?.mobile === false) {
      mobileVisibilityRules.push(`${visibilitySelector}{display:none!important;}`);
    }

    if (!variants) continue;

    if (hasInteractiveVariants(block)) {
      desktopRules.push(`${className}{${INTERACTION_TRANSITION}}`);
    }

    const desktopHover = styleRule(`${className}${STATE_SELECTOR.hover}`, variants.desktop?.hover);
    const desktopActive = styleRule(`${className}${STATE_SELECTOR.active}`, variants.desktop?.active);
    if (desktopHover) desktopRules.push(desktopHover);
    if (desktopActive) desktopRules.push(desktopActive);

    const tabletDefault = styleRule(className, variants.tablet?.default);
    const tabletHover = styleRule(`${className}${STATE_SELECTOR.hover}`, variants.tablet?.hover);
    const tabletActive = styleRule(`${className}${STATE_SELECTOR.active}`, variants.tablet?.active);
    if (tabletDefault) tabletRules.push(tabletDefault);
    if (tabletHover) tabletRules.push(tabletHover);
    if (tabletActive) tabletRules.push(tabletActive);

    const mobileDefault = styleRule(className, variants.mobile?.default);
    const mobileHover = styleRule(`${className}${STATE_SELECTOR.hover}`, variants.mobile?.hover);
    const mobileActive = styleRule(`${className}${STATE_SELECTOR.active}`, variants.mobile?.active);
    if (mobileDefault) mobileRules.push(mobileDefault);
    if (mobileHover) mobileRules.push(mobileHover);
    if (mobileActive) mobileRules.push(mobileActive);
  }

  return [
    desktopRules.join('\n'),
    mediaBlock(DEVICE_VISIBILITY_MEDIA.desktop, desktopVisibilityRules),
    mediaBlock(DEVICE_MEDIA.tablet, tabletRules),
    mediaBlock(DEVICE_VISIBILITY_MEDIA.tablet, tabletVisibilityRules),
    mediaBlock(DEVICE_MEDIA.mobile, mobileRules),
    mediaBlock(DEVICE_VISIBILITY_MEDIA.mobile, mobileVisibilityRules),
  ]
    .filter(Boolean)
    .join('\n');
}

function hasInteractiveVariants(block: Block): boolean {
  const variants = block.styleVariants;
  if (!variants) return false;

  return Boolean(
    variants.desktop?.hover ||
      variants.desktop?.active ||
      variants.tablet?.hover ||
      variants.tablet?.active ||
      variants.mobile?.hover ||
      variants.mobile?.active
  );
}

function collectBlocks(blocks: Block[], patterns?: PatternBlockMap): Block[] {
  const collected: Block[] = [];

  for (const block of blocks) {
    collected.push(block);
    if (block.children) {
      collected.push(...collectBlocks(block.children, patterns));
    }
    if (block.type === 'pattern' && block.patternId && patterns?.[block.patternId]) {
      collected.push(...collectBlocks(patterns[block.patternId].blocks, patterns));
    }
  }

  return collected;
}

function styleRule(selector: string, style?: BlockStyle): string {
  const declarations = styleDeclarations(style);
  return declarations ? `${selector}{${declarations}}` : '';
}

function styleDeclarations(style?: BlockStyle): string {
  if (!style) return '';

  return Object.entries(style)
    .map(([property, value]) => declaration(property, value))
    .filter(Boolean)
    .join('');
}

function declaration(property: string, value: string): string {
  if (!isSafeProperty(property) || !isSafeValue(value)) return '';
  return `${toKebabCase(property)}:${value}!important;`;
}

function mediaBlock(query: string | undefined, rules: string[]): string {
  if (!query || rules.length === 0) return '';
  return `${query}{${rules.join('\n')}}`;
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function sanitizeClassToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function isSafeProperty(value: string): boolean {
  return /^-?[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
}

function isSafeValue(value: string): boolean {
  return !/[;{}]/.test(value);
}
