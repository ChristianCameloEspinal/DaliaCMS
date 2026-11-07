export type EditorVariableType = 'color' | 'typography' | 'number' | 'spacing' | 'text';

export interface EditorVariable {
  id: string;
  key: string;
  value: string;
  type: EditorVariableType;
}

export interface EditorVariablesDocument {
  version: 1;
  variables: EditorVariable[];
}

export const EDITOR_VARIABLE_TYPES: { value: EditorVariableType; label: string }[] = [
  { value: 'color', label: 'Colores' },
  { value: 'typography', label: 'Tipografia' },
  { value: 'number', label: 'Numeros' },
  { value: 'spacing', label: 'Espaciado' },
  { value: 'text', label: 'Texto' },
];

export const DEFAULT_EDITOR_VARIABLES: EditorVariablesDocument = {
  version: 1,
  variables: [
    { id: 'base-color', key: '--dalia-color-base', value: '#ffffff', type: 'color' },
    { id: 'text-color', key: '--dalia-color-contrast', value: '#0f172a', type: 'color' },
    { id: 'primary-color', key: '--color-primary', value: '#0f172a', type: 'color' },
    { id: 'on-primary-color', key: '--dalia-color-on-primary', value: '#ffffff', type: 'color' },
    { id: 'surface-color', key: '--dalia-color-surface', value: '#f8fafc', type: 'color' },
    { id: 'muted-color', key: '--dalia-color-muted', value: '#475569', type: 'color' },
    { id: 'border-color', key: '--dalia-color-border', value: '#cbd5e1', type: 'color' },
    { id: 'heading-font', key: '--dalia-font-heading', value: 'system-ui, sans-serif', type: 'typography' },
    { id: 'body-font', key: '--dalia-font-body', value: 'system-ui, sans-serif', type: 'typography' },
    { id: 'heading-size', key: '--dalia-font-size-heading', value: '2rem', type: 'typography' },
    { id: 'body-size', key: '--dalia-font-size-body', value: '1rem', type: 'typography' },
    { id: 'content-width', key: '--dalia-content-size', value: '672px', type: 'spacing' },
    { id: 'wide-width', key: '--dalia-wide-size', value: '1100px', type: 'spacing' },
    { id: 'content-padding', key: '--dalia-content-padding', value: '48px', type: 'spacing' },
    { id: 'page-gutter', key: '--dalia-page-gutter', value: '24px', type: 'spacing' },
    { id: 'control-radius', key: '--dalia-radius-control', value: '8px', type: 'spacing' },
    { id: 'card-radius', key: '--dalia-radius-card', value: '16px', type: 'spacing' },
  ],
};

const BASE_VARIABLE_KEYS = new Set(DEFAULT_EDITOR_VARIABLES.variables.map((variable) => variable.key));
const BASE_VARIABLE_IDS = new Set(DEFAULT_EDITOR_VARIABLES.variables.map((variable) => variable.id));

export function isBaseEditorVariable(key: string): boolean {
  return BASE_VARIABLE_KEYS.has(key);
}

export function mergeEditorVariables(value: unknown, previous: EditorVariable[] = []): EditorVariable[] {
  const incoming = sanitizeEditorVariables(value);
  const oldByKey = new Map(sanitizeEditorVariables(previous).map((variable) => [variable.key, variable]));
  const incomingByKey = new Map(incoming.map((variable) => [variable.key, variable]));
  const base = DEFAULT_EDITOR_VARIABLES.variables.map((variable) => ({
    ...variable,
    value: incomingByKey.get(variable.key)?.value ?? oldByKey.get(variable.key)?.value ?? variable.value,
  }));
  const custom = new Map<string, EditorVariable>();
  for (const variable of incoming) {
    if (!BASE_VARIABLE_KEYS.has(variable.key) && !BASE_VARIABLE_IDS.has(variable.id)) {
      custom.set(variable.key, variable);
    }
  }
  return [...base, ...custom.values()];
}

export function parseEditorVariables(value: string | null | undefined): EditorVariablesDocument {
  if (!value) return DEFAULT_EDITOR_VARIABLES;

  try {
    const data = JSON.parse(value) as Partial<EditorVariablesDocument>;
    return {
      version: 1,
      variables: mergeEditorVariables(data.variables),
    };
  } catch {
    return DEFAULT_EDITOR_VARIABLES;
  }
}

export function serializeEditorVariables(variables: EditorVariable[]): string {
  return JSON.stringify({
    version: 1,
    variables: mergeEditorVariables(variables),
  } satisfies EditorVariablesDocument);
}

export function sanitizeEditorVariables(value: unknown): EditorVariable[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => sanitizeEditorVariable(item, index))
    .filter((item): item is EditorVariable => Boolean(item));
}

function sanitizeEditorVariable(value: unknown, index: number): EditorVariable | null {
  if (!value || typeof value !== 'object') return null;

  const raw = value as Partial<EditorVariable>;
  const key = str(raw.key);
  const variableValue = str(raw.value);
  if (!/^--[a-z][a-z0-9-]*$/.test(key) || !variableValue || /[;{}]/.test(variableValue) || !isEditorVariableType(raw.type)) return null;

  return {
    id: str(raw.id) || `variable-${index}`,
    key,
    value: variableValue,
    type: raw.type,
  };
}

function isEditorVariableType(value: unknown): value is EditorVariableType {
  return EDITOR_VARIABLE_TYPES.some((type) => type.value === value);
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
