/*
  Warnings:

  - A unique constraint covering the columns `[midtrans_order_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `midtrans_order_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "midtrans_order_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_midtrans_order_id_key" ON "transactions"("midtrans_order_id");
