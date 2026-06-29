# 🌟 Stellar Journey to Mastery — White & Orange Belt

A full-stack Stellar dApp built with **Next.js 14**, **StellarWalletsKit**, and **Soroban smart contracts**.  
Submitted for both **White Belt** and **Orange Belt** in the [RiseIn Stellar Journey to Mastery](https://app.risein.com) challenge.

---

## 🔗 Live Links

| | Link |
|---|---|
| 🌐 **Live Demo** | [Deploy to Vercel — see instructions below](#-deployment) |
| 📦 **GitHub** | [github.com/SAMAKSH-MANDIL/risein](https://github.com/SAMAKSH-MANDIL/risein) |
| 📜 **Smart Contract (Testnet)** | `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM` *(update after deploy)* |
| 🔁 **Sample TX Hash** | *(update after first successful contract call)* |

---

## ✅ Submission Checklist

### White Belt
- [x] Freighter wallet connect & disconnect
- [x] Multi-wallet support (Freighter, Albedo, xBull, Lobstr) via `StellarWalletsKit`
- [x] Stellar Testnet
- [x] XLM balance display with auto-refresh
- [x] Send XLM with loading / success / error states
- [x] Transaction hash display with Stellar Expert explorer link
- [x] Specific error messages (not-installed, rejected, insufficient balance, bad address)
- [x] Clean folder structure, reusable components, responsive Tailwind UI

### Orange Belt
- [x] Multi-wallet support via `@creit.tech/stellar-wallets-kit`
- [x] "Wallet not installed" error handling
- [x] "User rejected" error handling
- [x] "Insufficient balance" pre-flight check
- [x] Soroban smart contract (Rust increment counter) in `contracts/increment`
- [x] Contract read (`read` function via `simulateTransaction`)
- [x] Contract write (`increment` function with wallet signing)
- [x] Transaction status: Pending → Success / Failed
- [x] Real-time polling every 3s for confirmation, auto-updates counter UI
- [x] 2+ meaningful git commits

---

## 📋 Features

- **Connect any supported Stellar wallet** — Freighter, Albedo, xBull, Lobstr via a unified modal
- **View XLM balance** — auto-refresh on connect and after sends
- **Send XLM** on Testnet with pre-flight balance check, address validation, and memo support
- **Smart contract interaction** — read & increment an on-chain Soroban counter
- **Real-time transaction status** — pending badge → confirms → count auto-updates
- **Rich error handling** — specific messages for every failure mode
- **Responsive glassmorphism UI** with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Lucide Icons |
| Stellar SDK | `@stellar/stellar-sdk` v12 |
| Wallet Kit | `@creit.tech/stellar-wallets-kit` v2.4 |
| Smart Contract | Rust (Soroban SDK v22) |
| Deployment | Vercel |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- Freighter browser extension — [install here](https://freighter.app), switch to **Testnet**

### 1. Clone & Install

```bash
git clone https://github.com/SAMAKSH-MANDIL/risein.git
cd risein
npm install
```

### 2. Environment Variables (optional — for CLI scripts only)

```bash
cp .env.example .env
# Fill in STELLAR_SECRET_KEY for CLI scripts
# The web app runs entirely client-side — no server secrets needed
```

### 3. Run Dev Server

```bash
npm run dev
# → http://localhost:3000
```

### 4. Configure Contract ID

In `src/lib/contract.ts` update `DEFAULT_CONTRACT_ID`, or set it via env:

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ID=C...your_deployed_contract...
```

---

## 📦 Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) — it will auto-detect Next.js.

Set `NEXT_PUBLIC_CONTRACT_ID` in Vercel's environment variables dashboard.

---

## 🔧 Smart Contract Deployment

The Soroban increment counter lives in `contracts/increment/`. To deploy your own:

```bash
# Prerequisites: Rust + stellar-cli
rustup target add wasm32-unknown-unknown

# Build
cd contracts/increment
stellar contract build

# Deploy to Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_increment_contract.wasm \
  --source YOUR_ACCOUNT_NAME \
  --network testnet

# Copy the output Contract ID (starts with C) into src/lib/contract.ts
```

---

## 📁 Folder Structure

```
risein/
├── contracts/
│   └── increment/          # Soroban Rust smart contract
│       ├── src/lib.rs       # increment() + read() functions
│       └── Cargo.toml
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main page — card grid layout
│   │   ├── layout.tsx       # Root layout + WalletProvider
│   │   └── globals.css      # Tailwind base + glassmorphism
│   ├── components/
│   │   ├── BalanceCard.tsx  # XLM balance display
│   │   ├── SendXLM.tsx      # Payment form + status
│   │   ├── ContractPanel.tsx# Soroban read/write + tx polling
│   │   └── WalletButton.tsx # Connect/disconnect + error display
│   ├── context/
│   │   └── WalletContext.tsx# Global wallet state + error handling
│   ├── lib/
│   │   ├── stellar.ts       # StellarWalletsKit initialization
│   │   ├── horizon.ts       # Horizon server + balance fetch
│   │   ├── transactions.ts  # Build + sign + submit XLM payment
│   │   └── contract.ts      # Soroban read/write/status polling
│   ├── services/            # Legacy CLI service layer
│   └── scripts/             # CLI scripts (create wallet, fund, send)
├── docs/                    # Submission documentation
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 📸 Screenshots

> Replace with actual screenshots for your submission.

**1. Wallet Connected & Balance**
> `[Screenshot: wallet address shown in header, XLM balance in card]`

**2. Successful XLM Transaction**
> `[Screenshot: SendXLM success state with transaction hash link]`

**3. Smart Contract Interaction**
> `[Screenshot: ContractPanel showing counter and pending/success state]`

---

## 🔮 Future Improvements

- Parse Soroban contract events for true push-based updates instead of polling
- Add transaction history log using Horizon's `/transactions` endpoint
- Support custom asset sends (non-native tokens)
- Add Soroban contract auth with passkeys
- Deploy to mainnet with a production contract

---

## 📝 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ID` | Optional | Soroban contract ID (overrides default) |
| `STELLAR_SECRET_KEY` | CLI only | Secret key for CLI scripts |
| `STELLAR_PUBLIC_KEY` | CLI only | Public key for CLI scripts |
| `STELLAR_NETWORK` | CLI only | `testnet` or `public` |
| `STELLAR_HORIZON_URL` | CLI only | Horizon server URL |
| `DESTINATION_PUBLIC_KEY` | CLI only | Test send destination |
