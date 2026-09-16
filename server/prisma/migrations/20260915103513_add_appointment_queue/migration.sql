-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'CALLED', 'COMPLETED', 'SKIPPED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AppointmentStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "AppointmentStatus" ADD VALUE 'WAITING';
ALTER TYPE "AppointmentStatus" ADD VALUE 'IN_CONSULTATION';

-- CreateTable
CREATE TABLE "QueueEntry" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "queueDate" TIMESTAMP(3) NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "calledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueueEntry_appointmentId_key" ON "QueueEntry"("appointmentId");

-- CreateIndex
CREATE INDEX "QueueEntry_queueDate_status_idx" ON "QueueEntry"("queueDate", "status");

-- CreateIndex
CREATE UNIQUE INDEX "QueueEntry_queueDate_token_key" ON "QueueEntry"("queueDate", "token");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_date_idx" ON "Appointment"("doctorId", "date");

-- CreateIndex
CREATE INDEX "Appointment_patientId_date_idx" ON "Appointment"("patientId", "date");

-- CreateIndex
CREATE INDEX "Appointment_status_date_idx" ON "Appointment"("status", "date");

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
