/*
  Warnings:

  - Added the required column `icon` to the `ClassGym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `ServiceGym` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassGym" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceGym" ADD COLUMN     "icon" TEXT NOT NULL;
