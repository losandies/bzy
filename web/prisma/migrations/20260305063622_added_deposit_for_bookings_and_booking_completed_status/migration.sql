-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "depositCost" INTEGER,
ADD COLUMN     "depositNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "displayPhoto" TEXT;
