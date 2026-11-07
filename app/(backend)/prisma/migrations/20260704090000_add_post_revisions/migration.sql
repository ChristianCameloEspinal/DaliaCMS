CREATE TABLE "PostRevision" (
  "id" TEXT NOT NULL,
  "post_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "label" TEXT,
  "action_type" TEXT,
  "snapshot" TEXT NOT NULL,

  CONSTRAINT "PostRevision_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PostRevision_post_id_created_at_idx" ON "PostRevision"("post_id", "created_at");

ALTER TABLE "PostRevision"
ADD CONSTRAINT "PostRevision_post_id_fkey"
FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
