// Imports
// ========================================================
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Config
// ========================================================
const prisma = new PrismaClient();

// Endpoints
// ========================================================
/**
 * Read
 * @param request
 */
export const GET = async (
  _request: NextRequest,
  { params }: { params: { challengeId: string } }
) => {
  const { challengeId } = params;

  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
      },
    });

    if (!challenge) throw new Error("challenge not found.");

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
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }
};