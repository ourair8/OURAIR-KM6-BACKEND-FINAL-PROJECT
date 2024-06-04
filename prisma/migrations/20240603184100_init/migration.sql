/*
  Warnings:

  - A unique constraint covering the columns `[midtrans_order_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `midtrans_order_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_googleId_key";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "midtrans_order_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "googleId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_midtrans_order_id_key" ON "transactions"("midtrans_order_id");
