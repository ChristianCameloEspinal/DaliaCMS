import { settingRepository } from '@/db/repositories/setting.repository';
import {
  mergeEditorVariables,
  parseEditorVariables,
  serializeEditorVariables,
  type EditorVariable,
} from './editor-variables.types';

const EDITOR_VARIABLES_KEY = 'editor_variables';

export async function getEditorVariables(): Promise<EditorVariable[]> {
  const setting = await settingRepository.get(EDITOR_VARIABLES_KEY);
  return parseEditorVariables(setting?.value ?? null).variables;
}

export async function updateEditorVariables(variables: EditorVariable[]): Promise<EditorVariable[]> {
  const previous = await getEditorVariables();
  const next = mergeEditorVariables(variables, previous);
  await settingRepository.set(EDITOR_VARIABLES_KEY, serializeEditorVariables(next));
  return next;
}
