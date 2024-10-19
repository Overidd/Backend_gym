/*
  Warnings:

  - You are about to drop the column `address` on the `Local` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LocalClass` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `LocalService` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Local" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "LocalClass" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "LocalService" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "LocalLocation" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "local_id" INTEGER NOT NULL,

    CONSTRAINT "LocalLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalLocation_local_id_key" ON "LocalLocation"("local_id");

-- AddForeignKey
ALTER TABLE "LocalLocation" ADD CONSTRAINT "LocalLocation_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "Local"("id") ON DELETE CASCADE ON UPDATE CASCADE;
