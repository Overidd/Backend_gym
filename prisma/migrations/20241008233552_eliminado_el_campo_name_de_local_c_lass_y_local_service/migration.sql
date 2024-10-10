/*
  Warnings:

  - You are about to drop the column `name` on the `LocalClass` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LocalService` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LocalClass" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "LocalService" DROP COLUMN "name";
