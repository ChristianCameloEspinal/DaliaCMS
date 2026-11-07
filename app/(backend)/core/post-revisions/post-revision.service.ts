import { postRevisionRepository } from '@/db/repositories/post-revision.repository';
import type { CreatePostRevisionInput, PostRevision } from './post-revision.types';

export async function listPostRevisions(postId: string): Promise<PostRevision[]> {
  return postRevisionRepository.findByPostId(postId);
}

export async function createPostRevision(input: CreatePostRevisionInput): Promise<PostRevision> {
  if (!input.post_id) {
    throw new Error('post_id es obligatorio');
  }
  if (!input.snapshot) {
    throw new Error('snapshot es obligatorio');
  }

  return postRevisionRepository.create(input);
}
