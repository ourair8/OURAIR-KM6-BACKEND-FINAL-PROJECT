/*
  Warnings:

  - You are about to drop the column `title` on the `passengers` table. All the data in the column will be lost.
  - Added the required column `ticket_price` to the `flights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "ticket_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "title";
