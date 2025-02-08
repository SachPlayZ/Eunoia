"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  coreWallet,
  phantomWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, metaMaskWallet, phantomWallet, coinbaseWallet],
    },
    {
      groupName: "Others",
      wallets: [coreWallet],
    },
  ],
  {
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
  }
);
