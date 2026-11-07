'use server';

import { redirect } from 'next/navigation';
import {
  changePostStatus,
  createPost,
  deletePost,
  updatePost,
} from '@/core/posts/post.service';
import type { PostStatus } from '@/core/posts/post.types';

export async function createPostAction(formData: FormData) {
  const post_type = String(formData.get('post_type') ?? '').trim();
  const post_title = String(formData.get('post_title') ?? '').trim();
  const post_name = String(formData.get('post_name') ?? '').trim();
  const post_excerpt = String(formData.get('post_excerpt') ?? '').trim();
  const post_status = String(formData.get('post_status') ?? 'draft') as PostStatus;

  try {
    await createPost({
      post_type,
      post_title,
      post_name,
      post_excerpt: post_excerpt || undefined,
      post_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el post';
    redirect(`/admin/posts/new?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/posts');
}

export async function updatePostAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const post_title = String(formData.get('post_title') ?? '').trim();
  const post_name = String(formData.get('post_name') ?? '').trim();
  const post_excerpt = String(formData.get('post_excerpt') ?? '').trim();
  const post_status = String(formData.get('post_status') ?? 'draft') as PostStatus;

  try {
    await updatePost(id, {
      post_title,
      post_name,
      post_excerpt: post_excerpt || undefined,
      post_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el post';
    redirect(`/admin/posts/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/posts');
}

export async function changePostStatusAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as PostStatus;

  try {
    await changePostStatus(id, status);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al cambiar el estado';
    redirect(`/admin/posts?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/posts');
}

export async function deletePostAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');

  try {
    await deletePost(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el post';
    redirect(`/admin/posts?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin/posts');
}
