'use server';

import { updateEditorVariables } from '@/core/editor-variables/editor-variables.service';
import type { EditorVariable } from '@/core/editor-variables/editor-variables.types';

export async function saveEditorVariablesAction(variables: EditorVariable[]) {
  await updateEditorVariables(variables);
}
