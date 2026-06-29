"use client";

import { useState } from "react";
import WalletButton from "../components/WalletButton";
import BalanceCard from "../components/BalanceCard";
import SendXLM from "../components/SendXLM";
import ContractPanel from "../components/ContractPanel";

export default function Home() {
  // Increment to signal BalanceCard to refresh
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);

  const handleSendSuccess = () => {
    // Small delay to allow Horizon to propagate the transaction
    setTimeout(() => setBalanceRefreshTrigger((n) => n + 1), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0a2e] to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-stellar-400 to-stellar-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-stellar-500/30">
              S
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Stellar Journey</h1>
              <p className="text-xs text-stellar-400">White &amp; Orange Belt · Testnet</p>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-stellar-600/20 border border-stellar-500/30 text-stellar-400 text-xs font-medium">
          Stellar Testnet · Soroban Smart Contracts
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Master the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar-400 to-purple-400">
            Stellar Network
          </span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Connect your wallet to interact with the Stellar Testnet — view balances,
          send XLM, and call Soroban smart contracts in real-time.
        </p>
      </div>

      {/* Card Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceCard refreshTrigger={balanceRefreshTrigger} />
          <SendXLM onSuccess={handleSendSuccess} />

          {/* Contract panel spans full width */}
          <div className="md:col-span-2">
            <ContractPanel />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        Built for the RiseIn Stellar Journey to Mastery Challenge &nbsp;·&nbsp;{" "}
        <a
          href="https://github.com/SAMAKSH-MANDIL/risein"
          target="_blank"
          rel="noreferrer"
          className="text-stellar-400 hover:underline"
        >
          GitHub ↗
        </a>
      </footer>
    </main>
  );
}
