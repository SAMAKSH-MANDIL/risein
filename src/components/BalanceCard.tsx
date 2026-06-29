"use client";

import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { getAccountBalance } from "../lib/horizon";
import { Coins, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface BalanceCardProps {
  refreshTrigger?: number; // increment this to force a refresh
}

export default function BalanceCard({ refreshTrigger = 0 }: BalanceCardProps) {
  const { publicKey, isConnected } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const bal = await getAccountBalance(publicKey);
      setBalance(bal);
    } catch (err: any) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on connect, disconnect, or external trigger
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchBalance();
    } else {
      setBalance(null);
      setError(null);
    }
  }, [isConnected, publicKey, refreshTrigger]);

  if (!isConnected) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center min-h-[180px] opacity-60">
        <Coins className="w-10 h-10 text-slate-500 mb-3" />
        <p className="text-slate-400 text-sm">Connect your wallet to view balance</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 min-h-[180px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-stellar-400" />
          <h3 className="font-semibold text-lg">Your Balance</h3>
        </div>
        <button
          onClick={fetchBalance}
          disabled={isLoading}
          className="text-slate-400 hover:text-stellar-400 transition-colors p-1 disabled:opacity-40"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Fetching balance...</span>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Error</p>
            <p className="opacity-80 mt-1">{error}</p>
            {error.includes("not found") && (
              <a
                href={`https://friendbot.stellar.org/?addr=${publicKey}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-stellar-400 hover:underline"
              >
                Fund account with Friendbot ↗
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tracking-tight">
            {balance
              ? parseFloat(balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 7,
                })
              : "0.00"}
          </span>
          <span className="text-xl font-medium text-stellar-400">XLM</span>
        </div>
      )}

      {/* Testnet badge */}
      <p className="mt-4 text-xs text-slate-500">Stellar Testnet</p>
    </div>
  );
}
