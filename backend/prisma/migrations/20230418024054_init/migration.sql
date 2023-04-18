/*
  Warnings:

  - You are about to drop the column `friend_id` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conversation_id,user_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_friend_id_fkey";

-- DropIndex
DROP INDEX "Friend_user_id_key";

-- DropIndex
DROP INDEX "Participant_conversation_id_friend_id_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "friend_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_conversation_id_user_id_key" ON "Participant"("conversation_id", "user_id");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
