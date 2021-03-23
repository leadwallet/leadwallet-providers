import ethers from "ethers";

class Utils {
  static walletFromMnemonic(mnemonic: string) {
    const { address, privateKey } = ethers.Wallet.fromMnemonic(mnemonic);
    return { address, privateKey };
  }

  static walletFromPrivateKey(pk: string) {
    const { address, privateKey } = new ethers.Wallet(pk);
    return { address, privateKey };
  }
}

export type utils = Utils;
