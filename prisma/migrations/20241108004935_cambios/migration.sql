/*
  Warnings:

  - You are about to drop the column `plans_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptions_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `is_Google_account` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.
  - Added the required column `membership_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_active` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_confirmed` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_plans_id_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "plans_id",
DROP COLUMN "subscriptions_id",
ADD COLUMN     "membership_id" TEXT NOT NULL,
ADD COLUMN     "subscription_id" TEXT,
ALTER COLUMN "access_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_Google_account",
DROP COLUMN "picture",
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "is_google_account" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "is_confirmed" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
