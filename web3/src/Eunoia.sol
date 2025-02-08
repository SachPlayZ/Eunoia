// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Eunoia {
    /**Errors */
    error Eunoia__humanInsufficientPayment();
    error Eunoia__aiInsufficientPayment();
    error Eunoia__TherapistAlreadyExists();

    /**Type Declarations */
    struct humanTherapist {
        string name;
        address walleta;
        uint256 voteCount;
        uint256 funding;
    }

    struct VoteInfo {
        address voter;
        uint256[] votes;
        uint256 totalVotes;
    }

    /**State Variables */
    address immutable aiTherapistWallet;
    uint256 private totalVotes;
    uint256 private totalAmount;
    address[] private s_therapist;

    mapping(address => humanTherapist) private human;
    mapping(address => mapping(address => VoteInfo)) private therapistVoters;
    mapping(address => address[]) private therapistVoterList;

    /**Events */
    event TherapistAdded(address indexed therapist);
    event PaymentReceived(address indexed patient, uint256 amount);
    event VoteCast(
        address indexed voter,
        address indexed therapist,
        uint256 votes
    );
    event RewardsDistributed(uint256 totalDistributed);

    constructor() {
        aiTherapistWallet = 0x603AB1b3E019F9b80eD0144D5AbE68ebb1Dc158A;
        s_therapist.push(aiTherapistWallet);
    }

    function addTherapist(string memory name, address wallet) external {
        if (human[wallet].walleta != address(0))
            revert Eunoia__TherapistAlreadyExists();

        human[wallet] = humanTherapist(name, wallet, 0, 0);
        s_therapist.push(wallet);
        emit TherapistAdded(wallet);
    }

    function payAndVoteHumanTherapist(
        address wallet,
        uint256 amount,
        uint256 base,
        uint256 vote
    ) public payable {
        if (msg.value < amount + base) {
            revert Eunoia__humanInsufficientPayment();
        }

        totalAmount += amount;
        human[wallet].funding += amount;
        human[wallet].voteCount += vote;
        totalVotes += vote;

        VoteInfo storage voterInfo = therapistVoters[wallet][msg.sender];
        if (voterInfo.voter == address(0)) {
            therapistVoterList[wallet].push(msg.sender);
            voterInfo.voter = msg.sender;
        }
        voterInfo.votes.push(vote);
        voterInfo.totalVotes += vote;

        emit PaymentReceived(msg.sender, amount);
        emit VoteCast(msg.sender, wallet, vote);
    }

    function payAndVoteAITherapist(
        uint256 amount,
        uint256 vote
    ) public payable {
        if (msg.value < amount) {
            revert Eunoia__aiInsufficientPayment();
        }

        totalAmount += amount;
        totalVotes += vote;

        VoteInfo storage voterInfo = therapistVoters[aiTherapistWallet][
            msg.sender
        ];
        if (voterInfo.voter == address(0)) {
            therapistVoterList[aiTherapistWallet].push(msg.sender);
            voterInfo.voter = msg.sender;
        }
        voterInfo.votes.push(vote);
        voterInfo.totalVotes += vote;

        emit PaymentReceived(msg.sender, amount);
        emit VoteCast(msg.sender, aiTherapistWallet, vote);
    }

    function distributeRewards() external {
        uint256 matchingPoolAmount = totalAmount;
        uint256[] memory sumOfSqrts = new uint256[](s_therapist.length);
        uint256 totalSumOfSqrts = 0;

        // Calculate quadratic funding for each therapist
        for (uint256 i = 0; i < s_therapist.length; i++) {
            address therapistAddr = s_therapist[i];
            address[] storage voters = therapistVoterList[therapistAddr];
            uint256 sumOfSqrt = 0;

            // Sum square roots of each voter's total contributions
            for (uint256 j = 0; j < voters.length; j++) {
                VoteInfo storage voterInfo = therapistVoters[therapistAddr][
                    voters[j]
                ];
                sumOfSqrt += sqrt(voterInfo.totalVotes);
            }

            sumOfSqrt = sumOfSqrt ** 2;
            sumOfSqrts[i] = sumOfSqrt;
            totalSumOfSqrts += sumOfSqrt;
        }

        // Distribute rewards
        if (totalSumOfSqrts > 0) {
            for (uint256 i = 0; i < s_therapist.length; i++) {
                address therapistAddr = s_therapist[i];
                uint256 matchedAmount = (matchingPoolAmount * sumOfSqrts[i]) /
                    totalSumOfSqrts;
                payable(therapistAddr).transfer(matchedAmount);
            }
        }

        emit RewardsDistributed(matchingPoolAmount);
    }

    function sqrt(uint256 x) private pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**Getter Functions */

    // function getTotalVotes() external view returns (uint256) {
    //     return totalVotes;
    // }

    // function getVoterInfo(address therapist, address voter) external view returns (VoteInfo memory) {
    //     return therapistVoters[therapist][voter];
    // }

    // function getRating(address therapist) external view returns (uint256) {
    //     uint256 tvotes = 0;
    //     for (uint256 i = 0; i < therapistVoterList[therapist].length; i++) {
    //         tvotes += therapistVoters[therapist][therapistVoterList[therapist][i]].totalVotes;
    //     }
    //     return ;
    // }

    function getAverageVotes(
        address therapist
    ) external view returns (uint256) {
        uint256 totalVotesForTherapist = human[therapist].voteCount;
        uint256 totalVoters = therapistVoterList[therapist].length;

        if (totalVoters == 0) {
            return 0; // Avoid division by zero
        }

        return (totalVotesForTherapist * 100) / totalVoters;
    }

    function getTotalVoters(address therapist) external view returns (uint256) {
        return therapistVoterList[therapist].length;
    }
}
