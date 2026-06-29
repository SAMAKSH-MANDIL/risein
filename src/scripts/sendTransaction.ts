/**
 * Script: Send Transaction
 *
 * Sends a test payment of 10 XLM on the Stellar testnet.
 * Requires STELLAR_SECRET_KEY and DESTINATION_PUBLIC_KEY in .env.
 *
 * If no DESTINATION_PUBLIC_KEY is set, a new account is created
 * and funded automatically as the recipient.
 *
 * Usage: npm run transaction:send
 */

import { config } from "../config";
import { createWallet, fundWallet, sendPayment, getBalances } from "../services";

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════");
  console.log("        🚀 Stellar Transaction Sender");
  console.log("═══════════════════════════════════════════════════════\n");

  // Validate secret key
  if (!config.secretKey) {
    console.error("❌ Error: STELLAR_SECRET_KEY is not set in your .env file.");
    console.error("   Run 'npm run wallet:create' first, then add the keys to .env.");
    console.error("   Then run 'npm run wallet:fund' to fund the account.\n");
    process.exit(1);
  }

  let destinationKey = config.destinationPublicKey;

  // If no destination is configured, create one automatically
  if (!destinationKey) {
    console.log("ℹ️  No DESTINATION_PUBLIC_KEY set. Creating a temporary recipient...\n");
    const recipient = createWallet();
    destinationKey = recipient.publicKey;
    console.log(`   Created recipient: ${destinationKey}`);

    // Fund the recipient so it exists on-chain
    await fundWallet(destinationKey);
  }

  try {
    // Send 10 XLM
    const amount = "10";
    const memo = "White Belt Challenge";

    const result = await sendPayment(
      config.secretKey,
      destinationKey,
      amount,
      memo
    );

    console.log("═══════════════════════════════════════════════════════");
    console.log("✅ TRANSACTION SUCCESSFUL!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log(`   Hash:        ${result.hash}`);
    console.log(`   Ledger:      ${result.ledger}`);
    console.log(`   From:        ${result.sourceAccount}`);
    console.log(`   To:          ${result.destination}`);
    console.log(`   Amount:      ${result.amount} XLM`);
    console.log(`   Fee:         ${result.fee} XLM`);
    console.log(`\n   🔗 Explorer:  ${result.explorerUrl}`);

    // Show updated balance
    console.log("\n📊 Updated sender balance:\n");
    const balances = await getBalances(config.publicKey || result.sourceAccount);
    balances.forEach((bal) => {
      console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
    });

    console.log("\n═══════════════════════════════════════════════════════\n");
  } catch (error: any) {
    console.error(`\n❌ Transaction failed: ${error.message}\n`);
    process.exit(1);
  }
}

main();
