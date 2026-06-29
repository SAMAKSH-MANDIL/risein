/**
 * Script: Full Demo
 *
 * Runs the complete White Belt workflow end-to-end:
 *   1. Create a new wallet
 *   2. Fund it on testnet
 *   3. Check the balance
 *   4. Send a transaction
 *
 * This is a standalone demo — it does NOT require .env configuration.
 *
 * Usage: npm run demo
 */

import { createWallet, fundWallet, getBalances, sendPayment } from "../services";

async function main(): Promise<void> {
  console.log("\n");
  console.log("╔═══════════════════════════════════════════════════════╗");
  console.log("║                                                       ║");
  console.log("║     🌟 Stellar White Belt — Full Demo                ║");
  console.log("║     Journey to Mastery Challenge                      ║");
  console.log("║                                                       ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  // ── Step 1: Create wallets ──────────────────────────────────────────
  console.log("━━━ STEP 1: WALLET CREATION ━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const sender = createWallet();
  console.log("✅ Sender wallet created:");
  console.log(`   Public Key:  ${sender.publicKey}`);
  console.log(`   Secret Key:  ${sender.secretKey}\n`);

  const receiver = createWallet();
  console.log("✅ Receiver wallet created:");
  console.log(`   Public Key:  ${receiver.publicKey}`);
  console.log(`   Secret Key:  ${receiver.secretKey}\n`);

  // ── Step 2: Fund accounts ───────────────────────────────────────────
  console.log("━━━ STEP 2: FUNDING ACCOUNTS ━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await fundWallet(sender.publicKey);
  await fundWallet(receiver.publicKey);

  // ── Step 3: Check balances ──────────────────────────────────────────
  console.log("\n━━━ STEP 3: BALANCE RETRIEVAL ━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("Sender balances:");
  const senderBalances = await getBalances(sender.publicKey);
  senderBalances.forEach((bal) => {
    console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
  });

  console.log("\nReceiver balances:");
  const receiverBalances = await getBalances(receiver.publicKey);
  receiverBalances.forEach((bal) => {
    console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
  });

  // ── Step 4: Send transaction ────────────────────────────────────────
  console.log("\n━━━ STEP 4: SENDING TRANSACTION ━━━━━━━━━━━━━━━━━━━━━━\n");

  const result = await sendPayment(
    sender.secretKey,
    receiver.publicKey,
    "25",
    "RiseIn White Belt Demo"
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

  // ── Final balances ──────────────────────────────────────────────────
  console.log("\n━━━ FINAL BALANCES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("Sender:");
  const finalSender = await getBalances(sender.publicKey);
  finalSender.forEach((bal) => {
    console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
  });

  console.log("\nReceiver:");
  const finalReceiver = await getBalances(receiver.publicKey);
  finalReceiver.forEach((bal) => {
    console.log(`   ${bal.assetCode || bal.assetType}: ${bal.balance}`);
  });

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  🎉 White Belt Demo Complete!                         ║");
  console.log("║  All tasks verified: Wallet, Balance, Transaction     ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
}

main().catch((err) => {
  console.error(`\n❌ Demo failed: ${err.message}\n`);
  process.exit(1);
});
