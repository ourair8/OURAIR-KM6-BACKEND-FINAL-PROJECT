/*
  Warnings:

  - A unique constraint covering the columns `[seat_id]` on the table `flights` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_from_id_fkey";

-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_to_id_fkey";

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "seat_id" SERIAL NOT NULL,
ALTER COLUMN "from_id" DROP NOT NULL,
ALTER COLUMN "to_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "flights_seat_id_key" ON "flights"("seat_id");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "airports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "airports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
