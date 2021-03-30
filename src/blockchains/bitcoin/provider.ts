import * as bitcoin from "bitcoinjs-lib";
import { RpcServer } from "../common";
import { Tx } from "./tx";

export class BitcoinProvider {
  private _rpc: RpcServer;

  constructor(rpcUrl: string = "https://btc.getblock.io") {
    this._rpc = rpcUrl
      ? new RpcServer(rpcUrl)
      : new RpcServer("https://btc.getblock.io");
  }

  // generateWallet() {
  //   const keypair = bitcoin.ECPair.makeRandom();
  //   const { address } = bitcoin.payments.p2wpkh({
  //     pubkey: keypair.publicKey
  //   });
  //   return {
  //     address,
  //     privateKey: keypair.privateKey.toString("hex"),
  //     wif: keypair.toWIF()
  //   };
  // }

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

  estimateFee(confirmations: number = 4): Promise<any> {
    return this._rpc
      .call({
        method: "estimatesmartfee",
        jsonrpc: "2.0",
        id: 1,
        params: [confirmations]
      })
      .then(this.handleResponse);
  }

  // sendRawTransaction(tx: Tx): Promise<any> {
  // }

  // getBalance(address: string): Promise<any> {
  //  return this._rpc.call({
  //   method: "getbalance",
  //   id: "curltest"
  //  })
  // }

  private handleResponse(res: any) {
    if (!res.result) {
      if (res.error) {
        console.error(res.error);
        throw new Error(res.error.message);
      } else {
        console.error(res);
        throw new Error("An error occured with the rpc call");
      }
    }
    return res;
  }
}
