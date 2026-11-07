'use server';

import { redirect } from 'next/navigation';
import { saveUpload } from '@/media/media.service';
import type { Media } from '@/media/media.types';

// Para el selector del editor (cliente): sube y devuelve el media creado.
export async function uploadMedia(formData: FormData): Promise<Media> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('No se recibió ningún archivo');
  }
  return saveUpload(file);
}

// Para el formulario de /admin/media: sube y recarga la página.
export async function uploadMediaFromPage(formData: FormData) {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    redirect(`/admin/media?error=${encodeURIComponent('No se recibió ningún archivo')}`);
  }

  try {
    await saveUpload(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al subir el archivo';
    redirect(`/admin/media?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/media?uploaded=1');
}
