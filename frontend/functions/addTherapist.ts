
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

// Define the input props interface for our hook
interface AddTherapistProps {
    contractAddress: `0x${string}`;  // The address of the contract
    abi: any;                        // The contract ABI
}

// Define the parameters interface for the addTherapist function
interface TherapistParams {
    name: string;
    wallet: string;
}

export function useAddTherapist({ contractAddress, abi }: AddTherapistProps) {
    // Use the writeContract hook to handle the transaction
    const {
        data: submitData,
        isPending: isLoading,
        isError,
        isSuccess,
        writeContract: addTherapistTx
    } = useWriteContract();

    // Wait for transaction receipt to confirm the operation
    const {
        isLoading: loadingTx,
        isSuccess: isSuccessTx,
        error: isErrorTx
    } = useWaitForTransactionReceipt({
        confirmations: 1,
        query: { 
            enabled: !!submitData,  // Only enable when we have transaction data
        },
        hash: submitData
    });

    // Main function to add a therapist
    async function addTherapist({ name, wallet }: TherapistParams) {
        try {
            // Prepare the contract call
            const request = {
                address: contractAddress,
                abi: abi,
                functionName: 'addTherapist',
                args: [name, wallet]
            };

            // Execute the transaction
            addTherapistTx(request);
        } catch (error) {
            console.error('Error adding therapist:', error);
        }
    }

    // Return all necessary states and functions
    return {
        // Transaction submission states
        isLoading,
        isSuccess,
        isError,
        
        // Transaction confirmation states
        loadingTx,
        isSuccessTx,
        isErrorTx,
        
        // Main function
        addTherapist,
    };
}