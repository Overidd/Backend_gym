/*
  Warnings:

  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `access_code` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `membership_end` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `membership_start` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `plans_id` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the `Plans` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[duration_in_months]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration_in_months` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_plans_id_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_membership_id_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pkey",
DROP COLUMN "access_code",
DROP COLUMN "is_active",
DROP COLUMN "membership_end",
DROP COLUMN "membership_start",
DROP COLUMN "plans_id",
DROP COLUMN "user_id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "duration_in_months" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price_total" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "status" BOOLEAN DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Membership_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT;

-- DropTable
DROP TABLE "Plans";

-- CreateTable
CREATE TABLE "TransactionMembership" (
    "id" SERIAL NOT NULL,
    "membership_start" DATE NOT NULL,
    "membership_end" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "access_code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plans_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_id_key" ON "Membership"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_duration_in_months_key" ON "Membership"("duration_in_months");

-- AddForeignKey
ALTER TABLE "TransactionMembership" ADD CONSTRAINT "TransactionMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionMembership" ADD CONSTRAINT "TransactionMembership_plans_id_fkey" FOREIGN KEY ("plans_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "TransactionMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
