"use client";

import { useWallet } from "../context/WalletContext";
import { Wallet, LogOut, Loader2, AlertCircle, X } from "lucide-react";

export default function WalletButton() {
  const { publicKey, walletName, isConnected, isLoading, error, connect, disconnect, clearError } = useWallet();

  const truncateKey = (key: string) => `${key.slice(0, 6)}...${key.slice(-4)}`;

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Button */}
      {isLoading ? (
        <button
          disabled
          aria-busy="true"
          className="flex items-center gap-2 bg-stellar-600/70 px-4 py-2 rounded-lg font-medium text-white opacity-80 text-sm"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </button>
      ) : isConnected && publicKey ? (
        <div className="flex items-center gap-2 bg-slate-900/60 border border-stellar-500/30 px-3 py-1.5 rounded-lg">
          {/* Wallet name + address */}
          <div className="flex flex-col items-end mr-1">
            {walletName && (
              <span className="text-xs text-stellar-400 font-medium leading-tight">{walletName}</span>
            )}
            <span className="text-sm font-mono text-slate-200 leading-tight">{truncateKey(publicKey)}</span>
          </div>
          <button
            id="wallet-disconnect"
            onClick={disconnect}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded"
            title="Disconnect Wallet"
            aria-label="Disconnect wallet"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          id="wallet-connect"
          onClick={connect}
          className="flex items-center gap-2 bg-stellar-600 hover:bg-stellar-500 active:scale-95 transition-all px-4 py-2 rounded-lg font-medium text-sm text-white shadow-lg shadow-stellar-600/20"
          aria-label="Connect Stellar wallet"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      )}

      {/* Dismissible error toast */}
      {error && (
        <div className="flex items-start gap-2 bg-red-900/40 border border-red-500/30 text-red-300 text-xs rounded-lg px-3 py-2 max-w-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-200 shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
