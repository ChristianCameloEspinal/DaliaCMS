CREATE TABLE "Pattern" (
  "id" TEXT NOT NULL,
  "pattern_slug" TEXT NOT NULL,
  "pattern_label" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Pattern_pattern_slug_key" ON "Pattern"("pattern_slug");
