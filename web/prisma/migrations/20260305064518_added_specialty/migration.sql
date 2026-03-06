/*
  Warnings:

  - Added the required column `specialty` to the `ProviderProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('HAIRSTYLIST', 'BARBER', 'NAIL_TECHNICIAN', 'ESTHETICIAN', 'MASSAGE_THERAPIST', 'PHOTOGRAPHER');

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "specialty" "Specialty" NOT NULL;
