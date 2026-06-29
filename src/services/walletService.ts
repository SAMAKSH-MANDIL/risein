/**
 * Wallet Service
 *
 * Handles Stellar wallet/account operations:
 * - Generating new keypairs
 * - Funding accounts via Friendbot (testnet only)
 * - Retrieving account balances
 *
 * A Stellar "wallet" is essentially a keypair:
 *   • Public Key (starts with 'G') — your on-chain address, safe to share
 *   • Secret Key (starts with 'S') — used to sign transactions, NEVER share
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import { config } from "../config";

/** Represents a newly generated Stellar keypair */
export interface WalletKeys {
  publicKey: string;
  secretKey: string;
}

/** Represents a single balance entry on the Stellar network */
export interface BalanceInfo {
  assetType: string;
  assetCode?: string;
  balance: string;
}

/**
 * Generates a brand-new Stellar keypair.
 *
 * This does NOT create an on-chain account — the keypair must be funded
 * (with at least 1 XLM on mainnet, or via Friendbot on testnet) before
 * it becomes a real Stellar account.
 *
 * @returns The generated public and secret keys
 */
export function createWallet(): WalletKeys {
  const keypair = StellarSdk.Keypair.random();

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

/**
 * Funds a Stellar testnet account using Friendbot.
 *
 * Friendbot is a free service that sends 10,000 test XLM to any testnet
 * account. This activates the account on-chain.
 *
 * @param publicKey - The account to fund
 * @throws Error if the funding request fails
 */
export async function fundWallet(publicKey: string): Promise<void> {
  console.log(`\n💰 Requesting testnet funds for: ${publicKey}`);
  console.log("   Contacting Stellar Friendbot...\n");

  const url = `${config.friendbotUrl}?addr=${encodeURIComponent(publicKey)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Friendbot funding failed (HTTP ${response.status}): ${errorBody}`
    );
  }

  console.log("✅ Account funded successfully with 10,000 test XLM!");
}

/**
 * Fetches the balances for a Stellar account.
 *
 * Connects to the Horizon API and retrieves all asset balances
 * held by the specified account.
 *
 * @param publicKey - The account whose balances to retrieve
 * @returns Array of balance entries
 * @throws Error if the account doesn't exist or the request fails
 */
export async function getBalances(publicKey: string): Promise<BalanceInfo[]> {
  console.log(`\n🔍 Fetching balances for: ${publicKey}`);
  console.log(`   Horizon URL: ${config.horizonUrl}\n`);

  const server = new StellarSdk.Horizon.Server(config.horizonUrl);

  try {
    const account = await server.loadAccount(publicKey);

    const balances: BalanceInfo[] = account.balances.map((bal: any) => ({
      assetType: bal.asset_type,
      assetCode: bal.asset_type === "native" ? "XLM" : bal.asset_code,
      balance: bal.balance,
    }));

    return balances;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error(
        `Account not found on ${config.network}. ` +
          `The account may not be funded yet. ` +
          `Run 'npm run wallet:fund' to fund it with testnet XLM.`
      );
    }
    throw new Error(`Failed to fetch balances: ${error.message}`);
  }
}
