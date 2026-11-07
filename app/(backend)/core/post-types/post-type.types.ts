export interface PostType {
  id: string;
  post_type: string;
  post_type_label: string;
  post_type_description: string | null;
  post_type_system: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePostTypeInput {
  post_type: string;
  post_type_label: string;
  post_type_description?: string;
}

export interface UpdatePostTypeInput {
  post_type_label: string;
  post_type_description?: string;
}
