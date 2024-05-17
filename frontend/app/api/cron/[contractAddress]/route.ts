// Imports
// ========================================================
import { LensClient, production } from "@lens-protocol/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createWalletClient, http, createPublicClient } from "viem";
import { goerli } from "viem/chains";
import { ABI } from '../../../utils/constants';
import { privateKeyToAccount } from "viem/accounts";

// Config
// ========================================================
const prisma = new PrismaClient();
const client = new LensClient({
  environment: production,
});
const account = privateKeyToAccount(
  `${process.env.WALLET_PRIVATE_KEY}` as `0x${string}`
);
const walletClient = createWalletClient({
  chain: goerli,
  account,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

// Endpoints
// ========================================================
/**
 * Create
 * @param request
 */
export const POST = async (request: NextRequest,
  { params }: { params: { contractAddress: string } }) => {
    const { contractAddress } = params;
  const { lensId } = await request.json();

  try {
    
    // 1 - Confirm that the challenge exists
    const challenge = await prisma.challenge.findFirstOrThrow({
      where: {
        id: contractAddress
      },
    });

    if (!challenge) throw new Error("challenge not found.");
    // 2 - See if the challenge is already complete
    // @TODO

    // 3 - Grab latest post
    console.log({ lensId });
    const result = await client.publication.fetchAll({
      where: {
        from: [lensId], // "0x2a20"
      },
    });

    // 4 - Check if reaction and if so update oracle
    if (result?.items?.[0]?.stats?.upvoteReactions > 0) {
      // Do something
    }
  
    // Make request
    return NextResponse.json(
      {
        data: result?.items?.[0]?.metadata,
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

// /**
//  * Read
//  * @param request
//  */
// export const GET = async (
//   _request: NextRequest,
//   { params }: { params: { challengeId: string } }
// ) => {
//   const { challengeId } = params;

//   try {
//     const challenge = await prisma.challenge.findUnique({
//       where: {
//         id: challengeId,
//       },
//     });

//     if (!challenge) throw new Error("challenge not found.");

//     return NextResponse.json(
//       {
//         data: challenge,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         message: error.message,
//       },
//       {
//         status: 404,
//       }
//     );
//   }
// };