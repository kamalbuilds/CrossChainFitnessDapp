"use client";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { CHALLENGE_CONTRACT_ADDRESS } from "@/constants";
import ChallengeContractABI from '../../abi/ChallengeContract.json'

export default function MyChallangesPage() {
  const [loading, setLoading] = useState(false);
  const [withdrawSuccessful, setWithdrawSuccessful] = useState(false);
  const challenges = [
    {
      amount: 10,
      participants: [
        "0x0c12522fCDa861460BF1BC223eCa108144EE5Df4",
        "0x8D97689C9818892B700e27F316cc3E41e17fBeb9",
      ],
      participantsLensId: ["0x9624", "0x115057"],
      activity: "pushups",
      completionTimeUnit: "day",
      amountOfActivityPerTimeUnit: 10,
      duration: 10,
      judges: [
        "0x0c12522fCDa861460BF1BC223eCa108144EE5Df4",
        "0x8D97689C9818892B700e27F316cc3E41e17fBeb9",
      ],
      judgesLensId: ["0x9624", "0x115057"],
    },
  ];

  useEffect(() => {
    withdrawSuccessful &&
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2
      }
    });
    
  }, [withdrawSuccessful]);

  const withdraw = async (e) => {
    e.preventDefault();
    console.log("withdraw");
    setLoading(true);

   try {
    const config = await prepareWriteContract({
      address: CHALLENGE_CONTRACT_ADDRESS,
      abi: ChallengeContractABI,
      functionName: "withdrawShare",
      args: [],
    });

    const {hash } =await writeContract(config);
    console.log(hash);
   } catch (error) {
    console.log(error);
   }
    setTimeout(() => {
      setWithdrawSuccessful(true);
      setLoading(false);
    }, 1500);
  };
  return (
    <main className="px-10 text-center py-14 w-screen h-screen overflow-hidden bg-black">
      <h1 className="text-3xl text-white mb-10 text-center font-sans uppercase font-bold">
        My Challenges
      </h1>
      {loading ? (
          <Loader />
      ) : withdrawSuccessful ? (
        <div className="text-white text-lg mt-1/2 font-semibold">
          Stake Withdrawan successfully 🎊
        </div>
      ) : (
        <>
          {challenges.map((challenge, index) => (
            <div className="flex flex-col gap-5  mb-2 items-center" key={index}>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  I am gonna do:{" "}
                </span>
                <span className="text-lg text-white font-bold uppercase">
                  {challenge.amountOfActivityPerTimeUnit} {challenge.activity}
                </span>
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  For:{" "}
                </span>
                <span className="text-lg  text-white font-bold uppercase">
                  {challenge.duration} {challenge.completionTimeUnit}s
                </span>
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  Wager:{" "}
                </span>
                <span className="text-lg  text-white font-bold uppercase">
                  {challenge.amount} USDC Coin
                </span>
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  Participants:{" "}
                </span>
                {/* show participants on individual line */}
                {challenge.participants.map((participant, index) => (
                  <p
                    className="text-lg  text-white font-bold uppercase"
                    key={index}
                  >
                    {participant}
                  </p>
                ))}
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  Participants Lens ID:{" "}
                </span>
                <div>
                  {challenge.participantsLensId.map(
                    (participantLensId, index) => (
                      <p
                        className="text-lg  text-white font-bold uppercase"
                        key={index}
                      >
                        {participantLensId}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  Judges:{" "}
                </span>
                {challenge.judges.map((judge, index) => (
                  <div key={index}>
                    <span className="text-lg  text-white font-bold uppercase">
                      {judge}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <span className="text-md text-zinc-500 font-semibold">
                  Judges Lens ID:{" "}
                </span>
                {challenge.judgesLensId.map((judgeLensId, index) => (
                  <div key={index}>
                    <p className="text-lg  text-white font-bold uppercase">
                      {judgeLensId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="w-full">
            <Button className="w-8/12 m-auto" onClick={withdraw}>
              Withdraw your stake
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
