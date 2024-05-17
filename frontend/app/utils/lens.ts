// Imports
// ========================================================
import { LensClient, production } from "@lens-protocol/client";
// import { type WalletClient } from "viem";
import { type Wallet } from "ethers";

export async function getAuthenticatedClient(wallet: Wallet, profileId: string) {
  const lensClient = new LensClient({
    environment: production,
  });

  const address = await wallet.getAddress();

  if (!address) throw new Error("No address found");

  const { id, text } = await lensClient.authentication.generateChallenge({
    signedBy: address,
    for: profileId ?? "0x2a20",
  });
//   console.log({ id, text });
  const signature = await wallet.signMessage(text);
//   console.log({ signature })
  await lensClient.authentication.authenticate({ id, signature });
  console.log({ isAuthenticated: lensClient.authentication.isAuthenticated() });

  return lensClient;
};