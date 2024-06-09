-- DropIndex
DROP INDEX "users_phone_number_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL;
