-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_transaction_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "transaction_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
