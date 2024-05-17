-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "progress" JSONB,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);
