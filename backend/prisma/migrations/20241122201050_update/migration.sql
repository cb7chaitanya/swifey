/*
  Warnings:

  - You are about to drop the column `DOB` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `college` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currentEmployment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "StakingStatus" AS ENUM ('PENDING', 'ACTIVE', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "StakingTransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'PREFER_NOT_TO_SAY';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "DOB",
DROP COLUMN "college",
DROP COLUMN "currentEmployment",
DROP COLUMN "role",
ADD COLUMN     "currentlyWorking" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "graduatedFrom" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "verificationDetails" JSONB,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "stakingStatus" "StakingStatus" NOT NULL DEFAULT 'PENDING',
    "connectionDate" TIMESTAMP(3),
    "chatHistoryRetained" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakingTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StakingTransactionStatus" NOT NULL,

    CONSTRAINT "StakingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserConnections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserConnections_AB_unique" ON "_UserConnections"("A", "B");

-- CreateIndex
CREATE INDEX "_UserConnections_B_index" ON "_UserConnections"("B");

-- AddForeignKey
ALTER TABLE "StakingTransaction" ADD CONSTRAINT "StakingTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_A_fkey" FOREIGN KEY ("A") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
