import { prisma } from '@/db/prisma';
import type { Media } from '@prisma/client';

export const mediaRepository = {
  list(): Promise<Media[]> {
    return prisma.media.findMany({ orderBy: { created_at: 'desc' } });
  },

  findByIds(ids: string[]): Promise<Media[]> {
    return prisma.media.findMany({ where: { id: { in: ids } } });
  },

  create(data: {
    url: string;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    alt?: string | null;
  }): Promise<Media> {
    return prisma.media.create({ data });
  },
};
