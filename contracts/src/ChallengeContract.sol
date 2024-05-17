// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
}

// Interface for Uma Oracle
interface IOracle {
    function assertChallenge(address contractAddress, string memory userId) external returns (bytes32);
    function getChallenge(bytes32 assertionId) external returns (bool, address, string memory);
}

/**
 * @title Challenge Contract
 */

contract ChallengeContract {
    IERC20 public token; // ApeCoin token address
    IOracle public oracle = IOracle(0x0E1442d98ce998a25825D68FDB99f4A42B8872e8); // Uma Oracle address

	// Enum for allowed time units
	enum TimeUnit {
		Hour,
		Day,
		Week,
		Month,
		Year
	}

	// Challenge data structure
	struct Challenge {
		address owner;
		uint256 wagerAmount;
		address[] participants;
		string[] participantsLensIds;
		address[] judges;
		string[] judgesLensIds;
		string activity;
		TimeUnit completionTimeUnit;
		uint256 activityPerTimeUnit;
		uint256 duration;
        mapping(address => uint256) tokenDeposits;
		ChallengeState state;
	}

	// Struct to hold participant and judge information
	struct UserInfo {
		address userAddress;
		string lensId;
	}

    // Struct to hold the withdrawals
    struct Withdrawal {
        bool eligible;
        bool withdrawn;
    }

	// State of the challenge
	enum ChallengeState {
		Open,
		Active,
		Finished
	}

	// Challenge instance
	Challenge private challenge;

	// Mappings for addresses and Lens IDs
	mapping(address => string) private addressToParticipantLensId;
	mapping(string => address) private participantLensIdToAddress;
	mapping(address => string) private addressToJudgeLensId;
	mapping(string => address) private judgeLensIdToAddress;
    mapping(address => Withdrawal) private withdrawals;

	// Events
	event ChallengeContractCreated(address challengeAddress, address owner);
	event Deposit(address indexed participant, uint256 amount);
	event ChallengeStarted();
	event ChallengeFinished(address indexed winner);
    event TokensDeposited(address indexed participant, uint256 amount);
    event WithdrawalEvent(address indexed participant, uint256 amount);

	// Constructor
	constructor(
		address _owner,
		uint256 _wagerAmount,
		address[] memory _participants,
		string[] memory _participantsLensIds,
		address[] memory _judges,
		string[] memory _judgesLensIds,
		string memory _activity,
		string memory _completionTimeUnit,
		uint256 _activityPerTimeUnit,
		uint256 _duration,
        address _tokenAddress // Address of the ERC20 token contract
	) {
        token = IERC20(_tokenAddress); // Initialize the ERC20 token contract interface

		require(_participants.length > 0, "At least one participant required");
		require(_judges.length > 0, "At least one judge required");
		require(
			_participants.length == _participantsLensIds.length,
			"Participants and Lens IDs must match"
		);
		require(
			_judges.length == _judgesLensIds.length,
			"Judges and Lens IDs must match"
		);
		challenge.owner = _owner;
		challenge.wagerAmount = _wagerAmount;
		challenge.participants = _participants;
		challenge.participantsLensIds = _participantsLensIds;
		challenge.judges = _judges;
		challenge.judgesLensIds = _judgesLensIds;
		challenge.activity = _activity;
		challenge.completionTimeUnit = parseTimeUnit(_completionTimeUnit);
		challenge.activityPerTimeUnit = _activityPerTimeUnit;
		challenge.duration = _duration;
		challenge.state = ChallengeState.Open;

		// Populate the new mappings
		for (uint256 i = 0; i < _participants.length; i++) {
			addressToParticipantLensId[_participants[i]] = _participantsLensIds[
				i
			];
			participantLensIdToAddress[_participantsLensIds[i]] = _participants[
				i
			];
		}

		for (uint256 i = 0; i < _judges.length; i++) {
			addressToJudgeLensId[_judges[i]] = _judgesLensIds[i];
			judgeLensIdToAddress[_judgesLensIds[i]] = _judges[i];
		}

		emit ChallengeContractCreated(address(this), _owner);
	}

	// Function to parse time unit string to TimeUnit enum
	function parseTimeUnit(
		string memory _unit
	) internal pure returns (TimeUnit) {
		bytes32 hash = keccak256(abi.encodePacked(_unit));
		if (hash == keccak256(abi.encodePacked("hour"))) return TimeUnit.Hour;
		if (hash == keccak256(abi.encodePacked("day"))) return TimeUnit.Day;
		if (hash == keccak256(abi.encodePacked("week"))) return TimeUnit.Week;
		if (hash == keccak256(abi.encodePacked("month"))) return TimeUnit.Month;
		if (hash == keccak256(abi.encodePacked("year"))) return TimeUnit.Year;
		revert("Invalid time unit");
	}

	// Helper function to convert time units to strings
	function timeUnitToString(
		TimeUnit _unit
	) internal pure returns (string memory) {
		if (_unit == TimeUnit.Hour) {
			return "hour";
		} else if (_unit == TimeUnit.Day) {
			return "day";
		} else if (_unit == TimeUnit.Week) {
			return "week";
		} else if (_unit == TimeUnit.Month) {
			return "month";
		} else if (_unit == TimeUnit.Year) {
			return "year";
		} else {
			revert("Invalid time unit");
		}
	}

	// Modifiers
	modifier onlyParticipant() {
		require(isParticipant(msg.sender), "Caller is not a participant");
		_;
	}

	modifier onlyJudge() {
		require(isJudge(msg.sender), "Caller is not a judge");
		_;
	}

	modifier inState(ChallengeState _state) {
		require(challenge.state == _state, "Challenge in wrong state");
		_;
	}

    // Function to deposit ERC20 tokens
    function depositWagerTokens(uint256 _amount) external onlyParticipant inState(ChallengeState.Open) {
        // require(_amount >= challenge.wagerAmount * 1e18, "Wager amount too small");
        require(_amount >= challenge.wagerAmount, "Wager amount too small");
        
        // Transfer the tokens from the participant to the contract
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        
        challenge.tokenDeposits[msg.sender] += _amount;
        emit TokensDeposited(msg.sender, _amount);

        if (allParticipantsDeposited()) {
            challenge.state = ChallengeState.Active;
            emit ChallengeStarted();
        }
    }

    // Withdraw function to let participants withdraw their share
    function withdrawShare() external onlyParticipant inState(ChallengeState.Finished) {
        uint256 totalPool = token.balanceOf(address(this));
        require(totalPool > 0, "No funds to withdraw");

        uint256 participantCount = challenge.participants.length;
        require(participantCount > 0, "No participants");

        uint256 share = totalPool / participantCount;
        require(share > 0, "Share is too small");

        require(challenge.tokenDeposits[msg.sender] > 0, "No deposit to withdraw");

        challenge.tokenDeposits[msg.sender] = 0; // Prevent re-entrancy
        require(token.transfer(msg.sender, share), "Withdrawal failed"); // Transfer the share to the participant

        emit WithdrawalEvent(msg.sender, share);
    }


	// Check whether the caller is a participant
	function isParticipant(address _addr) public view returns (bool) {
		return contains(challenge.participants, _addr);
	}

    // Check whether the lensId is a participant
    function isParticipantByLensId(string memory _lensId) public view returns (bool) {
        address participantAddress = participantLensIdToAddress[_lensId];
        return contains(challenge.participants, participantAddress);
    }

	// Check whether the caller is a judge
	function isJudge(address _addr) public view returns (bool) {
		return contains(challenge.judges, _addr);
	}

    // Check whether the lensId is a judge
    function isJudgeByLensId(string memory _lensId) public view returns (bool) {
        address judgeAddress = judgeLensIdToAddress[_lensId];
        return contains(challenge.judges, judgeAddress);
    }

	// Function to declare the winner
	function declareWinner(
		address _winner
	) external onlyJudge inState(ChallengeState.Active) {
		require(isParticipant(_winner), "Winner must be a participant");

		challenge.state = ChallengeState.Finished;
		uint256 prizePool = address(this).balance;

		// Transfer the prize pool to the winner
		(bool success, ) = _winner.call{ value: prizePool }("");
		require(success, "Transfer to winner failed");

		emit ChallengeFinished(_winner);
	}

    function withdrawWinnings(string memory userId) external onlyParticipant inState(ChallengeState.Finished) {
        require(!withdrawals[msg.sender].withdrawn, "Already withdrawn");
        
        // First, assert the challenge passing in this contract's address and the user ID
        bytes32 assertionId = oracle.assertChallenge(address(this), userId); // Getting assertion from Uma Oracle

        // Then, retrieve the challenge status using the assertion ID. (Assuming synchronous result for simplicity)
        (bool eligible, address challengeId, string memory resolvedUserId) = oracle.getChallenge(assertionId); // Calling Uma Oracle

        require(eligible, "Not eligible for withdrawal");
        require(challengeId == address(this), "Challenge ID mismatch");
        require(keccak256(abi.encodePacked(resolvedUserId)) == keccak256(abi.encodePacked(userId)), "User ID mismatch");

        withdrawals[msg.sender].eligible = true;
        withdrawals[msg.sender].withdrawn = true;
        
        // Set the participant's deposit to 0 to prevent re-entrancy
        uint256 amount = challenge.tokenDeposits[msg.sender];
        challenge.tokenDeposits[msg.sender] = 0;

        // Transfer the tokens to the participant
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        
        emit WithdrawalEvent(msg.sender, amount);
    }

	// Utility function to check if an address is in an array of addresses
	function contains(
		address[] memory array,
		address _addr
	) internal pure returns (bool) {
		for (uint256 i = 0; i < array.length; i++) {
			if (array[i] == _addr) {
				return true;
			}
		}
		return false;
	}

	// Checks if all participants have deposited the wager amount
	function allParticipantsDeposited() internal view returns (bool) {
		for (uint256 i = 0; i < challenge.participants.length; i++) {
			if (
				challenge.tokenDeposits[challenge.participants[i]] <
				challenge.wagerAmount
			) {
				return false;
			}
		}
		return true;
	}

	function getOwner() public view returns (address) {
		return challenge.owner;
	}

	function getWagerAmount() public view returns (uint256) {
		return challenge.wagerAmount;
	}

	function getParticipants() public view returns (address[] memory) {
		return challenge.participants;
	}

	function getParticipantsLensIds() public view returns (string[] memory) {
		return challenge.participantsLensIds;
	}

	function getJudges() public view returns (address[] memory) {
		return challenge.judges;
	}

	function getJudgesLensIds() public view returns (string[] memory) {
		return challenge.judgesLensIds;
	}

	function getActivity() public view returns (string memory) {
		return challenge.activity;
	}

	function getCompletionTimeUnit() public view returns (string memory) {
		return timeUnitToString(challenge.completionTimeUnit);
	}

	function getActivityPerTimeUnit() public view returns (uint256) {
		return challenge.activityPerTimeUnit;
	}

	function getDuration() public view returns (uint256) {
		return challenge.duration;
	}

	function getParticipantByAddress(
		address participant
	) public view returns (UserInfo memory) {
		string memory lensId = addressToParticipantLensId[participant];
		return UserInfo({ userAddress: participant, lensId: lensId });
	}

	function getParticipantByLensId(
		string memory lensId
	) public view returns (UserInfo memory) {
		address participant = participantLensIdToAddress[lensId];
		return UserInfo({ userAddress: participant, lensId: lensId });
	}

	function getJudgeByAddress(
		address judge
	) public view returns (UserInfo memory) {
		string memory lensId = addressToJudgeLensId[judge];
		return UserInfo({ userAddress: judge, lensId: lensId });
	}

	function getJudgeByLensId(
		string memory lensId
	) public view returns (UserInfo memory) {
		address judge = judgeLensIdToAddress[lensId];
		return UserInfo({ userAddress: judge, lensId: lensId });
	}
}
