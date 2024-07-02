-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FlightType" AS ENUM ('DOMESTIC', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "FlightClass" AS ENUM ('FIRSTCLASS', 'BUSINESS', 'ECONOMY');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_Verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL,
    "avatar_link" TEXT,
    "googleId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "otp_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "airline_code" VARCHAR(255) NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airplanes" (
    "id" SERIAL NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "airplane_code" VARCHAR(150) NOT NULL,
    "total_seat" INTEGER NOT NULL DEFAULT 150,
    "baggage" INTEGER NOT NULL,
    "cabin_baggage" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "airplanes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "cityCode" VARCHAR(20) NOT NULL,
    "cityName" VARCHAR(150) NOT NULL,
    "countryCode" VARCHAR(150) NOT NULL,
    "countryName" VARCHAR(150) NOT NULL,
    "city" BOOLEAN NOT NULL,
    "total_visited" INTEGER,
    "thumbnail" TEXT,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 4.5,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "airplane_id" INTEGER NOT NULL,
    "from_id" INTEGER,
    "to_id" INTEGER,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "flight_type" "FlightType" NOT NULL DEFAULT 'DOMESTIC',
    "class" "FlightClass" NOT NULL DEFAULT 'FIRSTCLASS',
    "ticket_price" INTEGER NOT NULL,
    "seat_id" SERIAL NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'adult',
    "nationality" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "country_publication" TEXT NOT NULL,
    "document_expired" TIMESTAMP(3) NOT NULL,
    "seat_number" TEXT NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "passanger_id" INTEGER NOT NULL,
    "flight_id" INTEGER,
    "transaction_id" INTEGER,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "midtrans_order_id" TEXT,
    "adult_price" INTEGER NOT NULL,
    "baby_price" INTEGER NOT NULL,
    "tax_price" INTEGER NOT NULL,
    "donation" INTEGER DEFAULT 0,
    "total_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,
    "status" BOOLEAN NOT NULL,
    "payment_link" TEXT,
    "booker_id" INTEGER,
    "total_baby" INTEGER,
    "flight_id" INTEGER,
    "transaction_token" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "payment_type" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookers" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "bookers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "flights_seat_id_key" ON "flights"("seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_passanger_id_key" ON "tickets"("passanger_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_midtrans_order_id_key" ON "transactions"("midtrans_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airplanes" ADD CONSTRAINT "airplanes_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "airports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "airports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplanes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_passanger_id_fkey" FOREIGN KEY ("passanger_id") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_booker_id_fkey" FOREIGN KEY ("booker_id") REFERENCES "bookers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
