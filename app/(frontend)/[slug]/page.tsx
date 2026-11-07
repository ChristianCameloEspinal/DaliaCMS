import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getPublishedPostByName } from '@/core/posts/post.service';
import { getEditorVariables } from '@/core/editor-variables/editor-variables.service';
import { siteContainerStyle } from '@/core/editor-variables/editor-variables.styles';
import { getPatternBlockMap } from '@/core/patterns/pattern.service';
import { getMediaMap } from '@/media/media.service';
import { collectMediaIds, collectPatternIds, parseDocument } from '@/components/editor/editor.helpers';
import { BlockRenderer } from '@/components/editor/blocks/block-renderer';

const getCachedPublishedPostByName = cache(getPublishedPostByName);

// SSR: cada visita resuelve el slug contra la base de datos (ruta dinámica).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPublishedPostByName(slug);
  if (!post) {
    return { title: 'No encontrado' };
  }
  return {
    title: post.post_meta_title?.trim() || post.post_title,
    description: post.post_meta_description?.trim() || post.post_excerpt || undefined,
  };
}

export default async function PublicPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, variables] = await Promise.all([
    getCachedPublishedPostByName(slug),
    getEditorVariables(),
  ]);

  if (!post) {
    notFound();
  }

  // Resuelve los punteros de los bloques de imagen a sus URLs (SSR).
  const { blocks } = parseDocument(post.post_content);
  const patterns = await getPatternBlockMap(collectPatternIds(blocks));
  const patternBlocks = Object.values(patterns).flatMap((pattern) => pattern.blocks);
  const media = await getMediaMap(collectMediaIds([...blocks, ...patternBlocks]));

  return (
    <article style={siteContainerStyle(variables)}>
      <div className="mt-6">
        <BlockRenderer blocks={blocks} media={media} patterns={patterns} />
      </div>
    </article>
  );
}
