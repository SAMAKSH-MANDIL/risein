/**
 * Transaction Service
 *
 * Handles building, signing, and submitting Stellar transactions.
 *
 * A Stellar transaction consists of:
 *   1. Source account — who is sending
 *   2. Operations — what actions to perform (e.g., send XLM)
 *   3. Signature — proof that the source account authorized this
 *   4. Submission — broadcasting to the Stellar network
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import { config } from "../config";

/** Result returned after a successful transaction submission */
export interface TransactionResult {
  hash: string;
  ledger: number;
  sourceAccount: string;
  destination: string;
  amount: string;
  fee: string;
  explorerUrl: string;
}

/**
 * Sends XLM from one Stellar account to another on the testnet.
 *
 * Steps:
 *   1. Load the source account from the network (to get the sequence number)
 *   2. Build a transaction with a "payment" operation
 *   3. Sign the transaction with the source's secret key
 *   4. Submit the signed transaction to the Stellar network
 *
 * @param secretKey - The sender's secret key (starts with 'S')
 * @param destinationPublicKey - The recipient's public key (starts with 'G')
 * @param amount - Amount of XLM to send (as a string, e.g. "10")
 * @param memo - Optional memo to attach to the transaction
 * @returns Transaction result with hash and details
 * @throws Error if the transaction fails at any step
 */
export async function sendPayment(
  secretKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string
): Promise<TransactionResult> {
  console.log("\n🚀 Building Stellar transaction...");

  // Derive the keypair from the secret key
  const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
  const sourcePublicKey = sourceKeypair.publicKey();

  console.log(`   From:   ${sourcePublicKey}`);
  console.log(`   To:     ${destinationPublicKey}`);
  console.log(`   Amount: ${amount} XLM`);

  // Connect to the Stellar Horizon server
  const server = new StellarSdk.Horizon.Server(config.horizonUrl);

  // Step 1: Load the source account to get the current sequence number
  console.log("\n📡 Loading source account from network...");
  const sourceAccount = await server.loadAccount(sourcePublicKey);

  // Step 2: Build the transaction
  console.log("🔨 Building transaction...");
  let txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  }).addOperation(
    StellarSdk.Operation.payment({
      destination: destinationPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: amount,
    })
  );

  // Add an optional memo
  if (memo) {
    txBuilder = txBuilder.addMemo(StellarSdk.Memo.text(memo));
  }

  // Set a 30-second timeout for the transaction
  const transaction = txBuilder.setTimeout(30).build();

  // Step 3: Sign the transaction with the source account's secret key
  console.log("🔑 Signing transaction...");
  transaction.sign(sourceKeypair);

  // Step 4: Submit the signed transaction to the network
  console.log("📤 Submitting transaction to Stellar testnet...\n");
  try {
    const result = await server.submitTransaction(transaction);

    const txResult: TransactionResult = {
      hash: result.hash,
      ledger: result.ledger,
      sourceAccount: sourcePublicKey,
      destination: destinationPublicKey,
      amount: amount,
      fee: (parseInt(StellarSdk.BASE_FEE) / 10_000_000).toFixed(7),
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
    };

    return txResult;
  } catch (error: any) {
    // Extract detailed error info from Stellar's response
    if (error?.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      throw new Error(
        `Transaction failed!\n` +
          `  Transaction result: ${codes.transaction}\n` +
          `  Operation results: ${JSON.stringify(codes.operations)}`
      );
    }
    throw new Error(`Transaction submission failed: ${error.message}`);
  }
}
