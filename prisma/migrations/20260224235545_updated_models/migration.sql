/*
  Warnings:

  - You are about to drop the column `doctorScheduleId` on the `appoinments` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `appoinments` table. All the data in the column will be lost.
  - The primary key for the `doctor_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `appoinmentId` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `followUpDate` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `medical_reports` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startData` on the `schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `appoinments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `appoinments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportLink` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportName` to the `medical_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDataTime` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appoinments" DROP CONSTRAINT "appoinments_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "appoinments" DROP CONSTRAINT "appoinments_doctorScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "appoinments" DROP CONSTRAINT "appoinments_patiendId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_appoinmentId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_patientId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_appoinmentId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_patientId_fkey";

-- DropIndex
DROP INDEX "appoinments_doctorScheduleId_key";

-- DropIndex
DROP INDEX "doctor_schedules_doctorId_scheduleId_key";

-- DropIndex
DROP INDEX "medical_reports_appoinmentId_key";

-- AlterTable
ALTER TABLE "appoinments" DROP COLUMN "doctorScheduleId",
DROP COLUMN "startDate",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_pkey",
DROP COLUMN "id",
ALTER COLUMN "isBooked" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "appoinmentId",
DROP COLUMN "diagnosis",
DROP COLUMN "followUpDate",
DROP COLUMN "treatment",
ADD COLUMN     "reportLink" TEXT NOT NULL,
ADD COLUMN     "reportName" TEXT NOT NULL,
ALTER COLUMN "doctorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "endDate",
DROP COLUMN "startData",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDataTime" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "pyaments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "transactionId" UUID NOT NULL,
    "stripeEventid" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentGatewayData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appoinmentId" TEXT NOT NULL,

    CONSTRAINT "pyaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appoinmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pyaments_transactionId_key" ON "pyaments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "pyaments_stripeEventid_key" ON "pyaments"("stripeEventid");

-- CreateIndex
CREATE UNIQUE INDEX "pyaments_appoinmentId_key" ON "pyaments"("appoinmentId");

-- CreateIndex
CREATE INDEX "pyaments_appoinmentId_idx" ON "pyaments"("appoinmentId");

-- CreateIndex
CREATE INDEX "pyaments_transactionId_idx" ON "pyaments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_appoinmentId_key" ON "prescriptions"("appoinmentId");

-- CreateIndex
CREATE INDEX "prescriptions_appoinmentId_idx" ON "prescriptions"("appoinmentId");

-- CreateIndex
CREATE INDEX "prescriptions_patientId_idx" ON "prescriptions"("patientId");

-- CreateIndex
CREATE INDEX "prescriptions_doctorId_idx" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "appoinments_scheduleId_key" ON "appoinments"("scheduleId");

-- CreateIndex
CREATE INDEX "appoinments_patiendId_idx" ON "appoinments"("patiendId");

-- CreateIndex
CREATE INDEX "appoinments_doctorId_idx" ON "appoinments"("doctorId");

-- CreateIndex
CREATE INDEX "appoinments_scheduleId_idx" ON "appoinments"("scheduleId");

-- CreateIndex
CREATE INDEX "appoinments_status_idx" ON "appoinments"("status");

-- CreateIndex
CREATE INDEX "doctor_schedules_doctorId_idx" ON "doctor_schedules"("doctorId");

-- CreateIndex
CREATE INDEX "doctor_schedules_scheduleId_idx" ON "doctor_schedules"("scheduleId");

-- CreateIndex
CREATE INDEX "medical_reports_patientId_idx" ON "medical_reports"("patientId");

-- CreateIndex
CREATE INDEX "reviews_appoinmentId_idx" ON "reviews"("appoinmentId");

-- CreateIndex
CREATE INDEX "reviews_patientId_idx" ON "reviews"("patientId");

-- CreateIndex
CREATE INDEX "reviews_doctorId_idx" ON "reviews"("doctorId");

-- AddForeignKey
ALTER TABLE "appoinments" ADD CONSTRAINT "appoinments_patiendId_fkey" FOREIGN KEY ("patiendId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appoinments" ADD CONSTRAINT "appoinments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appoinments" ADD CONSTRAINT "appoinments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyaments" ADD CONSTRAINT "pyaments_appoinmentId_fkey" FOREIGN KEY ("appoinmentId") REFERENCES "appoinments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appoinmentId_fkey" FOREIGN KEY ("appoinmentId") REFERENCES "appoinments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appoinmentId_fkey" FOREIGN KEY ("appoinmentId") REFERENCES "appoinments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
