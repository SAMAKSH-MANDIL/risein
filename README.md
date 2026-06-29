# 🌟 Stellar White Belt — Journey to Mastery

A complete Stellar blockchain project demonstrating wallet creation, balance retrieval, and on-chain transactions on the Stellar testnet. Built for the **RiseIn Journey to Mastery — White Belt Challenge**.

---

## 📋 Features

| Feature | Description |
|---|---|
| **Wallet Creation** | Generate Stellar keypairs with secure secret key handling |
| **Balance Retrieval** | Fetch and display account balances from the Stellar testnet |
| **Testnet Funding** | Automated funding via Stellar Friendbot |
| **Transaction** | Build, sign, and submit XLM payment transactions |
| **Full Demo** | End-to-end walkthrough of all features in one script |

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Blockchain:** Stellar (Testnet)
- **SDK:** `@stellar/stellar-sdk`
- **Environment:** `dotenv` for secure config

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- [Git](https://git-scm.com/) installed
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/SAMAKSH-MANDIL/risein.git
cd risein

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
```

---

## 📖 Usage

### Quick Demo (Recommended)

Run the full White Belt workflow end-to-end with a single command — no setup needed:

```bash
npm run demo
```

This will:
1. Create two new wallets (sender and receiver)
2. Fund both wallets via Friendbot
3. Display balances
4. Send 25 XLM from sender to receiver
5. Show final balances and transaction hash

### Step-by-Step Workflow

#### 1. Create a Wallet

```bash
npm run wallet:create
```

This generates a new Stellar keypair. Copy the keys and paste them into your `.env` file:

```env
STELLAR_SECRET_KEY=S...your_secret_key...
STELLAR_PUBLIC_KEY=G...your_public_key...
```

#### 2. Fund the Wallet (Testnet)

```bash
npm run wallet:fund
```

Uses Stellar Friendbot to send 10,000 test XLM to your account.

#### 3. Check Balance

```bash
npm run wallet:balance
```

Displays current balances for the configured account.

#### 4. Send a Transaction

```bash
npm run transaction:send
```

Sends 10 XLM to a destination address. If `DESTINATION_PUBLIC_KEY` is not set in `.env`, a temporary recipient is created automatically.

---

## 📁 Project Structure

```
risein/
├── src/
│   ├── config.ts                 # Environment configuration
│   ├── index.ts                  # Entry point / barrel exports
│   ├── services/
│   │   ├── index.ts              # Service exports
│   │   ├── walletService.ts      # Wallet creation & balance retrieval
│   │   └── transactionService.ts # Transaction building & submission
│   └── scripts/
│       ├── createWallet.ts       # CLI: Generate new keypair
│       ├── fundWallet.ts         # CLI: Fund via Friendbot
│       ├── checkBalance.ts       # CLI: Check account balances
│       ├── sendTransaction.ts    # CLI: Send XLM payment
│       └── demo.ts              # CLI: Full end-to-end demo
├── docs/
│   └── submission.md             # White Belt submission guide
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── package.json                  # Project configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🔐 Security

- **Secret keys** are stored in `.env` (which is git-ignored)
- **Never** commit `.env` or any file containing secret keys
- The `.env.example` file shows the required variables without values
- Public keys are safe to share and display

---

## 📝 White Belt Completion

This project fulfills all White Belt requirements:

- [x] **Task 1:** Wallet creation with keypair generation
- [x] **Task 2:** Balance retrieval from Stellar testnet
- [x] **Task 3:** On-chain XLM transaction with hash verification
- [x] **Documentation:** Complete README and submission guide
- [x] **Security:** No secrets committed to repository

See [`docs/submission.md`](docs/submission.md) for detailed submission instructions.

---

## 🔗 Useful Links

- [Stellar Documentation](https://developers.stellar.org/docs)
- [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Friendbot (Testnet Funding)](https://friendbot.stellar.org)
- [RiseIn Platform](https://www.risein.com/)

---

## 📄 License

MIT
