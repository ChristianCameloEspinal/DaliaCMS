-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_pass" TEXT NOT NULL,
    "user_name" TEXT,
    "user_role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostType" (
    "id" TEXT NOT NULL,
    "post_type" TEXT NOT NULL,
    "post_type_label" TEXT NOT NULL,
    "post_type_description" TEXT,
    "post_type_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "post_author_id" TEXT,
    "post_date" TIMESTAMP(3),
    "post_content" TEXT,
    "post_title" TEXT NOT NULL,
    "post_excerpt" TEXT,
    "post_status" TEXT NOT NULL DEFAULT 'draft',
    "post_name" TEXT NOT NULL,
    "post_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "PostType_post_type_key" ON "PostType"("post_type");

-- CreateIndex
CREATE INDEX "Post_post_type_idx" ON "Post"("post_type");

-- CreateIndex
CREATE INDEX "Post_post_status_idx" ON "Post"("post_status");

-- CreateIndex
CREATE INDEX "Post_post_date_idx" ON "Post"("post_date");

-- CreateIndex
CREATE UNIQUE INDEX "Post_post_type_post_name_key" ON "Post"("post_type", "post_name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_post_author_id_fkey" FOREIGN KEY ("post_author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
