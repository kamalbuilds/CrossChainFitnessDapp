// Imports
// ========================================================
import { getAuthenticatedClient } from "@/app/utils/lens";
// import { LensClient, production } from "@lens-protocol/client";
// import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createWalletClient, http, createPublicClient } from "viem";
import { goerli } from "viem/chains";
import { ABI } from '../../utils/constants';
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";
import { LensClient, production } from "@lens-protocol/client";

// Config
// ========================================================
config();
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
 * Read
 * @param request
 */
export const GET = async (_request: NextRequest) => {
    try {
      const { request } = await publicClient.simulateContract({
          account,
          address: `${process.env.GOERLI_ORACLE_ADDRESS}` as `0x${string}`,
          abi: ABI,
          functionName: 'assertChallenge',
          args: [
            `${process.env.GOERLI_ORACLE_ADDRESS}` as `0x${string}`,
              '0x1234'
          ]
        });
        const result = await walletClient.writeContract(request);
    return NextResponse.json(
      {
        data: result,
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
