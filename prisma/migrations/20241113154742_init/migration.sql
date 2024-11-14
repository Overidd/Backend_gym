/*
  Warnings:

  - You are about to drop the column `membership_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `plans_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `access_code` on table `Subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscription_id` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_membership_id_fkey";

-- DropIndex
DROP INDEX "Subscription_plan_id_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "membership_id",
DROP COLUMN "plan_id",
DROP COLUMN "status",
ADD COLUMN     "plans_id" INTEGER NOT NULL,
ALTER COLUMN "access_code" SET NOT NULL,
ALTER COLUMN "subscription_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "Plans" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "email" TEXT,
    "status" "statusEnum" NOT NULL,
    "membership_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plans_plan_id_key" ON "Plans"("plan_id");

-- AddForeignKey
ALTER TABLE "Plans" ADD CONSTRAINT "Plans_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plans_id_fkey" FOREIGN KEY ("plans_id") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
