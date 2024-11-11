/*
  Warnings:

  - You are about to drop the `TransactionMembership` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currency_code` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statusEnum" AS ENUM ('PENDING', 'PAGADO', 'CANCELADO', 'VENCIDO', 'ACTIVO');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_membership_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionMembership" DROP CONSTRAINT "TransactionMembership_plans_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionMembership" DROP CONSTRAINT "TransactionMembership_user_id_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "currency_code" TEXT NOT NULL;

-- DropTable
DROP TABLE "TransactionMembership";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "membership_start" DATE NOT NULL,
    "membership_end" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "access_code" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "subscriptions_id" TEXT NOT NULL,
    "status" "statusEnum" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plans_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plans_id_fkey" FOREIGN KEY ("plans_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
