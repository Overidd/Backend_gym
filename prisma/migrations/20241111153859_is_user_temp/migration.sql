-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_user_temp" BOOLEAN NOT NULL DEFAULT false;
