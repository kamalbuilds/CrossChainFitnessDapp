export const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "AddressEmptyCode",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AddressInsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "FailedInnerCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "challengeId",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			}
		],
		"name": "ChallengeAsserted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "challengeId",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			}
		],
		"name": "ChallengeAssertionResolved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "challengeId",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			}
		],
		"name": "assertChallenge",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "assertionLiveness",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "attesterAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			}
		],
		"name": "challengeDisputedCallback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			},
			{
				"internalType": "bool",
				"name": "assertedTruthfully",
				"type": "bool"
			}
		],
		"name": "challengeResolvedCallback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "defaultCurrency",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "defaultIdentifier",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "assertionId",
				"type": "bytes32"
			}
		],
		"name": "getChallenge",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "oo",
		"outputs": [
			{
				"internalType": "contract OptimisticOracleV3Interface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]