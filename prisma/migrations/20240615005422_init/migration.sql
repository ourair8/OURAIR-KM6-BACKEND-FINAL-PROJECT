/*
  Warnings:

  - You are about to drop the column `seat_business` on the `airplanes` table. All the data in the column will be lost.
  - You are about to drop the column `seat_economy` on the `airplanes` table. All the data in the column will be lost.
  - You are about to drop the column `seat_economy_premium` on the `airplanes` table. All the data in the column will be lost.
  - You are about to drop the column `seat_first_class` on the `airplanes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FlightClass" AS ENUM ('FIRSTCLASS', 'BUSINESS', 'ECONOMY');

-- AlterTable
ALTER TABLE "airplanes" DROP COLUMN "seat_business",
DROP COLUMN "seat_economy",
DROP COLUMN "seat_economy_premium",
DROP COLUMN "seat_first_class";

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "class" "FlightClass" NOT NULL DEFAULT 'FIRSTCLASS';
