import { ethers } from "ethers";

export class Utils {
  static walletFromMnemonic(mnemonic: string) {
    const { address, privateKey } = ethers.Wallet.fromMnemonic(mnemonic);
    return { address, privateKey };
  }

  static walletFromPrivateKey(pk: string) {
    const { address, privateKey } = new ethers.Wallet(pk);
    return { address, privateKey };
  }
}
