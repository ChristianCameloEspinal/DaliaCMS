import { prisma } from '@/db/prisma';
import type { Setting } from '@prisma/client';

export const settingRepository = {
  get(key: string): Promise<Setting | null> {
    return prisma.setting.findUnique({ where: { key } });
  },

  // Crea o actualiza el valor de una clave (upsert).
  set(key: string, value: string): Promise<Setting> {
    return prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  },
};
