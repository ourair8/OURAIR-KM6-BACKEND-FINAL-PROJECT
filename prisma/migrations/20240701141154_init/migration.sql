/*
  Warnings:

  - You are about to drop the column `session_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transaction_token" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "session_token";
