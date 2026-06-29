import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr';

// Initialize the kit globally
export const kit = new StellarWalletsKit({
  network: Networks.TESTNET,
  selectedWalletId: 'freighter',
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
    new xBullModule(),
    new LobstrModule()
  ],
});

export const getNetworkPassphrase = () => {
  return "Test SDF Network ; September 2015";
};
