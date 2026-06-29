"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { kit } from "../lib/stellar";

interface WalletContextType {
  publicKey: string | null;
  walletName: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { address } = await kit.authModal();
      setPublicKey(address);
      setWalletName(kit.selectedModule.productName);
      setIsConnected(true);
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("not installed") || msg.includes("not found")) {
        setError("Wallet extension not installed. Please install Freighter or another supported wallet.");
      } else if (msg.includes("declined") || msg.includes("rejected") || msg.includes("cancel") || msg.includes("closed")) {
        setError("Connection was rejected or modal was closed. Please try again.");
      } else if (msg) {
        setError(err.message);
      } else {
        setError("Failed to connect wallet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setPublicKey(null);
    setWalletName(null);
    setIsConnected(false);
    setError(null);
  };

  return (
    <WalletContext.Provider
      value={{ publicKey, walletName, isConnected, isLoading, error, connect, disconnect, clearError }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
