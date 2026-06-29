"use client";

import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { sendPaymentTx } from "../lib/transactions";
import { getAccountBalance } from "../lib/horizon";
import { Send, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface SendXLMProps {
  onSuccess?: () => void; // called after a successful send
}

export default function SendXLM({ onSuccess }: SendXLMProps) {
  const { publicKey, isConnected } = useWallet();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("White Belt Demo");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txResult, setTxResult] = useState<{ hash: string; url: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    // --- Client-side validations ---
    if (!destination.startsWith("G") || destination.length !== 56) {
      setStatus("error");
      setErrorMsg("Invalid destination address. Must start with 'G' and be 56 characters long.");
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setStatus("error");
      setErrorMsg("Invalid amount. Must be greater than 0.");
      return;
    }

    if (destination === publicKey) {
      setStatus("error");
      setErrorMsg("Cannot send XLM to yourself.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // --- Pre-flight: check balance (1 XLM minimum reserve + amount + fee) ---
    try {
      const balance = await getAccountBalance(publicKey);
      const available = parseFloat(balance) - 1; // 1 XLM minimum reserve
      if (available < amountNum + 0.001) {
        setStatus("error");
        setErrorMsg(
          `Insufficient balance. You need at least ${(amountNum + 1.001).toFixed(4)} XLM (amount + 1 XLM reserve + fees). Your available: ${available.toFixed(4)} XLM.`
        );
        return;
      }
    } catch {
      // If balance check fails, proceed anyway and let the network reject
    }

    try {
      const result = await sendPaymentTx(publicKey, destination, amount, memo);
      setTxResult({ hash: result.hash, url: result.explorerUrl });
      setStatus("success");
      setDestination("");
      setAmount("");
      onSuccess?.(); // trigger balance refresh in parent
    } catch (err: any) {
      setStatus("error");
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("declined") || msg.includes("rejected") || msg.includes("cancel")) {
        setErrorMsg("Transaction was rejected in the wallet.");
      } else if (msg.includes("insufficient") || msg.includes("underfunded")) {
        setErrorMsg("Insufficient balance to complete the transaction (including the 1 XLM minimum reserve).");
      } else if (msg.includes("no account") || msg.includes("not found")) {
        setErrorMsg("Destination account does not exist on Testnet. The recipient must first receive XLM to activate their account.");
      } else if (msg.includes("op_bad_auth")) {
        setErrorMsg("Transaction authentication failed. Ensure your wallet is set to the Testnet network.");
      } else {
        setErrorMsg(err.message || "Transaction failed. Please try again.");
      }
    }
  };

  const resetStatus = () => {
    setStatus("idle");
    setErrorMsg("");
    setTxResult(null);
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center min-h-[180px] opacity-60">
        <Send className="w-10 h-10 text-slate-500 mb-3" />
        <p className="text-slate-400 text-sm">Connect your wallet to send XLM</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Send className="w-5 h-5 text-stellar-400" />
        <h3 className="font-semibold text-lg">Send XLM</h3>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Destination Address
          </label>
          <input
            id="send-destination"
            type="text"
            value={destination}
            onChange={(e) => { setDestination(e.target.value); resetStatus(); }}
            placeholder="G..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500 transition-all text-sm"
            required
            disabled={status === "loading"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Amount (XLM)
            </label>
            <input
              id="send-amount"
              type="number"
              step="0.0000001"
              min="0.0000001"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); resetStatus(); }}
              placeholder="0.00"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-stellar-500 transition-all text-sm"
              required
              disabled={status === "loading"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Memo (Optional)
            </label>
            <input
              id="send-memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={28}
              placeholder="Memo text"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-stellar-500 transition-all text-sm"
              disabled={status === "loading"}
            />
          </div>
        </div>

        <button
          type="submit"
          id="send-submit"
          disabled={status === "loading" || !destination || !amount}
          className="w-full mt-1 bg-stellar-600 hover:bg-stellar-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-stellar-600/20"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Awaiting wallet signature...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Transaction
            </>
          )}
        </button>
      </form>

      {/* Success */}
      {status === "success" && txResult && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-medium text-sm">Transaction Successful!</p>
            <a
              href={txResult.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-green-300/80 hover:text-green-300 underline mt-1 flex items-center gap-1 break-all"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {txResult.hash.slice(0, 24)}...
            </a>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
