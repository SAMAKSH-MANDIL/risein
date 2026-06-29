/**
 * Script: Check Balance
 *
 * Fetches and displays the balances for a Stellar account.
 * Requires STELLAR_PUBLIC_KEY to be set in .env.
 *
 * Usage: npm run wallet:balance
 */

import { config } from "../config";
import { getBalances } from "../services";

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════");
  console.log("        📊 Stellar Balance Checker");
  console.log("═══════════════════════════════════════════════════════\n");

  // Validate that a public key is configured
  if (!config.publicKey) {
    console.error("❌ Error: STELLAR_PUBLIC_KEY is not set in your .env file.");
    console.error("   Run 'npm run wallet:create' first, then add the keys to .env.\n");
    process.exit(1);
  }

  console.log(`Account: ${config.publicKey}`);
  console.log(`Network: ${config.network}`);
  console.log("─────────────────────────────────────────────────────\n");

  try {
    console.log("⏳ Loading balances...\n");
    const balances = await getBalances(config.publicKey);

    if (balances.length === 0) {
      console.log("   No balances found.");
    } else {
      console.log("┌──────────────┬────────────────────────┐");
      console.log("│    Asset     │       Balance          │");
      console.log("├──────────────┼────────────────────────┤");
      balances.forEach((bal) => {
        const asset = (bal.assetCode || bal.assetType).padEnd(12);
        const amount = bal.balance.padStart(22);
        console.log(`│ ${asset} │ ${amount} │`);
      });
      console.log("└──────────────┴────────────────────────┘");
    }

    console.log("\n═══════════════════════════════════════════════════════\n");
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
