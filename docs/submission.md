# 🏅 White Belt — Submission Guide

This document outlines the proof of completion for the **Stellar Journey to Mastery — White Belt Challenge**.

---

## ✅ Task 1: Wallet Creation

### What was implemented

- `src/services/walletService.ts` — `createWallet()` function
- `src/scripts/createWallet.ts` — CLI script to generate and display keypairs

### How it works

1. Uses `@stellar/stellar-sdk`'s `Keypair.random()` to generate a cryptographically secure keypair
2. Returns a public key (starts with `G`) and a secret key (starts with `S`)
3. Secret keys are stored in `.env` and never committed to Git

### Proof Required

> 📸 **Screenshot:** Run `npm run wallet:create` and capture the terminal output showing the generated public and secret keys.

### Understanding

- **Public Key**: Your on-chain address. It identifies your account on the Stellar network. Safe to share publicly.
- **Secret Key**: Used to sign transactions. Anyone with your secret key can spend your funds. Never share it.

---

## ✅ Task 2: Balance Retrieval

### What was implemented

- `src/services/walletService.ts` — `getBalances()` function
- `src/scripts/checkBalance.ts` — CLI script to display account balances
- `src/scripts/fundWallet.ts` — CLI script to fund account via Friendbot

### How it works

1. Connects to the Stellar Horizon testnet API
2. Loads the account data using the public key
3. Extracts and formats all balance entries (XLM and any custom assets)
4. Includes error handling for unfunded/missing accounts

### Proof Required

> 📸 **Screenshot:** Run `npm run wallet:fund` followed by `npm run wallet:balance` and capture the terminal output showing the funded balance.

---

## ✅ Task 3: First Transaction

### What was implemented

- `src/services/transactionService.ts` — `sendPayment()` function
- `src/scripts/sendTransaction.ts` — CLI script to send XLM

### How it works

1. Loads the source account from the Stellar network
2. Builds a transaction with a `payment` operation
3. Signs the transaction with the sender's secret key
4. Submits the signed transaction to the testnet
5. Returns the transaction hash and a link to the block explorer

### Proof Required

> 📸 **Screenshot:** Run `npm run transaction:send` and capture the terminal output showing the transaction hash and explorer URL.

> 📸 **Screenshot:** Open the explorer URL in your browser and capture the transaction details page.

---

## 🎯 Full Demo Proof

For a single consolidated proof, run:

```bash
npm run demo
```

> 📸 **Screenshot:** Capture the full demo output showing all four steps completing successfully.

---

## 📸 Screenshots Checklist

Before submitting, ensure you have captured:

- [ ] Wallet creation output (public and secret keys)
- [ ] Funded account balance
- [ ] Successful transaction output (with hash)
- [ ] Stellar Explorer page showing the transaction
- [ ] Full demo output (optional but recommended)

---

## 🔗 Submission Links

- **GitHub Repository**: https://github.com/SAMAKSH-MANDIL/risein
- **Transaction Explorer**: *(paste your transaction explorer URL here after running the demo)*

---

## 📝 Notes

- All code runs on the **Stellar Testnet** — no real funds are involved
- Friendbot provides **10,000 test XLM** per funding request
- The project uses **TypeScript** with clean, modular architecture
- Secret keys are managed via environment variables and never committed to source control
