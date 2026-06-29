"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import {
  readContractCount,
  incrementContract,
  checkTransactionStatus,
  DEFAULT_CONTRACT_ID,
} from "../lib/contract";
import {
  Terminal,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function ContractPanel() {
  const { publicKey, isConnected } = useWallet();
  const [contractId, setContractId] = useState(DEFAULT_CONTRACT_ID);

  const [count, setCount] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);

  const [isWriting, setIsWriting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "failed" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidContractId = contractId.startsWith("C") && contractId.length === 56;

  const handleRead = async () => {
    if (!isValidContractId) return;
    setIsReading(true);
    setReadError(null);
    try {
      const val = await readContractCount(contractId);
      setCount(val);
    } catch (e: any) {
      setReadError(e.message || "Failed to read contract");
    } finally {
      setIsReading(false);
    }
  };

  const handleIncrement = async () => {
    if (!publicKey || !isValidContractId) return;
    setIsWriting(true);
    setErrorMsg(null);
    setTxHash(null);
    setTxStatus(null);

    try {
      const res = await incrementContract(publicKey, contractId);
      setTxHash(res.hash);
      setTxStatus(res.status);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to call contract");
      setIsWriting(false);
    }
  };

  // Poll for transaction status if pending — real-time event listening
  useEffect(() => {
    if (!txHash || txStatus !== "pending") return;

    const interval = setInterval(async () => {
      const currentStatus = await checkTransactionStatus(txHash);
      setTxStatus(currentStatus);

      if (currentStatus === "success") {
        setIsWriting(false);
        handleRead(); // Auto-refresh count when tx confirms
        clearInterval(interval);
      } else if (currentStatus === "failed") {
        setIsWriting(false);
        setErrorMsg("Transaction failed on-chain. Check the explorer for details.");
        clearInterval(interval);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [txHash, txStatus]);

  // Initial read when contract ID is valid
  useEffect(() => {
    if (isValidContractId) {
      handleRead();
    }
  }, [contractId]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-5 h-5 text-stellar-400" />
        <h3 className="font-semibold text-lg">Smart Contract (Soroban)</h3>
        <span className="ml-auto text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
          Increment Counter
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Config + State */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Contract ID</label>
          <input
            id="contract-id-input"
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="C... (56 characters)"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-stellar-500 transition-all mb-4 text-xs font-mono"
          />

          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Current Count</span>
              <button
                onClick={handleRead}
                disabled={isReading || !isValidContractId}
                className="text-stellar-400 hover:text-stellar-300 transition-colors p-1 disabled:opacity-40"
                title="Refresh State"
                aria-label="Refresh contract count"
              >
                <RefreshCw className={`w-4 h-4 ${isReading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {readError ? (
              <p className="text-xs text-red-400 mt-2">{readError}</p>
            ) : (
              <div className="text-4xl font-bold text-white text-center py-4 tracking-tight">
                {isReading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                ) : count !== null ? (
                  count
                ) : (
                  <span className="text-slate-500 text-2xl">--</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions + Status */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Call the on-chain increment function. Each call requires wallet signing
              and costs a small network fee. The counter auto-updates after confirmation.
            </p>

            {!isValidContractId && (
              <p className="text-xs text-amber-400 mb-3 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                ⚠ Enter a valid 56-character contract ID starting with &apos;C&apos;
              </p>
            )}

            <button
              id="contract-increment-btn"
              onClick={handleIncrement}
              disabled={!isConnected || isWriting || !isValidContractId}
              className="w-full bg-stellar-600 hover:bg-stellar-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-stellar-600/10"
            >
              {isWriting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {txStatus === "pending" ? "Confirming on-chain..." : "Awaiting signature..."}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Increment Count
                </>
              )}
            </button>

            {!isConnected && (
              <p className="text-xs text-amber-400 mt-2 text-center">
                Connect wallet to interact
              </p>
            )}
          </div>

          {/* Transaction Status */}
          <div className="space-y-2">
            {/* Pending */}
            {txStatus === "pending" && txHash && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-sm min-w-0">
                  <p className="text-amber-400 font-medium">Pending — awaiting confirmation</p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300/70 hover:text-amber-300 underline mt-1 flex items-center gap-1 text-xs break-all"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {txHash.slice(0, 20)}...
                  </a>
                </div>
              </div>
            )}

            {/* Success */}
            {txStatus === "success" && txHash && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div className="text-sm min-w-0">
                  <p className="text-green-400 font-medium">Contract Call Successful</p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-300/70 hover:text-green-300 underline mt-1 flex items-center gap-1 text-xs break-all"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {txHash.slice(0, 20)}...
                  </a>
                </div>
              </div>
            )}

            {/* Error */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{errorMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
