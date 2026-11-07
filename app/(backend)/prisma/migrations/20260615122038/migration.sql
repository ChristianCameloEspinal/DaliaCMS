-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "post_template" TEXT;

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "template_slug" TEXT NOT NULL,
    "template_label" TEXT NOT NULL,
    "content_size" TEXT NOT NULL DEFAULT '672px',
    "wide_size" TEXT NOT NULL DEFAULT '1100px',
    "padding" TEXT NOT NULL DEFAULT '48px',
    "background" TEXT NOT NULL DEFAULT '#ffffff',
    "text_color" TEXT NOT NULL DEFAULT '#0f172a',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_template_slug_key" ON "Template"("template_slug");
