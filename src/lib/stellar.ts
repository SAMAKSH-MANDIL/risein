import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr';

// In v2, StellarWalletsKit is static. We initialize it once:
if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    selectedWalletId: 'freighter',
    modules: [
      new FreighterModule(),
      new AlbedoModule(),
      new xBullModule(),
      new LobstrModule()
    ],
  });
}

// Export the class itself as 'kit' so existing code using kit.method() works if methods match, 
// though we will update WalletContext to use the static methods properly.
export const kit = StellarWalletsKit;

export const getNetworkPassphrase = () => {
  return "Test SDF Network ; September 2015";
};

