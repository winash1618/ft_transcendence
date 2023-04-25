/*
  Warnings:

  - You are about to drop the column `channel_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Participant_conversation_id_user_id_key";

-- DropIndex
DROP INDEX "Participant_user_id_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "channel_id",
DROP COLUMN "creator_id",
DROP COLUMN "deleted_at";

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_title_key" ON "Conversation"("title");
