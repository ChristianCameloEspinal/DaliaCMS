-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_email" TEXT NOT NULL,
    "user_pass" TEXT NOT NULL,
    "user_name" TEXT,
    "user_role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PostType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_type" TEXT NOT NULL,
    "post_type_label" TEXT NOT NULL,
    "post_type_description" TEXT,
    "post_type_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "template_slug" TEXT NOT NULL,
    "template_label" TEXT NOT NULL,
    "content_size" TEXT NOT NULL DEFAULT '672px',
    "wide_size" TEXT NOT NULL DEFAULT '1100px',
    "padding" TEXT NOT NULL DEFAULT '48px',
    "background" TEXT NOT NULL DEFAULT '#ffffff',
    "text_color" TEXT NOT NULL DEFAULT '#0f172a',
    "content" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "alt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pattern_slug" TEXT NOT NULL,
    "pattern_label" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_author_id" TEXT,
    "post_date" DATETIME,
    "post_content" TEXT,
    "post_title" TEXT NOT NULL,
    "post_excerpt" TEXT,
    "post_status" TEXT NOT NULL DEFAULT 'draft',
    "post_name" TEXT NOT NULL,
    "post_type" TEXT NOT NULL,
    "post_template" TEXT,
    "post_meta_title" TEXT,
    "post_meta_description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Post_post_author_id_fkey" FOREIGN KEY ("post_author_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT,
    "action_type" TEXT,
    "snapshot" TEXT NOT NULL,
    CONSTRAINT "PostRevision_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "PostType_post_type_key" ON "PostType"("post_type");

-- CreateIndex
CREATE UNIQUE INDEX "Template_template_slug_key" ON "Template"("template_slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_pattern_slug_key" ON "Pattern"("pattern_slug");

-- CreateIndex
CREATE INDEX "Post_post_type_idx" ON "Post"("post_type");

-- CreateIndex
CREATE INDEX "Post_post_status_idx" ON "Post"("post_status");

-- CreateIndex
CREATE INDEX "Post_post_date_idx" ON "Post"("post_date");

-- CreateIndex
CREATE UNIQUE INDEX "Post_post_type_post_name_key" ON "Post"("post_type", "post_name");

-- CreateIndex
CREATE INDEX "PostRevision_post_id_created_at_idx" ON "PostRevision"("post_id", "created_at");
