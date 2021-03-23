import * as bitcoin from "bitcoinjs-lib";
import { RpcServer } from "../common";

export class BitcoinProvider {
  private _rpc: RpcServer;

  constructor(rpcUrl: string = "https://btc.getblock.io") {
    this._rpc = new RpcServer(rpcUrl);
  }

  generateWallet() {
    const keypair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: keypair.publicKey
    });
    return {
      address,
      privateKey: keypair.privateKey.toString("hex"),
      wif: keypair.toWIF()
    };
  }

  async getAddressInfo(address: string): Promise<any> {
    const res = await fetch("https://blockchain.info/rawaddr/" + address, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    if (res.status >= 400)
      throw new Error("Couldn't get info for address: " + address);

    return Promise.resolve(res.json());
  }

  // getBalance(address: string): Promise<any> {
  //  return this._rpc.call({
  //   method: "getbalance",
  //   id: "curltest"
  //  })
  // }
}
