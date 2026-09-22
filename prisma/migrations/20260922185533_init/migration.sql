/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- DropTable
DROP TABLE "Employee";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "username" VARCHAR(255) NOT NULL,
    "hashPassword" VARCHAR(255) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");
