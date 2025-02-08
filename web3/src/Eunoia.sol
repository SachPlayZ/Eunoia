// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Eunoia {
    /**Errors */
    error Eunoia__humanInsufficientPayment();
    error Eunoia__aiInsufficientPayment();
    error Eunoia__AlreadyVoted();
    error Eunoia__NotTherapist();
    error Eunoia__TherapistAlreadyExists();

    /**Type Declarations */
    struct humanTherapist {
        // uint256 id;
        string name;
        address walleta;
        uint256 voteCount;
        uint256 funding;
    }
 
    address aiTherapistWallet = 0x603AB1b3E019F9b80eD0144D5AbE68ebb1Dc158A;
    uint256 aiTherapistVoteCount = 0;

    struct VoteInfo {
        address voter;
        uint256 numberOfVotes;
    }
    
    /**State Variables */
    // uint256 private HumanTherapistCounter=0;
    uint256 private totalVotes;
    uint256 private totalAmount;
    address[] private s_therapist;
    constructor() {
        s_therapist.push(aiTherapistWallet);
    }
    // mapping(uint256 => aiTherapist) private ai;
    mapping(address => humanTherapist) private human;
    // mapping(address => mapping(address => bool)) private hasVoted;
    mapping(address => VoteInfo[]) private therapistVotes;

    /**Events */
    event TherapistAdded(address indexed therapist);
    event PaymentReceived(address indexed patient, uint256 amount);
    event VoteCast(address indexed voter, address indexed therapist, uint256 votes);
    event RewardsDistributed(uint256 totalDistributed);

    /** Functions */
    function addTherapist(string memory name, address wallet) external {
        // if (therapists[wallet]) revert Eunoia__TherapistAlreadyExists();
        
        // therapistCounter++;
        human[wallet] = humanTherapist(name, wallet, 0, 0);
        // HumanTherapistCounter++;
        // therapists[wallet] = true;

        emit TherapistAdded(wallet);
    }

    function payAndVoteHumanTherapist(address wallet, uint256 amount, uint256 base, uint256 vote) public payable {
        if (msg.value < amount + base) {
            revert Eunoia__humanInsufficientPayment();
        }

        totalAmount += amount;
        human[wallet].funding += amount;

        human[wallet].voteCount += vote;
        totalVotes += vote;

        emit PaymentReceived(msg.sender, amount);
        emit VoteCast(msg.sender, human[wallet].walleta, msg.value);
    }

    // function voteHumanTherapist(uint256 humanID, uint256 vote) external payable { // why is it payable???
    //     require(msg.value > 0, "Must send funds to vote");
    //     // if (hasVoted[msg.sender][therapist]) revert Eunoia__AlreadyVoted();

    //     human[humanID].voteCount += vote;
    //     totalVotes += vote;
    //     // hasVoted[msg.sender][therapist] = true;

    //     // therapistVotes[humanID].push(VoteInfo({
    //     //     voter: msg.sender,
    //     //     numberOfVotes: msg.value
    //     // }));



    //     emit VoteCast(msg.sender, human[humanID].walleta, msg.value);
    // }

    function payAIandVoteTherapist(uint256 amount, uint256 vote) public payable {
        if (msg.value < amount) {
            revert Eunoia__aiInsufficientPayment();
        }

        totalAmount += amount;
        // therapists[therapist].funding += amount;

        aiTherapistVoteCount += vote;
        totalVotes += vote;

        emit PaymentReceived(msg.sender, amount);
        emit VoteCast(msg.sender, aiTherapistWallet, msg.value);
    }

    // function voteAITherapist(address therapist, uint256 vote) external payable {
    //     require(msg.value > 0, "Must send funds to vote");
    //     // if (hasVoted[msg.sender][therapist]) revert Eunoia__AlreadyVoted();

    //     // human[therapist].voteCount += vote;
    //     aiTherapistVoteCount += vote;
    //     totalVotes += vote;
    //     // hasVoted[msg.sender][therapist] = true;

    //     // therapistVotes[therapist].push(VoteInfo({
    //     //     voter: msg.sender,
    //     //     numberOfVotes: msg.value
    //     // }));



    //     emit VoteCast(msg.sender, therapist, msg.value);
    // }

    function distributeRewards() external {
        uint256 matchingPoolAmount = totalAmount;
        uint256[] memory sumOfSqrts = new uint256[](s_therapist.length);
        uint256 totalSumOfSqrts = 0;

        // Calculate sum of square roots of votes
        for (uint256 i = 0; i < s_therapist.length; i++) {
            address therapistAddr = s_therapist[i];
            VoteInfo[] storage votes = therapistVotes[therapistAddr];
            uint256 sumOfSqrt = 0;

            for (uint256 j = 0; j < votes.length; j++) {
                sumOfSqrt += sqrt(votes[j].numberOfVotes);
            }

            sumOfSqrt = sumOfSqrt ** 2;
            sumOfSqrts[i] = sumOfSqrt;
            totalSumOfSqrts += sumOfSqrt;
        }

        // Distribute rewards using quadratic funding
        if (totalSumOfSqrts > 0) {
            for (uint256 i = 0; i < s_therapist.length; i++) {
                address therapistAddr = s_therapist[i];
                uint256 matchedAmount = (matchingPoolAmount * sumOfSqrts[i]) / totalSumOfSqrts;
                uint256 totalReward = matchedAmount;
                
                payable(therapistAddr).transfer(totalReward);
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

    // Getter functions
    // function getTherapistDetails(address therapist) external view returns (therapistDeets memory) {
    //     return therapists[therapist];
    // }

    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
}