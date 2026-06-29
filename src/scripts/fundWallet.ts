/**
 * Script: Fund Wallet
 *
 * Funds a Stellar testnet account using Friendbot.
 * Requires STELLAR_PUBLIC_KEY to be set in .env.
 *
 * Usage: npm run wallet:fund
 */

import { config } from "../config";
import { fundWallet, getBalances } from "../services";

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════");
  console.log("        💰 Stellar Testnet Account Funder");
  console.log("═══════════════════════════════════════════════════════\n");

  // Validate that a public key is configured
  if (!config.publicKey) {
    console.error("❌ Error: STELLAR_PUBLIC_KEY is not set in your .env file.");
    console.error("   Run 'npm run wallet:create' first, then add the keys to .env.\n");
    process.exit(1);
  }

  try {
    // Fund the account via Friendbot
    await fundWallet(config.publicKey);

    // Verify by fetching the balance
    console.log("\n📊 Verifying account balance...\n");
    const balances = await getBalances(config.publicKey);

    balances.forEach((bal) => {
      console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
    });

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("✅ Account is funded and ready for transactions!");
    console.log("   Next step: Run 'npm run transaction:send'");
    console.log("═══════════════════════════════════════════════════════\n");
  } catch (error: any) {
    console.error(`\n❌ Funding failed: ${error.message}`);
    process.exit(1);
  }
}

main();
