# 🏅 White & Orange Belt — Submission Guide

This document outlines the proof of completion for the **Stellar Journey to Mastery — White Belt & Orange Belt Challenges**.

## 🚀 Live Application
- **Live Demo:** [Vercel Deployment URL](#) *(Paste here)*
- **GitHub Repository:** [RiseIn Repo](https://github.com/SAMAKSH-MANDIL/risein)

---

## 🟠 ORANGE BELT PROOF

### 1. Multi-Wallet Integration
Implemented using `@creit.tech/stellar-wallets-kit` in `src/lib/stellar.ts` and `src/context/WalletContext.tsx`. Supports Freighter and handles connection/rejection errors.

### 2. Smart Contract Deployment
The Rust source code is provided in `contracts/increment/`.
- **Contract ID:** `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM` *(Update with your deployed ID)*

### 3. Smart Contract Interaction
Implemented in `src/lib/contract.ts` and `src/components/ContractPanel.tsx`.
- Reads state via `server.prepareTransaction()` simulation
- Writes state by building an invocation, signing via WalletKit, and submitting to Testnet
- Polls for real-time transaction confirmation

> 📸 **Screenshot Required:** Open the web app, connect wallet, click "Increment Count", and screenshot the success message showing the updated count and transaction hash.

---

## ⚪ WHITE BELT PROOF (Web Version)

### 1. Wallet & Balance
Implemented in `src/components/WalletButton.tsx` and `src/components/BalanceCard.tsx`.

> 📸 **Screenshot Required:** The dashboard showing your connected Freighter wallet and testnet XLM balance.

### 2. First Transaction
Implemented in `src/components/SendXLM.tsx`. Supports full validation and error handling.

> 📸 **Screenshot Required:** The success state after sending XLM, showing the transaction hash.

*(The original CLI scripts for the White Belt are still available in `src/scripts/`)*
