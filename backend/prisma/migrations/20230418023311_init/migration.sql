/*
  Warnings:

  - You are about to drop the column `user_id` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conversation_id,friend_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `friend_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_user_id_fkey";

-- DropIndex
DROP INDEX "Participant_conversation_id_user_id_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "user_id",
ADD COLUMN     "friend_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_user_id_key" ON "Friend"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_conversation_id_friend_id_key" ON "Participant"("conversation_id", "friend_id");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "Friend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
