/**
 * Script: Create Wallet
 *
 * Generates a new Stellar keypair and displays the keys.
 * The user should save the secret key to their .env file.
 *
 * Usage: npm run wallet:create
 */

import { createWallet } from "../services";

function main(): void {
  console.log("═══════════════════════════════════════════════════════");
  console.log("        🌟 Stellar Wallet Generator");
  console.log("═══════════════════════════════════════════════════════\n");

  const wallet = createWallet();

  console.log("✅ New Stellar keypair generated!\n");

  console.log("┌─────────────────────────────────────────────────────┐");
  console.log("│  PUBLIC KEY (your address — safe to share):        │");
  console.log(`│  ${wallet.publicKey}  │`);
  console.log("├─────────────────────────────────────────────────────┤");
  console.log("│  SECRET KEY (KEEP THIS PRIVATE — never share!):    │");
  console.log(`│  ${wallet.secretKey}  │`);
  console.log("└─────────────────────────────────────────────────────┘\n");

  console.log("📝 Next steps:");
  console.log("   1. Copy the keys above");
  console.log("   2. Create a .env file (copy from .env.example)");
  console.log("   3. Paste STELLAR_SECRET_KEY and STELLAR_PUBLIC_KEY into .env");
  console.log("   4. Run 'npm run wallet:fund' to fund the account on testnet");
  console.log("");
  console.log("⚠️  IMPORTANT: Never commit your .env or secret key to Git!");
  console.log("═══════════════════════════════════════════════════════\n");
}

main();
