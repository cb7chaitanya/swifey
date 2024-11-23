-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "college" TEXT NOT NULL,
    "currentEmployment" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
