// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Eunoia {
    /**Errors */
    error Eunoia__InsufficientPayment();
    error Eunoia__AlreadyVoted();
    error Eunoia__NotTherapist();

    /**Type Declarations */
    struct therapistDeets {
        uint256 id;
        string name;
        address walleta;
        uint256 voteCount;
    }

    struct VoteInfo {
        address voter;
        uint256 numberOfVotes;
    }
    
    /**State Variables */
    uint256 private totalVotes;
    uint256 private totalAmount;
    address[] private s_therapist;
    mapping(address => therapistDeets) private therapists;
    // mapping(address => mapping(address => bool)) private hasVoted;
    mapping(address => VoteInfo[]) private therapistVotes;

    /**Events */
    event TherapistAdded(address indexed therapist);
    event PaymentReceived(address indexed patient, uint256 amount);
    event VoteCast(address indexed voter, address indexed therapist, uint256 votes);
    event RewardsDistributed(uint256 totalDistributed);

    function payTherapist(uint256 amount) public payable {
        if (msg.value < amount) {
            revert Eunoia__InsufficientPayment();
        }

        totalAmount += amount;
        // therapists[therapist].funding += amount;

        emit PaymentReceived(msg.sender, amount);
    }

    function vote(address therapist, uint256 vote) external payable {
        require(msg.value > 0, "Must send funds to vote");
        // if (hasVoted[msg.sender][therapist]) revert Eunoia__AlreadyVoted();

        therapists[therapist].voteCount += vote;
        totalVotes += vote;
        // hasVoted[msg.sender][therapist] = true;

        therapistVotes[therapist].push(VoteInfo({
            voter: msg.sender,
            numberOfVotes: msg.value
        }));

        emit VoteCast(msg.sender, therapist, msg.value);
    }

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
    function getTherapistDetails(address therapist) external view returns (therapistDeets memory) {
        return therapists[therapist];
    }

    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
}