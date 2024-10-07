/*
  Warnings:

  - Made the column `isActive` on table `Trainer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trainer" ALTER COLUMN "isActive" SET NOT NULL;
