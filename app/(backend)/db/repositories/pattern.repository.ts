import { prisma } from '@/db/prisma';
import type { Pattern } from '@/core/patterns/pattern.types';

export const patternRepository = {
  findAll(): Promise<Pattern[]> {
    return prisma.pattern.findMany({ orderBy: { created_at: 'asc' } });
  },

  findManyByIds(ids: string[]): Promise<Pattern[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return prisma.pattern.findMany({
      where: { id: { in: ids } },
      orderBy: { created_at: 'asc' },
    });
  },

  findById(id: string): Promise<Pattern | null> {
    return prisma.pattern.findUnique({ where: { id } });
  },

  findBySlug(pattern_slug: string): Promise<Pattern | null> {
    return prisma.pattern.findUnique({ where: { pattern_slug } });
  },

  create(data: { pattern_slug: string; pattern_label: string; content: string }): Promise<Pattern> {
    return prisma.pattern.create({ data });
  },

  update(id: string, data: { pattern_label?: string; content?: string }): Promise<Pattern> {
    return prisma.pattern.update({ where: { id }, data });
  },

  delete(id: string): Promise<Pattern> {
    return prisma.pattern.delete({ where: { id } });
  },

  count(): Promise<number> {
    return prisma.pattern.count();
  },
};
