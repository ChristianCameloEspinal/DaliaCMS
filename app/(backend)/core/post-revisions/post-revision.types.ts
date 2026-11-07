export interface PostRevision {
  id: string;
  post_id: string;
  created_at: Date;
  label: string | null;
  action_type: string | null;
  snapshot: string;
}

export interface CreatePostRevisionInput {
  post_id: string;
  label?: string | null;
  action_type?: string | null;
  snapshot: string;
}
