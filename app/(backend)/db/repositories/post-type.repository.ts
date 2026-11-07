import { prisma } from '@/db/prisma';
import type { PostType } from '@prisma/client';

export const postTypeRepository = {
  findAll(): Promise<PostType[]> {
    return prisma.postType.findMany({ orderBy: { created_at: 'asc' } });
  },

  findByType(post_type: string): Promise<PostType | null> {
    return prisma.postType.findUnique({ where: { post_type } });
  },

  findById(id: string): Promise<PostType | null> {
    return prisma.postType.findUnique({ where: { id } });
  },

  create(data: {
    post_type: string;
    post_type_label: string;
    post_type_description?: string;
    post_type_system?: boolean;
  }): Promise<PostType> {
    return prisma.postType.create({ data });
  },

  update(
    id: string,
    data: Partial<{
      post_type: string;
      post_type_label: string;
      post_type_description: string | null;
    }>
  ): Promise<PostType> {
    return prisma.postType.update({ where: { id }, data });
  },

  delete(id: string): Promise<PostType> {
    return prisma.postType.delete({ where: { id } });
  },

  count(): Promise<number> {
    return prisma.postType.count();
  },
};
