/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "login" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_login_key" ON "Friend"("login");
