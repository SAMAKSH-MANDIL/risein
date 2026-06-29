/**
 * Entry Point
 *
 * Exports all services for programmatic use.
 * For CLI usage, see the scripts in src/scripts/.
 */

export { createWallet, fundWallet, getBalances } from "./services";
export { sendPayment } from "./services";
export { config } from "./config";
