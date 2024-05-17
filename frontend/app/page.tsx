"use client";
import { useState } from "react";
import { Address, useAccount } from "wagmi";
import FactorContractABI from "../abi/Factory.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  USDCCOIN_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
} from "@/constants";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

enum PublicationMetadataMainFocusType {
  Article = "ARTICLE",
  Audio = "AUDIO",
  CheckingIn = "CHECKING_IN",
  Embed = "EMBED",
  Event = "EVENT",
  Image = "IMAGE",
  Link = "LINK",
  Livestream = "LIVESTREAM",
  Mint = "MINT",
  ShortVideo = "SHORT_VIDEO",
  Space = "SPACE",
  Story = "STORY",
  TextOnly = "TEXT_ONLY",
  ThreeD = "THREE_D",
  Transaction = "TRANSACTION",
  Video = "VIDEO",
}

export default function Home() {
  // State / Props
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const [wagerAmount, setWagerAmount] = useState<number>(0); // in matic
  const [participants, setParticipants] = useState<string[]>([]); // address
  const [participantsLensId, setParticipantsLensId] = useState<string[]>([]); // lens handles
  const [judges, setJudges] = useState<string[]>([]); // address handles
  const [judgesLensId, setJudgesLensId] = useState<string[]>([]); // address handles
  const [activity, setActivity] = useState<string>(""); // eg. pushups
  const [completionTimeUnit, setCompletionTimeUnit] = useState(""); // eg. hour / day / week / month / year
  const [amountOfActivityPerTimeUnit, setAmountOfActivityPerTimeUnit] =
    useState(0);
  const [duration, setDuration] = useState(0); // in competion time units
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    // log out the form values
    setLoading(true);

    try {
      const challenge = [
        address,
        wagerAmount,
        // description,
        participants,
        participantsLensId,
        judges,
        judges.map((judge) => "0x13i0"),
        // ["0x13i0"], "0x179s", // Judges lens id
        activity,
        completionTimeUnit,
        amountOfActivityPerTimeUnit,
        duration,
        USDCCOIN_CONTRACT_ADDRESS as Address,
      ];
      console.log(challenge);

      const config = await prepareWriteContract({
        address: FACTORY_CONTRACT_ADDRESS,
        abi: FactorContractABI,
        functionName: "createChallengeContract",
        args: challenge,
      });

      const { hash } = await writeContract(config);
      console.log(hash);

      if (hash) {
        alert("Challenge created successfully");
        router.push("/my-challenges");
      }
    } catch (error) {
      console.error("error while creating a challenge: ", error);
      alert("Error while creating a challenge");
    } finally {
      setLoading(false);
    }
  };

  const { open } = useWeb3Modal();

  return (
    <main className="text-white bg-zinc-950 h-screen w-full flex">
      <div
        className="w-1/2 h-screen bg-cover bg-bottom"
          style={{ backgroundImage: "url(/images/health.png)" }}
      >
        {/* <div className="p-8">
          <Image
            alt="CrossChainFitness logo"
            width={616}
            height={240}
            className="mx-auto block mt-72"
            src="/images/.svg"
          />
        </div> */}
      </div>
      <div className="w-1/2 overflow-y-auto pb-2">
        <div className="p-8 w-full h-screen">
          {isConnected ? (
            <div className="flex flex-col gap-10 items-end ">
              <h1 className="text-4xl mb-2 mx-auto text-white font-bold uppercase">
                Create Your CrossChainFitness Challenge
              </h1>
              <div className="p-4 w-full flex flex-col gap-3 w-3/4 items-end rounded-md border-2 border-gray-600 pl-10">
                <div className="flex items-center justify-between w-full gap-4 mt-4">
                  <span className=" w-max uppercase font-semibold text-xs text-zinc-500">
                    I want to do
                  </span>
                  <Input
                    type="number"
                    value={amountOfActivityPerTimeUnit}
                    onChange={(e) =>
                      setAmountOfActivityPerTimeUnit(parseInt(e.target.value))
                    }
                    className="w-full max-w-md text-black"
                  />
                </div>
                <div className="flex w-full items-center justify-between gap-4">
                  <span className=" w-max uppercase font-semibold text-xs text-zinc-500">
                    activity
                  </span>
                  <Input
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className=" w-3/4 max-w-md text-black"
                  />
                </div>
                <div className="flex w-full justify-between gap-4">
                  <span className=" uppercase font-semibold text-xs text-zinc-500">every</span>
                  <Input
                    value={completionTimeUnit}
                    onChange={(e) => setCompletionTimeUnit(e.target.value)}
                    className="w-full max-w-md text-black"
                  />
                </div>

                <div className="flex w-full justify-between gap-4 items-start mt-4">
                  <div className="flex gap-2">
                    <span className="uppercase font-semibold text-xs text-zinc-500">
                      for
                    </span>
                    <span className="uppercase font-semibold text-xs text-zinc-500">
                      {completionTimeUnit}s
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className=" w-3/4 max-w-md text-black"
                  />
                </div>
                {/* </div> */}

                <hr className="h-1 bg-gray-600 border-2 border-gray-600 w-full rounded" />
                {/* <div className="flex justify-between items-end flex-col gap-3 w-3/4 rounded-md border-gray-600 pl-10 p-4 border-2"> */}
                <div className="flex gap-4 items-start w-full justify-between mt-4">
                  <div className="flex gap-2">
                    <span className="uppercase font-semibold text-xs text-zinc-500">
                      Wager
                    </span>
                    <span className=" uppercase font-semibold text-xs text-zinc-500">
                      USDC Coin
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={wagerAmount}
                    onChange={(e) => setWagerAmount(parseInt(e.target.value))}
                    className=" w-3/4 max-w-md  text-black"
                  />
                </div>

                <div className="flex justify-between w-full  gap-4 items-start  mt-4">
                  <span className="uppercase font-semibold text-xs text-zinc-500">
                    Participants
                  </span>
                  <Input
                    value={participants.join(",")}
                    onChange={(e) => setParticipants(e.target.value.split(","))}
                    className="w-3/4 max-w-md  text-black"
                  />
                </div>
                <div className="flex justify-between w-full  gap-4 items-center mt-4">
                  <span className="uppercase font-semibold text-xs text-zinc-500">
                    Participants Lens ID
                  </span>
                  <Input
                    value={participantsLensId.join(",")}
                    onChange={(e) =>
                      setParticipantsLensId(e.target.value.split(","))
                    }
                    className=" w-3/4 max-w-md  text-black"
                  />
                </div>

                <div className="flex justify-between w-full  gap-4 items-start mt-4">
                  <span className="uppercase font-semibold text-xs text-zinc-500">
                    Judges
                  </span>
                  <Input
                    value={judges.join(",")}
                    onChange={(e) => setJudges(e.target.value.split(","))}
                    className=" w-3/4 max-w-md  text-black"
                  />
                </div>

                {/* <div className="flex justify-between w-full gap-4 items-start mt-4">
                  <span className="uppercase font-semibold text-xs text-zinc-500">
                    Judges Lens Id
                  </span>
                  <Input
                    value={judgesLensId.join(",")}
                    onChange={(e) => setJudgesLensId(e.target.value.split(","))}
                    className="w-3/4 max-w-md  text-black"
                  />
                </div> */}
              </div>

              <div className="mx-auto w-full mb-3">
                {loading ? (
                  <div className="text-lg">Loading...</div>
                ) : (
                  <>
                    <Button className="w-full" onClick={onSubmit}>Create</Button>
                    {/* <Button onClick={uploadToIpfs} className="mt-4 mx-auto">
      Upload to IPFS
    </Button> */}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full h-screen">
              <div className="text-center">
                <h1 className="text-4xl mb-2 text-white font-bold uppercase">
                  Start Here
                </h1>
                <p className="text-xl mb-8 text-zinc-300">
                  Getting Fit starts with connecting...
                </p>
                <Button onClick={() => open()}>Connect Wallet</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
