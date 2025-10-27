-- AlterTable
ALTER TABLE "chefs" ADD COLUMN "specialty" TEXT;
ALTER TABLE "chefs" ADD COLUMN "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "cancelReason" TEXT;
