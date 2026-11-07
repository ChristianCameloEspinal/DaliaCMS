import type {
  Block,
  BlockStyle,
  BlockStyleVariants,
  StyleDevice,
  StyleState,
} from './editor.types';

export const STYLE_DEVICES: StyleDevice[] = ['desktop', 'tablet', 'mobile'];
export const STYLE_STATES: StyleState[] = ['default', 'hover', 'active'];

export function deviceWidthToStyleDevice(width: number): StyleDevice {
  if (width <= 480) return 'mobile';
  if (width <= 900) return 'tablet';
  return 'desktop';
}

export function sanitizeStyleVariants(value: unknown): BlockStyleVariants | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const variants: BlockStyleVariants = {};
  const rawVariants = value as Record<string, unknown>;

  for (const device of STYLE_DEVICES) {
    const rawDevice = rawVariants[device];
    if (!rawDevice || typeof rawDevice !== 'object') continue;

    for (const state of STYLE_STATES) {
      const rawState = (rawDevice as Record<string, unknown>)[state];
      const style = sanitizeStyle(rawState);
      if (!style) continue;
      variants[device] = { ...(variants[device] ?? {}), [state]: style };
    }
  }

  return Object.keys(variants).length > 0 ? variants : undefined;
}

export function sanitizeStyle(value: unknown): BlockStyle | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const style: BlockStyle = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === 'string' && raw.trim() !== '') style[key] = raw;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

export function getStyleForEditing(
  block: Block,
  device: StyleDevice,
  state: StyleState
): BlockStyle {
  return resolveBlockStyle(block, device, state);
}

export function resolveBlockStyle(
  block: Block,
  device: StyleDevice = 'desktop',
  state: StyleState = 'default'
): BlockStyle {
  const variants = block.styleVariants ?? {};
  return {
    ...(block.style ?? {}),
    ...(variants.desktop?.default ?? {}),
    ...(device !== 'desktop' ? variants[device]?.default ?? {} : {}),
    ...(state !== 'default' ? variants[device]?.[state] ?? {} : {}),
  };
}

export function patchBlockStyleVariant({
  block,
  device,
  state,
  key,
  value,
}: {
  block: Block;
  device: StyleDevice;
  state: StyleState;
  key: string;
  value: string;
}): Block {
  if (device === 'desktop' && state === 'default') {
    const style = { ...(block.style ?? {}) };
    if (value === '') {
      delete style[key];
    } else {
      style[key] = value;
    }
    return cleanBlockStyles({ ...block, style: cleanStyle(style) });
  }

  const style = { ...(block.styleVariants?.[device]?.[state] ?? {}) };
  if (value === '') {
    delete style[key];
  } else {
    style[key] = value;
  }

  const styleVariants: BlockStyleVariants = {
    ...(block.styleVariants ?? {}),
    [device]: {
      ...(block.styleVariants?.[device] ?? {}),
      [state]: cleanStyle(style),
    },
  };

  return cleanBlockStyles({ ...block, styleVariants: cleanStyleVariants(styleVariants) });
}

export function patchBlockStyleVariantMany({
  block,
  device,
  state,
  patch,
}: {
  block: Block;
  device: StyleDevice;
  state: StyleState;
  patch: Record<string, string>;
}): Block {
  return Object.entries(patch).reduce(
    (nextBlock, [key, value]) => patchBlockStyleVariant({ block: nextBlock, device, state, key, value }),
    block
  );
}

function cleanBlockStyles(block: Block): Block {
  const next = { ...block };
  if (next.style && Object.keys(next.style).length === 0) delete next.style;
  if (next.styleVariants && Object.keys(next.styleVariants).length === 0) {
    delete next.styleVariants;
  }
  return next;
}

function cleanStyle(style: BlockStyle): BlockStyle | undefined {
  return Object.keys(style).length > 0 ? style : undefined;
}

function cleanStyleVariants(variants: BlockStyleVariants): BlockStyleVariants | undefined {
  const next: BlockStyleVariants = {};
  for (const device of STYLE_DEVICES) {
    const deviceStyles = variants[device];
    if (!deviceStyles) continue;

    for (const state of STYLE_STATES) {
      const style = deviceStyles[state];
      if (!style || Object.keys(style).length === 0) continue;
      next[device] = { ...(next[device] ?? {}), [state]: style };
    }
  }
  return Object.keys(next).length > 0 ? next : undefined;
}
