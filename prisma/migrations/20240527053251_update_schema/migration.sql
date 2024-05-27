/*
  Warnings:

  - You are about to drop the `ticket_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction_histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ticket_transactions" DROP CONSTRAINT "ticket_transactions_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_transactions" DROP CONSTRAINT "ticket_transactions_transaction_id_fkey";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "transaction_id" INTEGER;

-- DropTable
DROP TABLE "ticket_transactions";

-- DropTable
DROP TABLE "transaction_histories";

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "payment_type" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
