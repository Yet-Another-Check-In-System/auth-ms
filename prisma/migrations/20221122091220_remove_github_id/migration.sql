/*
  Warnings:

  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubId",
ADD COLUMN     "appleId" TEXT;
