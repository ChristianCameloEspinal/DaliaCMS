import type { CSSProperties } from 'react';
import { DEFAULT_EDITOR_VARIABLES, type EditorVariable } from './editor-variables.types';

export function siteVariableStyle(variables: EditorVariable[]): CSSProperties {
  const style: Record<string, string> = {};
  for (const variable of [...DEFAULT_EDITOR_VARIABLES.variables, ...variables]) {
    if (/^--[a-z][a-z0-9-]*$/.test(variable.key) && !/[;{}]/.test(variable.value)) {
      style[variable.key] = variable.value;
    }
  }
  return style as CSSProperties;
}

export function siteContainerStyle(variables: EditorVariable[]): CSSProperties {
  return {
    ...siteVariableStyle(variables),
    width: '100%',
    paddingTop: 'var(--dalia-content-padding)',
    paddingBottom: 'var(--dalia-content-padding)',
    backgroundColor: 'var(--dalia-color-base)',
    color: 'var(--dalia-color-contrast)',
    fontFamily: 'var(--dalia-font-body)',
    fontSize: 'var(--dalia-font-size-body)',
    paddingLeft: 'var(--dalia-page-gutter)',
    paddingRight: 'var(--dalia-page-gutter)',
  };
}

export function blockAlignStyle(align?: 'wide' | 'full'): CSSProperties {
  if (align === 'full') return { maxWidth: 'none' };
  if (align === 'wide') {
    return { maxWidth: 'var(--dalia-wide-size)', marginInline: 'auto' };
  }
  return { maxWidth: 'var(--dalia-content-size)', marginInline: 'auto' };
}
