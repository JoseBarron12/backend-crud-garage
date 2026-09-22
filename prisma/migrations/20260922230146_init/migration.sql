/*
  Warnings:

  - You are about to drop the column `hashPassword` on the `employee` table. All the data in the column will be lost.
  - Added the required column `hashpassword` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "hashPassword",
ADD COLUMN     "hashpassword" VARCHAR(255) NOT NULL;
