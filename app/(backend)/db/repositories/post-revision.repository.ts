import { prisma } from '@/db/prisma';

export interface PostRevisionRecord {
  id: string;
  post_id: string;
  created_at: Date;
  label: string | null;
  action_type: string | null;
  snapshot: string;
}

const MAX_REVISIONS_PER_POST = 10;

export const postRevisionRepository = {
  async findByPostId(postId: string): Promise<PostRevisionRecord[]> {
    return prisma.$queryRaw<PostRevisionRecord[]>`
      SELECT id, post_id, created_at, label, action_type, snapshot
      FROM "PostRevision"
      WHERE post_id = ${postId}
      ORDER BY created_at DESC
      LIMIT ${MAX_REVISIONS_PER_POST}
    `;
  },

  async create(data: {
    post_id: string;
    label?: string | null;
    action_type?: string | null;
    snapshot: string;
  }): Promise<PostRevisionRecord> {
    const id = crypto.randomUUID();

    const created = await prisma.$queryRaw<PostRevisionRecord[]>`
      INSERT INTO "PostRevision" (id, post_id, label, action_type, snapshot)
      VALUES (${id}, ${data.post_id}, ${data.label ?? null}, ${data.action_type ?? null}, ${data.snapshot})
      RETURNING id, post_id, created_at, label, action_type, snapshot
    `;

    await prisma.$executeRaw`
      DELETE FROM "PostRevision"
      WHERE id IN (
        SELECT id
        FROM "PostRevision"
        WHERE post_id = ${data.post_id}
        ORDER BY created_at DESC
        OFFSET ${MAX_REVISIONS_PER_POST}
      )
    `;

    return created[0];
  },
};
