import * as StellarSdk from "@stellar/stellar-sdk";
import { kit, getNetworkPassphrase } from "./stellar";

/**
 * A Soroban increment counter contract deployed on Testnet.
 * Override via NEXT_PUBLIC_CONTRACT_ID env var or enter directly in the UI.
 * To deploy your own:
 *   stellar contract deploy --wasm contracts/increment/target/.../soroban_increment_contract.wasm \
 *     --source YOUR_ACCOUNT --network testnet
 */
export const DEFAULT_CONTRACT_ID =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONTRACT_ID) ||
  "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM";

export const rpcServer = new StellarSdk.rpc.Server(
  "https://soroban-testnet.stellar.org",
  { allowHttp: false }
);

export interface ContractResult {
  hash: string;
  status: "pending" | "success" | "failed";
  explorerUrl: string;
}

/**
 * Read the current counter value using simulateTransaction (no auth/signing needed).
 */
export async function readContractCount(contractId: string): Promise<number> {
  const contract = new StellarSdk.Contract(contractId);

  // Dummy source account for simulation — no real account needed for reads
  const source = new StellarSdk.Account(
    "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN",
    "0"
  );

  const tx = new StellarSdk.TransactionBuilder(source, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(contract.call("read"))
    .setTimeout(30)
    .build();

  try {
    const simResult = await rpcServer.simulateTransaction(tx);

    if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
      console.warn("Simulation error reading contract:", (simResult as any).error);
      return 0;
    }

    const successResult = simResult as StellarSdk.rpc.Api.SimulateTransactionSuccessResponse;
    const retval = successResult.result?.retval;
    if (retval) {
      return StellarSdk.scValToNative(retval) as number;
    }
    return 0;
  } catch (e) {
    console.warn("Read failed (contract might not be deployed yet):", e);
    return 0;
  }
}

/**
 * Call increment on the contract.
 * Build → prepare (simulate + inject soroban data) → sign via wallet → submit.
 */
export async function incrementContract(
  publicKey: string,
  contractId: string
): Promise<ContractResult> {
  // 1. Load account from Soroban RPC
  const account = await rpcServer.getAccount(publicKey);
  const contract = new StellarSdk.Contract(contractId);

  // 2. Build transaction
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000", // generous fee for Soroban (0.1 XLM)
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(contract.call("increment"))
    .setTimeout(30)
    .build();

  // 3. Prepare: simulate + inject soroban auth + resource fees
  //    prepareTransaction returns a Transaction object ready to sign
  let preparedTx: StellarSdk.Transaction;
  try {
    preparedTx = await rpcServer.prepareTransaction(tx) as StellarSdk.Transaction;
  } catch (err: any) {
    throw new Error(
      `Contract simulation failed. Verify the contract ID is correct and the contract is deployed on Testnet. Details: ${err.message}`
    );
  }

  // 4. Sign via StellarWalletsKit (opens wallet extension)
  let signedTxXdr: string;
  try {
    const result = await kit.signTransaction(preparedTx.toXDR(), {
      networkPassphrase: getNetworkPassphrase(),
      address: publicKey,
    });
    signedTxXdr = result.signedTxXdr;
  } catch (err: any) {
    const msg = (err?.message || "").toLowerCase();
    if (msg.includes("declined") || msg.includes("rejected") || msg.includes("cancel") || msg.includes("user")) {
      throw new Error("Transaction was rejected in the wallet.");
    }
    throw new Error(`Wallet signing failed: ${err.message}`);
  }

  // 5. Reconstruct signed transaction and submit
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    getNetworkPassphrase()
  ) as StellarSdk.Transaction;

  const submitRes = await rpcServer.sendTransaction(signedTx);

  if (submitRes.status === "ERROR") {
    throw new Error(
      `Transaction submission failed. ${submitRes.errorResult ? JSON.stringify(submitRes.errorResult) : ""}`
    );
  }

  return {
    hash: submitRes.hash,
    status: submitRes.status === "PENDING" ? "pending" : "success",
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${submitRes.hash}`,
  };
}

/**
 * Poll transaction status by hash.
 */
export async function checkTransactionStatus(
  hash: string
): Promise<"pending" | "success" | "failed"> {
  try {
    const res = await rpcServer.getTransaction(hash);
    if (res.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) return "success";
    if (res.status === StellarSdk.rpc.Api.GetTransactionStatus.FAILED) return "failed";
    return "pending";
  } catch (_e) {
    return "pending";
  }
}

