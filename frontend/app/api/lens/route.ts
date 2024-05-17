// Imports
// ========================================================
import { getAuthenticatedClient } from "@/app/utils/lens";
// import { LensClient, production } from "@lens-protocol/client";
// import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { type Hex, createWalletClient, http} from "viem";
// import { polygon } from "viem/chains";
// import { privateKeyToAccount } from 'viem/accounts' 
import { config } from "dotenv";
import { LensClient, production } from "@lens-protocol/client";

// Config
// ========================================================
config();
const client = new LensClient({
  environment: production,
});
// // const prisma = new PrismaClient();
// const account = privateKeyToAccount(`${process.env.WALLET_PRIVATE_KEY}` as `0x${string}`);
// const walletClient = createWalletClient({
//     chain: polygon,
//     account,
//     transport: http()
// });
// const wallet = new Wallet(`${process.env.WALLET_PRIVATE_KEY}`);

// Endpoints
// ========================================================
/**
 * Read
 * @param request
 */
export const GET = async (
  _request: NextRequest
  //   { params }: { params: { challengeId: string } }
) => {
  //   const { challengeId } = params;

  try {
//     console.log('HELLLLLLLO');
    // const lensClient = await getAuthenticatedClient(wallet, "0x2a20");

    // const feedResult = await lensClient.feed.fetch({
    //     where: {
    //       for: "0x2a20",
    //     },
    //   });
    // const challenge = await prisma.challenge.findUnique({
    //   where: {
    //     id: challengeId,
    //   },
    // });
    const result = await client.publication.fetchAll({
      where: {
        from: ["0x2a20"],
      },
    });
  
    // console.log({ items: result?.items });
    // console.log({ items:  });
    // if (!challenge) throw new Error("challenge not found.");

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
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }
};
