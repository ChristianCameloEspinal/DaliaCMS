'use server';

import { redirect } from 'next/navigation';
import {
  createPostType,
  deletePostType,
  updatePostType,
} from '@/core/post-types/post-type.service';

export async function createPostTypeAction(formData: FormData) {
  const post_type = String(formData.get('post_type') ?? '').trim();
  const post_type_label = String(formData.get('post_type_label') ?? '').trim();
  const post_type_description = String(formData.get('post_type_description') ?? '').trim();

  try {
    await createPostType({
      post_type,
      post_type_label,
      post_type_description: post_type_description || undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el post type';
    redirect(`/admin/post-types/new?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/post-types');
}

export async function updatePostTypeAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const post_type_label = String(formData.get('post_type_label') ?? '').trim();
  const post_type_description = String(formData.get('post_type_description') ?? '').trim();

  try {
    await updatePostType(id, {
      post_type_label,
      post_type_description: post_type_description || undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el post type';
    redirect(`/admin/post-types/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/post-types');
}

export async function deletePostTypeAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');

  try {
    await deletePostType(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el post type';
    redirect(`/admin/post-types?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/post-types');
}
