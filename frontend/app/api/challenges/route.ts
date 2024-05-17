// Imports
// ========================================================
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Config
// ========================================================
const prisma = new PrismaClient();

/**
 * Create
 * @param request
 */
export const POST = async (request: NextRequest) => {
  // Get data
  const {
    contractAddress,
    ownerId,
    wagerAmount,
    participants,
    participantsLensIds,
    judges,
    judgesLensIds,
    activity,
    completionTimeUnit,
    activityPerTimeUnit,
    duration,
    tokenAddress,
  } = await request.json();

  try {
    // 1 - Create challenge
    const challenge = await prisma.challenge.create({
      data: {
        id: contractAddress,
        ownerId,
        wagerAmount,
        participants,
        participantsLensIds,
        judges,
        judgesLensIds,
        activity,
        completionTimeUnit,
        activityPerTimeUnit,
        duration,
        tokenAddress,
      },
    });

    // 2 - Create cronjob as a for loop
    const participantsSplit = participants.trim().split(",");
    for (let i = 0; i < participantsSplit.length; i++) {
    };

    return NextResponse.json(
      {
        data: challenge,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message ?? "Something went wrong",
      },
      {
        status: 200,
      }
    );
  }
};
