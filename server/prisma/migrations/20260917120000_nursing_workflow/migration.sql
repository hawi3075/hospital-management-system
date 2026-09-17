-- Nursing workflow additions
CREATE TYPE "RoomStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'ISOLATION');

ALTER TABLE "Room" ADD COLUMN "section" TEXT NOT NULL DEFAULT 'Main ER';
ALTER TABLE "Room" ADD COLUMN "status" "RoomStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Room" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Admission" ADD COLUMN "assignedNurseId" TEXT;

CREATE TABLE "TriageAssessment" (
  "id" TEXT NOT NULL,
  "appointmentId" TEXT NOT NULL,
  "priority" "Priority" NOT NULL,
  "assessmentNotes" TEXT,
  "bloodPressure" TEXT,
  "heartRate" INTEGER,
  "temperature" DOUBLE PRECISION,
  "spo2" INTEGER,
  "respiratoryRate" INTEGER,
  "recordedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TriageAssessment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TriageAssessment_appointmentId_key" ON "TriageAssessment"("appointmentId");
ALTER TABLE "TriageAssessment" ADD CONSTRAINT "TriageAssessment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TriageAssessment" ADD CONSTRAINT "TriageAssessment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON UPDATE CASCADE;
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_assignedNurseId_fkey" FOREIGN KEY ("assignedNurseId") REFERENCES "User"("id") ON UPDATE CASCADE;