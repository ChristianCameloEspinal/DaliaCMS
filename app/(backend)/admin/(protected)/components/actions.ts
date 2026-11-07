'use server';

import { redirect } from 'next/navigation';
import {
  createPattern,
  deletePattern,
  updatePattern,
} from '@/core/patterns/pattern.service';
import { serializeDocument } from '@/components/editor/editor.helpers';

export async function createPatternAction(formData: FormData) {
  const pattern_label = String(formData.get('pattern_label') ?? '').trim();

  try {
    await createPattern({ pattern_label, content: serializeDocument([]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el Component';
    redirect(`/admin/components?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/components');
}

export async function updatePatternAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const pattern_label = String(formData.get('pattern_label') ?? '').trim();
  const content = String(formData.get('content') ?? '');

  try {
    await updatePattern(id, { pattern_label, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el Component';
    redirect(`/admin/components/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/components');
}

export async function deletePatternAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');

  try {
    await deletePattern(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el Component';
    redirect(`/admin/components?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/components');
}
