-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_flight_id_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "flight_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;
