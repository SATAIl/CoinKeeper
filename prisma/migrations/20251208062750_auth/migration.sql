/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "isGlobal" SET DEFAULT true;

-- AlterTable
-- ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT NOT NULL,
-- ADD COLUMN     "username" TEXT NOT NULL;

ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN "username" TEXT;

UPDATE "User" SET "passwordHash" = 'temp_hash_placeholder' WHERE "passwordHash" IS NULL;
UPDATE "User" SET "username" = 'user_' || "id" WHERE "username" IS NULL;

ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
