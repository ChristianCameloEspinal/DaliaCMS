export type PostStatus = 'draft' | 'published' | 'archived';

export const POST_STATUSES: PostStatus[] = ['draft', 'published', 'archived'];

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};

export interface Post {
  id: string;
  post_author_id: string | null;
  post_date: Date | null;
  post_content: string | null;
  post_title: string;
  post_excerpt: string | null;
  post_status: string;
  post_name: string;
  post_type: string;
  post_meta_title: string | null;
  post_meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePostInput {
  post_type: string;
  post_title: string;
  post_name: string;
  post_content?: string;
  post_excerpt?: string;
  post_status?: PostStatus;
  post_author_id?: string | null;
}

export interface UpdatePostInput {
  post_title: string;
  post_name: string;
  post_excerpt?: string;
  post_status: PostStatus;
  post_meta_title?: string;
  post_meta_description?: string;
}

export interface ListPostsFilter {
  post_type?: string;
}
