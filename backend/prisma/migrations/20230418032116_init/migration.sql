/*
  Warnings:

  - Made the column `username` on table `Friend` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Friend" ALTER COLUMN "username" SET NOT NULL;
