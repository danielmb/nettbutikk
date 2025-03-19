/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AttributeValue" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_slug_key" ON "AttributeValue"("slug");
