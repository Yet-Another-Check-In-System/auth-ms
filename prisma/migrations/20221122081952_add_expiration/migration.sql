/*
  Warnings:

  - Added the required column `expireAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CleanUp" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAmount" INTEGER NOT NULL,

    CONSTRAINT "CleanUp_pkey" PRIMARY KEY ("id")
);
