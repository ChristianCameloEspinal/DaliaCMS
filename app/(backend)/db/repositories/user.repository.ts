import { prisma } from '@/db/prisma';
import type { User } from '@prisma/client';

export const userRepository = {
  findByEmail(user_email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { user_email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: {
    user_email: string;
    user_pass: string;
    user_name?: string;
    user_role?: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  },
};
