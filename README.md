# CrossChainFitnessDapp

Create a challenge and challenge your friends. A smart contracts keeps all the rules, keeps all the funds (in USDC!) and keeps all of you accountable.

Choose accountability judges who will verify your posts on Lens to validate the information onchain. Judges could be participants themselves or other appointed third-parties.

Upon creation of a new challenge, a post on Lens is created with a summary. Lens is also where the attestation happens: you post your proof and your challenge buddies (or judges) attest whether you've done it or not. When the challenge is over, the pot is split among those who have completed the challenge.

Example: I challenge my two friends that we will all do 50 push ups, every day, for 30 days. We create an Crosschainfit challenge which deploys a new smart contract and publishes a summary post on Lens. I choose ourselves as judges (self-accountability for the win!) We then post a proof of push ups every day on Lens, and we all attest on Lens if it counts or not. At the end of the 30 days whoever did 50 push ups every day for 30 days, gets to split the pot. Muscle gains, USDC gains, friendship gains!

How it's Made
We use @Lens for distribution, social proof, and attestations. Attestations from Lens are tracked by the UMA Optimistic Oracle. Funding of the challenge is done with USDC.

Strava: Strava is an exercise-tracking app. There are already 120 million users on Strava, and they can be easily onboard Web3 with good UX. 

We use Strava API to authenticate and retrieve users’ sports activities and sign the activity ID and verify the signature on the chain. Once the user has enough proof collected, they will be able to finish the challenge.

We use a NextJS App that deploys a custom escrow contract for the challenge, with participant Lens handles, judges, the USDC amount, and criteria requirements, and more.

Our backend cron service is notified by QuickNode QuickAlerts when a new contract is created, pulls in the data of the challenge to start polling the Lens API for specific Lens posts from the participants.

If the backend determines that the participant has met the requirements of posting or meeting physical challenge of a certain period of time, it will update the UMA optimistic oracle so that it can influence the outcome of the challenge and the withdrawal functionality of the challenge contract.

At the end of the challenge smart contract queries the UMA Oracle to verify who won and who can or cannot withdraw the winnings.


### Chainlink services utilsed
