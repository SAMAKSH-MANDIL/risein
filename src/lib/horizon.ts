import * as StellarSdk from "@stellar/stellar-sdk";

// Create Horizon server instance for testnet
export const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b: any) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0.0000000";
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error("Account not found on testnet. Ensure you have funded it via Friendbot.");
    }
    throw error;
  }
}
