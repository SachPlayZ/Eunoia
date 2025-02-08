import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

export function validateWalletAddress(address: string) {
  // This is a simple Ethereum address validation
  // For production, you might want to use a more robust solution
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethereumAddressRegex.test(address) || "Invalid Ethereum wallet address"
}
