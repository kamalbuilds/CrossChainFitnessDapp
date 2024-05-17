"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  USDCCOIN_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
} from "@/constants";
import { prepareWriteContract, writeContract } from "@wagmi/core";
// import { create } from "ipfs-http-client";
import { useState } from "react";
import { Address, useAccount } from "wagmi";
import FactorContractABI from "../../abi/Factory.json";
import { useRouter } from "next/navigation";

export default function NewPage() {
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
        judgesLensId,
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
        if (confirm("Challenge created successfully")) {
          router.push("/my-challenges");
        }
      }
    } catch (error) {
      console.error("error while creating a challenge: ", error);
      alert("Error while creating a challenge");
    } finally {
      setLoading(false);
    }
  };

  // const uploadToIpfs = async () => {
  //   const challenge = [
  //     address,
  //     wagerAmount,
  //     // description,
  //     participants,
  //     participantsLensId,
  //     judges,
  //     judgesLensId,
  //     activity,
  //     completionTimeUnit,
  //     amountOfActivityPerTimeUnit,
  //     duration,
  //     USDCCOIN_CONTRACT_ADDRESS as Address,
  //   ];

  //   const client = create({ url: "https://ipfs.io/ipfs/" });
  //   const res = await client.add(JSON.stringify(challenge));
  //   console.log(res);
  // };

  return (
    <main className="px-10 py-14 mx-auto flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">New Challenge</h1>

      <div className="flex gap-4 items-center justify-center mx-auto mt-4">
        <span>I want to do</span>
        <Input
          type="number"
          value={amountOfActivityPerTimeUnit}
          onChange={(e) =>
            setAmountOfActivityPerTimeUnit(parseInt(e.target.value))
          }
          className="w-20"
        />
        <Input
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-30"
        />
        <span>every</span>
        <Input
          value={completionTimeUnit}
          onChange={(e) => setCompletionTimeUnit(e.target.value)}
          className="w-20"
        />
      </div>

      <div className="flex gap-4 items-center justify-center mt-4">
        <span>for</span>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-20"
        />
        <span>{completionTimeUnit}s</span>
      </div>

      <div className="flex gap-4 items-center justify-center mt-4">
        <span>Wager</span>
        <Input
          type="number"
          value={wagerAmount}
          onChange={(e) => setWagerAmount(parseInt(e.target.value))}
          className="w-20"
        />
        <span>USDC Coin</span>
      </div>

      <div className="flex gap-4 items-center justify-center mt-4">
        <span>Participants</span>
        <Input
          value={participants.join(",")}
          onChange={(e) => setParticipants(e.target.value.split(","))}
          className="w-30"
        />
      </div>
      <div className="flex gap-4 items-center justify-center mt-4">
        <span>Participants Lens ID</span>
        <Input
          value={participantsLensId.join(",")}
          onChange={(e) => setParticipantsLensId(e.target.value.split(","))}
          className="w-30"
        />
      </div>

      <div className="flex gap-4 items-center justify-center mt-4">
        <span>Judges</span>
        <Input
          value={judges.join(",")}
          onChange={(e) => setJudges(e.target.value.split(","))}
          className="w-30"
        />
      </div>

      <div className="flex gap-4 items-center justify-center mt-4">
        <span>Judges Lens Id</span>
        <Input
          value={judgesLensId.join(",")}
          onChange={(e) => setJudgesLensId(e.target.value.split(","))}
          className="w-30"
        />
      </div>

      {loading ? (
        <div className="text-lg">Loading...</div>
      ) : (
        <>
          <Button onClick={onSubmit}>Create</Button>
          {/* <Button onClick={uploadToIpfs} className="mt-4 mx-auto">
            Upload to IPFS
          </Button> */}
        </>
      )}
    </main>
  );
}
