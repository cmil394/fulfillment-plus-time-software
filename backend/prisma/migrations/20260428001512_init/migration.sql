/*
  Warnings:

  - A unique constraint covering the columns `[employeeCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_pin_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "employeeCode" TEXT,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeCode_key" ON "users"("employeeCode");
