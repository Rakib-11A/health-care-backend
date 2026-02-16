/*
  Warnings:

  - You are about to drop the `doctorSpeciality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctorSpeciality" DROP CONSTRAINT "doctorSpeciality_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctorSpeciality" DROP CONSTRAINT "doctorSpeciality_specialityId_fkey";

-- DropTable
DROP TABLE "doctorSpeciality";

-- CreateTable
CREATE TABLE "doctor_Specialities" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_Specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_doctorId" ON "doctor_Specialities"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_specialityId" ON "doctor_Specialities"("specialityId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_Specialities_doctorId_specialityId_key" ON "doctor_Specialities"("doctorId", "specialityId");

-- AddForeignKey
ALTER TABLE "doctor_Specialities" ADD CONSTRAINT "doctor_Specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_Specialities" ADD CONSTRAINT "doctor_Specialities_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
