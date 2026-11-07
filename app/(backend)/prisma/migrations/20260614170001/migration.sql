-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "post_meta_description" TEXT,
ADD COLUMN     "post_meta_title" TEXT;

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);
