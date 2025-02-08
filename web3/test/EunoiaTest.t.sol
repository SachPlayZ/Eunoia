// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/Script.sol";
import {Eunoia} from "../src/Eunoia.sol";

contract EunoiaTest is Test {
    Eunoia public eunoia;
    address public constant AI_WALLET =
        0x603AB1b3E019F9b80eD0144D5AbE68ebb1Dc158A;
    address public humanTherapist;
    address public patient1;
    address public patient2;

    event TherapistAdded(address indexed therapist);
    event PaymentReceived(address indexed patient, uint256 amount);
    event VoteCast(
        address indexed voter,
        address indexed therapist,
        uint256 votes
    );
    event RewardsDistributed(uint256 totalDistributed);

    function setUp() public {
        eunoia = new Eunoia();
        humanTherapist = makeAddr("humanTherapist");
        patient1 = makeAddr("patient1");
        patient2 = makeAddr("patient2");
        vm.deal(patient1, 100 ether);
        vm.deal(patient2, 100 ether);
    }

    function test_AddTherapist() public {
        vm.expectEmit(true, false, false, false);
        emit TherapistAdded(humanTherapist);

        eunoia.addTherapist("Dr. Smith", humanTherapist);
        assertEq(eunoia.getTotalVoters(humanTherapist), 0);
    }

    function test_RevertWhenAddingDuplicateTherapist() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);
        vm.expectRevert(Eunoia.Eunoia__TherapistAlreadyExists.selector);
        eunoia.addTherapist("Dr. Smith Again", humanTherapist);
    }

    function test_PayAndVoteHumanTherapist() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);

        uint256 amount = 1 ether;
        uint256 base = 0.1 ether;
        uint256 vote = 7;

        vm.startPrank(patient1);
        vm.expectEmit(true, false, false, false);
        emit PaymentReceived(patient1, amount);
        vm.expectEmit(true, true, false, false);
        emit VoteCast(patient1, humanTherapist, vote);

        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            vote
        );
        vm.stopPrank();

        assertEq(eunoia.getTotalVoters(humanTherapist), 1);
        assertEq(eunoia.getAverageVotes(humanTherapist), vote * 100); // since uint256 can't hold decimals, we are multiplying by 100
    }

    function test_PayAndVoteAITherapist() public {
        uint256 amount = 1 ether;
        uint256 vote = 1;

        vm.startPrank(patient1);
        vm.expectEmit(true, false, false, false);
        emit PaymentReceived(patient1, amount);
        vm.expectEmit(true, true, false, false);
        emit VoteCast(patient1, AI_WALLET, vote);

        eunoia.payAndVoteAITherapist{value: amount}(amount, vote);
        vm.stopPrank();

        assertEq(eunoia.getTotalVoters(AI_WALLET), 1);
    }

    function test_MultipleVotesForHumanTherapist() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);

        uint256 amount = 1 ether;
        uint256 base = 0.1 ether;

        // First patient votes
        vm.startPrank(patient1);
        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            7
        );
        vm.stopPrank();

        // Second patient votes
        vm.startPrank(patient2);
        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            8
        );
        vm.stopPrank();

        assertEq(eunoia.getTotalVoters(humanTherapist), 2);
        // Average should be (7 + 8) / 2 = 7.5, but since we're using integer division, we are multiplying by 100 to get the correct average which will be corrected later
        assertEq(eunoia.getAverageVotes(humanTherapist), 750);
    }

    function test_RevertOnInsufficientPaymentForHuman() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);

        uint256 amount = 1 ether;
        uint256 base = 0.1 ether;
        uint256 vote = 1;

        vm.startPrank(patient1);
        vm.expectRevert(Eunoia.Eunoia__humanInsufficientPayment.selector);
        eunoia.payAndVoteHumanTherapist{value: amount}( // Not including base amount
            humanTherapist,
            amount,
            base,
            vote
        );
        vm.stopPrank();
    }

    function test_RevertOnInsufficientPaymentForAI() public {
        uint256 amount = 1 ether;
        uint256 vote = 1;

        vm.startPrank(patient1);
        vm.expectRevert(Eunoia.Eunoia__aiInsufficientPayment.selector);
        eunoia.payAndVoteAITherapist{value: amount - 0.1 ether}(amount, vote);
        vm.stopPrank();
    }

    function test_DistributeRewards() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);

        uint256 amount = 1 ether;
        uint256 base = 2 ether;

        // Create a third patient
        address patient3 = makeAddr("patient3");
        vm.deal(patient3, 100 ether);

        // Three patients vote for human therapist with vote=2
        vm.startPrank(patient1);
        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            2
        );
        vm.stopPrank();

        vm.startPrank(patient2);
        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            2
        );
        vm.stopPrank();

        vm.startPrank(patient3);
        eunoia.payAndVoteHumanTherapist{value: amount + base}(
            humanTherapist,
            amount,
            base,
            2
        );
        vm.stopPrank();

        // One patient votes for AI therapist with vote=5
        vm.startPrank(patient1);
        eunoia.payAndVoteAITherapist{value: amount}(amount, 5);
        vm.stopPrank();

        uint256 initialHumanBalance = humanTherapist.balance;
        uint256 initialAIBalance = AI_WALLET.balance;

        console.log("Before Distribution:");
        console.log("Initial Human Therapist Balance: ", initialHumanBalance);
        console.log("Initial AI Therapist Balance: ", initialAIBalance);

        vm.expectEmit(true, false, false, false);
        emit RewardsDistributed(amount * 4); // 3 human payments + 1 AI payment

        eunoia.distributeRewards();

        console.log("\nAfter Distribution:");
        console.log("Final Human Therapist Balance: ", humanTherapist.balance);
        console.log("Final AI Therapist Balance: ", AI_WALLET.balance);
        console.log(
            "Human Balance Change: ",
            humanTherapist.balance - initialHumanBalance
        );
        console.log(
            "AI Balance Change: ",
            AI_WALLET.balance - initialAIBalance
        );

        // Verify distributions
        assertGt(humanTherapist.balance, initialHumanBalance);
        assertGt(AI_WALLET.balance, initialAIBalance);
    }

    function test_GetAverageVotesWithNoVotes() public {
        eunoia.addTherapist("Dr. Smith", humanTherapist);
        assertEq(eunoia.getAverageVotes(humanTherapist), 0);
    }

    receive() external payable {}

    fallback() external payable {}
}
