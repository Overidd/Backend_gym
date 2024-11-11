/*
  Warnings:

  - A unique constraint covering the columns `[plan_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_plan_id_key" ON "Subscription"("plan_id");
