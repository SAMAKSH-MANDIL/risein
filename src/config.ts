/**
 * Stellar Configuration
 *
 * Centralizes all configuration values.
 * Reads from environment variables to keep secrets out of source code.
 */

import * as dotenv from "dotenv";

// Load .env file into process.env
dotenv.config();

export const config = {
  /** Stellar Horizon API endpoint */
  horizonUrl:
    process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",

  /** Network identifier — 'testnet' or 'public' */
  network: process.env.STELLAR_NETWORK || "testnet",

  /** Secret key for signing transactions (starts with 'S') */
  secretKey: process.env.STELLAR_SECRET_KEY || "",

  /** Public key derived from or set alongside the secret (starts with 'G') */
  publicKey: process.env.STELLAR_PUBLIC_KEY || "",

  /** Destination public key for sending test transactions */
  destinationPublicKey: process.env.DESTINATION_PUBLIC_KEY || "",

  /** Stellar Friendbot URL for testnet funding */
  friendbotUrl: "https://friendbot.stellar.org",
};
