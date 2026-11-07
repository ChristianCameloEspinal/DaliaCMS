'use server';

import { redirect } from 'next/navigation';
import { updatePost, updatePostContent } from '@/core/posts/post.service';
import { type PostStatus } from '@/core/posts/post.types';
import { createPattern, updatePattern } from '@/core/patterns/pattern.service';
import { createPostRevision } from '@/core/post-revisions/post-revision.service';
import { parseDocument, serializeDocument } from '@/components/editor/editor.helpers';
import type { Block } from '@/components/editor/editor.types';

interface PatternPayload {
  id: string;
  label: string;
  content: string;
  isNew?: boolean;
}

function replacePatternIds(blocks: Block[], replacements: Map<string, string>): Block[] {
  return blocks.map((block) => {
    const next: Block = { ...block };
    if (next.type === 'pattern' && next.patternId && replacements.has(next.patternId)) {
      next.patternId = replacements.get(next.patternId);
    }
    if (next.children) {
      next.children = replacePatternIds(next.children, replacements);
    }
    return next;
  });
}

function parsePatternPayload(value: FormDataEntryValue | null): PatternPayload[] {
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is PatternPayload =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.label === 'string' &&
        typeof item.content === 'string'
    );
  } catch {
    return [];
  }
}

// Guarda el JSON de bloques serializado en post_content y vuelve al editor.
export async function saveBlocksAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  let content = String(formData.get('content') ?? '');
  const patterns = parsePatternPayload(formData.get('patterns'));
  const revisionPatterns = parsePatternPayload(formData.get('revision_patterns'));
  const post_title = String(formData.get('post_title') ?? '');
  const post_name = String(formData.get('post_name') ?? '');
  const post_excerpt = String(formData.get('post_excerpt') ?? '');
  const post_status = String(formData.get('post_status') ?? 'draft') as PostStatus;
  const post_meta_title = String(formData.get('post_meta_title') ?? '');
  const post_meta_description = String(formData.get('post_meta_description') ?? '');

  try {
    const replacements = new Map<string, string>();
    for (const pattern of patterns) {
      if (pattern.isNew || pattern.id.startsWith('tmp-')) {
        const created = await createPattern({
          pattern_label: pattern.label,
          content: pattern.content,
        });
        replacements.set(pattern.id, created.id);
      } else {
        await updatePattern(pattern.id, {
          pattern_label: pattern.label,
          content: pattern.content,
        });
      }
    }
    if (replacements.size > 0) {
      content = serializeDocument(replacePatternIds(parseDocument(content).blocks, replacements));
    }
    const snapshotPatterns = (revisionPatterns.length > 0 ? revisionPatterns : patterns).map(
      (pattern) => ({
        ...pattern,
        id: replacements.get(pattern.id) ?? pattern.id,
        content:
          replacements.size > 0
            ? serializeDocument(replacePatternIds(parseDocument(pattern.content).blocks, replacements))
            : pattern.content,
      })
    );
    await updatePost(id, {
      post_title,
      post_name,
      post_excerpt,
      post_status,
      post_meta_title,
      post_meta_description,
    });
    await updatePostContent(id, content);
    await createPostRevision({
      post_id: id,
      label: post_title || 'Guardado manual',
      action_type: 'post.save',
      snapshot: JSON.stringify({
        version: 1,
        content,
        patterns: snapshotPatterns,
        settings: {
          post_title,
          post_name,
          post_excerpt,
          post_status,
          post_meta_title,
          post_meta_description,
        },
        saved_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al guardar el contenido';
    redirect(`/admin/posts/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/admin/posts/${id}?saved=1`);
}
