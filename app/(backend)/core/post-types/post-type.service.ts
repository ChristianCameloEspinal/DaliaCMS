import { postTypeRepository } from '@/db/repositories/post-type.repository';
import type { CreatePostTypeInput, PostType, UpdatePostTypeInput } from './post-type.types';

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function listPostTypes(): Promise<PostType[]> {
  return postTypeRepository.findAll();
}

export async function getPostTypeById(id: string): Promise<PostType | null> {
  return postTypeRepository.findById(id);
}

export async function getPostTypeByType(post_type: string): Promise<PostType | null> {
  return postTypeRepository.findByType(post_type);
}

export async function createPostType(input: CreatePostTypeInput): Promise<PostType> {
  const post_type = input.post_type.trim().toLowerCase();
  const post_type_label = input.post_type_label.trim();

  if (!SLUG_REGEX.test(post_type)) {
    throw new Error('post_type debe ser un slug en minúsculas (letras, números y guiones)');
  }
  if (!post_type_label) {
    throw new Error('post_type_label es obligatorio');
  }

  const existing = await postTypeRepository.findByType(post_type);
  if (existing) {
    throw new Error(`Ya existe un post type "${post_type}"`);
  }

  return postTypeRepository.create({
    post_type,
    post_type_label,
    post_type_description: input.post_type_description?.trim() || undefined,
  });
}

export async function updatePostType(id: string, input: UpdatePostTypeInput): Promise<PostType> {
  const post_type_label = input.post_type_label.trim();
  if (!post_type_label) {
    throw new Error('post_type_label es obligatorio');
  }

  return postTypeRepository.update(id, {
    post_type_label,
    post_type_description: input.post_type_description?.trim() || null,
  });
}

export async function countPostTypes(): Promise<number> {
  return postTypeRepository.count();
}

export async function deletePostType(id: string): Promise<void> {
  const postType = await postTypeRepository.findById(id);
  if (!postType) {
    throw new Error('Post type no encontrado');
  }
  if (postType.post_type_system) {
    throw new Error('No se pueden eliminar post types del sistema');
  }

  await postTypeRepository.delete(id);
}
