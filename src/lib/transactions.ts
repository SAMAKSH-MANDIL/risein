import * as StellarSdk from "@stellar/stellar-sdk";
import { server } from "./horizon";
import { kit, getNetworkPassphrase } from "./stellar";

export interface TransactionResult {
  hash: string;
  explorerUrl: string;
}

export async function sendPaymentTx(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memoText: string = ""
): Promise<TransactionResult> {
  // 1. Load source account to get sequence number
  const sourceAccount = await server.loadAccount(sourcePublicKey);

  // 2. Build transaction
  let builder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: getNetworkPassphrase(),
  }).addOperation(
    StellarSdk.Operation.payment({
      destination: destinationPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: amount,
    })
  );

  if (memoText) {
    builder = builder.addMemo(StellarSdk.Memo.text(memoText));
  }

  const transaction = builder.setTimeout(30).build();

  // 3. Sign transaction using StellarWalletsKit
  const unsignedXdr = transaction.toXDR();
  const { signedTxXdr } = await kit.signTransaction(unsignedXdr, {
    networkPassphrase: getNetworkPassphrase(),
    address: sourcePublicKey,
  });

  // 4. Submit to Horizon
  const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    getNetworkPassphrase()
  ) as StellarSdk.Transaction;

  const result = await server.submitTransaction(signedTransaction);

  return {
    hash: result.hash,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`
  };
}
