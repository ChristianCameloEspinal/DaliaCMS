import { prisma } from '@/db/prisma';
import type { Post } from '@prisma/client';

export const postRepository = {
  findAll(filter?: { post_type?: string }): Promise<Post[]> {
    return prisma.post.findMany({
      where: filter?.post_type ? { post_type: filter.post_type } : undefined,
      orderBy: { created_at: 'desc' },
    });
  },

  findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({ where: { id } });
  },

  findByTypeAndName(post_type: string, post_name: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { post_type_post_name: { post_type, post_name } },
    });
  },

  // Busca el primer post publicado con ese slug (post_name), sin importar el tipo.
  findPublishedByName(post_name: string): Promise<Post | null> {
    return prisma.post.findFirst({
      where: { post_name, post_status: 'published' },
    });
  },

  create(data: {
    post_type: string;
    post_title: string;
    post_name: string;
    post_content?: string;
    post_excerpt?: string;
    post_status?: string;
    post_date?: Date | null;
    post_author_id?: string | null;
  }): Promise<Post> {
    return prisma.post.create({ data });
  },

  update(
    id: string,
    data: Partial<{
      post_title: string;
      post_name: string;
      post_content: string | null;
      post_excerpt: string | null;
      post_status: string;
      post_date: Date | null;
      post_meta_title: string | null;
      post_meta_description: string | null;
    }>
  ): Promise<Post> {
    return prisma.post.update({ where: { id }, data });
  },

  delete(id: string): Promise<Post> {
    return prisma.post.delete({ where: { id } });
  },

  count(): Promise<number> {
    return prisma.post.count();
  },

  countByStatus(post_status: string): Promise<number> {
    return prisma.post.count({ where: { post_status } });
  },
};
