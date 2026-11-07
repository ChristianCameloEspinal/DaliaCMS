import { notFound } from 'next/navigation';

import { getPostById } from '@/core/posts/post.service';
import { getPostTypeByType } from '@/core/post-types/post-type.service';
import { getEditorVariables } from '@/core/editor-variables/editor-variables.service';
import { listPatterns } from '@/core/patterns/pattern.service';
import { listPostRevisions } from '@/core/post-revisions/post-revision.service';

import { getMediaMap, listMedia } from '@/media/media.service';
import { collectMediaIds, parseDocument } from '@/components/editor/editor.helpers';
import { EditorWorkspace } from '@/components/editor/editor-workspace';
import { saveBlocksAction } from './editor/actions';

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  const { blocks } = parseDocument(post.post_content);
  const patterns = await listPatterns();
  const editorPatterns = patterns.map((pattern) => ({
    id: pattern.id,
    label: pattern.pattern_label,
    blocks: parseDocument(pattern.content).blocks,
  }));
  const mediaIds = collectMediaIds([
    ...blocks,
    ...editorPatterns.flatMap((pattern) => pattern.blocks),
  ]);
  const [editorVariables, mediaItems, initialMedia, postType, revisions] = await Promise.all([
    getEditorVariables(),
    listMedia(),
    getMediaMap(mediaIds),
    getPostTypeByType(post.post_type),
    listPostRevisions(post.id),
  ]);
  const postTypeLabel = postType?.post_type_label ?? post.post_type;

  return (
    <form action={saveBlocksAction} className="flex h-full min-h-0 flex-col gap-3">
      <input type="hidden" name="id" value={post.id} />

      <EditorWorkspace
        initialBlocks={blocks}
        name="content"
        postTypeLabel={postTypeLabel}
        initialVariables={editorVariables}
        patterns={editorPatterns}
        mediaItems={mediaItems}
        initialMedia={initialMedia}
        revisions={revisions.map((revision) => ({
          id: revision.id,
          createdAt: revision.created_at.toISOString(),
          label: revision.label,
          actionType: revision.action_type,
          snapshot: revision.snapshot,
        }))}
        backHref="/admin/posts"
        publicHref={post.post_status === 'published' ? `/${post.post_name}` : undefined}
        notice={{ saved: Boolean(saved), error }}
        pageSettings={{
          post_type: post.post_type,
          post_title: post.post_title,
          post_name: post.post_name,
          post_excerpt: post.post_excerpt,
          post_status: post.post_status,
          post_meta_title: post.post_meta_title,
          post_meta_description: post.post_meta_description,
        }}
      />
    </form>
  );
}
