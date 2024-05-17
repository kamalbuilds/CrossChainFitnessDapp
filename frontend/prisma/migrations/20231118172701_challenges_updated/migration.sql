/*
  Warnings:

  - You are about to drop the column `progress` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "progress",
DROP COLUMN "userId",
ADD COLUMN     "activity" TEXT,
ADD COLUMN     "activityPerTimeUnit" INTEGER,
ADD COLUMN     "completionTimeUnit" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "judges" TEXT,
ADD COLUMN     "judgesLensIds" TEXT,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "participants" TEXT,
ADD COLUMN     "participantsLensIds" TEXT,
ADD COLUMN     "tokenAddress" TEXT,
ADD COLUMN     "wagerAmount" INTEGER;
