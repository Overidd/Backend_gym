/*
  Warnings:

  - Added the required column `service_id` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "service_id" TEXT NOT NULL,
ALTER COLUMN "price_total" DROP DEFAULT;
