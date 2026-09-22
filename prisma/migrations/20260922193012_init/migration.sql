-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('COMPLETED', 'INPROGRESS', 'PENDING', 'CANCELED', 'PAUSED');

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "desc" VARCHAR(500) NOT NULL,
    "costCent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doneAt" TIMESTAMP(3) NOT NULL,
    "progress" "Progress" NOT NULL DEFAULT 'PENDING',
    "employeeId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
