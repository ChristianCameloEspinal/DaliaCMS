import { postRepository } from '@/db/repositories/post.repository';
import { postTypeRepository } from '@/db/repositories/post-type.repository';
import {
  POST_STATUSES,
  type CreatePostInput,
  type ListPostsFilter,
  type Post,
  type PostStatus,
  type UpdatePostInput,
} from './post.types';

function assertValidStatus(status: string): status is PostStatus {
  if (!POST_STATUSES.includes(status as PostStatus)) {
    throw new Error(`post_status inválido: "${status}"`);
  }
  return true;
}

async function assertPostTypeExists(post_type: string): Promise<void> {
  const postType = await postTypeRepository.findByType(post_type);
  if (!postType) {
    throw new Error(`El post_type "${post_type}" no existe`);
  }
}

async function assertUniquePostName(
  post_type: string,
  post_name: string,
  excludeId?: string
): Promise<void> {
  const existing = await postRepository.findByTypeAndName(post_type, post_name);
  if (existing && existing.id !== excludeId) {
    throw new Error(`Ya existe un post con post_name "${post_name}" en el tipo "${post_type}"`);
  }
}

export async function listPosts(filter?: ListPostsFilter): Promise<Post[]> {
  return postRepository.findAll(filter);
}

export async function getPostById(id: string): Promise<Post | null> {
  return postRepository.findById(id);
}

export async function getPostByTypeAndName(post_type: string, post_name: string): Promise<Post | null> {
  return postRepository.findByTypeAndName(post_type, post_name);
}

// Para el sitio público: devuelve el post publicado que corresponde a un slug.
export async function getPublishedPostByName(post_name: string): Promise<Post | null> {
  return postRepository.findPublishedByName(post_name);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const post_title = input.post_title.trim();
  const post_name = input.post_name.trim();
  const post_status = input.post_status ?? 'draft';

  if (!post_title) {
    throw new Error('post_title es obligatorio');
  }
  if (!post_name) {
    throw new Error('post_name es obligatorio');
  }
  assertValidStatus(post_status);
  await assertPostTypeExists(input.post_type);
  await assertUniquePostName(input.post_type, post_name);

  return postRepository.create({
    post_type: input.post_type,
    post_title,
    post_name,
    post_content: input.post_content?.trim() || undefined,
    post_excerpt: input.post_excerpt?.trim() || undefined,
    post_status,
    post_date: post_status === 'published' ? new Date() : null,
    post_author_id: input.post_author_id ?? null,
  });
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post> {
  const post = await postRepository.findById(id);
  if (!post) {
    throw new Error('Post no encontrado');
  }

  const post_title = input.post_title.trim();
  const post_name = input.post_name.trim();

  if (!post_title) {
    throw new Error('post_title es obligatorio');
  }
  if (!post_name) {
    throw new Error('post_name es obligatorio');
  }
  assertValidStatus(input.post_status);
  await assertUniquePostName(post.post_type, post_name, id);

  const post_date =
    input.post_status === 'published' && !post.post_date ? new Date() : post.post_date;

  return postRepository.update(id, {
    post_title,
    post_name,
    post_excerpt: input.post_excerpt?.trim() || null,
    post_status: input.post_status,
    post_date,
    post_meta_title: input.post_meta_title?.trim() || null,
    post_meta_description: input.post_meta_description?.trim() || null,
  });
}

// El contenido (JSON de bloques) se gestiona aparte, desde el editor, para que
// guardar los metadatos del post no lo sobrescriba.
export async function updatePostContent(id: string, content: string): Promise<Post> {
  const post = await postRepository.findById(id);
  if (!post) {
    throw new Error('Post no encontrado');
  }
  return postRepository.update(id, { post_content: content || null });
}

export async function changePostStatus(id: string, status: PostStatus): Promise<Post> {
  const post = await postRepository.findById(id);
  if (!post) {
    throw new Error('Post no encontrado');
  }

  assertValidStatus(status);
  const post_date = status === 'published' && !post.post_date ? new Date() : post.post_date;

  return postRepository.update(id, { post_status: status, post_date });
}

export async function deletePost(id: string): Promise<void> {
  await postRepository.delete(id);
}

export async function countPosts(): Promise<number> {
  return postRepository.count();
}

export async function countPostsByStatus(status: PostStatus): Promise<number> {
  return postRepository.countByStatus(status);
}
