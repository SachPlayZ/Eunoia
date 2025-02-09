const abi = [
    {
        "type": "constructor",
        "inputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addTherapist",
        "inputs": [
            {
                "name": "name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "wallet",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "distributeRewards",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAverageVotes",
        "inputs": [
            {
                "name": "therapist",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getTotalAmount",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getTotalVoters",
        "inputs": [
            {
                "name": "therapist",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getTotalVotes",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "payAndVoteAITherapist",
        "inputs": [
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "vote",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "payAndVoteHumanTherapist",
        "inputs": [
            {
                "name": "wallet",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "base",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "vote",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "event",
        "name": "PaymentReceived",
        "inputs": [
            {
                "name": "patient",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RewardsDistributed",
        "inputs": [
            {
                "name": "totalDistributed",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TherapistAdded",
        "inputs": [
            {
                "name": "therapist",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "VoteCast",
        "inputs": [
            {
                "name": "voter",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "therapist",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "votes",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "Eunoia__TherapistAlreadyExists",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Eunoia__aiInsufficientPayment",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Eunoia__humanInsufficientPayment",
        "inputs": []
    }
]

export default abi;