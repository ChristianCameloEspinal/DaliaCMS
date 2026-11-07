export interface Pattern {
  id: string;
  pattern_slug: string;
  pattern_label: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePatternInput {
  pattern_label: string;
  content: string;
}

export interface UpdatePatternInput {
  pattern_label?: string;
  content?: string;
}
