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

  async sendRawTransaction(
    tx: Tx,
    privateKey: string,
    isDev: boolean = false
  ): Promise<any> {
    const res = await fetch(
      `https://sochain.com/api/v2/get_tx_unspent/${isDev ? "BTCTEST" : "BTC"}/${
        tx.from
      }`
    );

    if (res.status >= 400)
      throw new Error("Could not get unspent outputs for " + tx.from);

    const unspentTxResponseAsJson = await res.json();
    const network = isDev ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    const keypair = bitcoin.ECPair.fromWIF(privateKey, network);
    const payments = bitcoin.payments.p2wpkh({
      pubkey: keypair.publicKey,
      network
    });
    const txn = new bitcoin.Psbt({ network });
    let inputs: Array<{
      hash: string;
      index: number;
      value: number;
      [key: string]: any;
    }> = [];

    for (const transaction of unspentTxResponseAsJson.data.txs)
      inputs = inputs.concat({
        hash: transaction.txid,
        index: transaction.output_no,
        script: transaction.script_hex,
        value: parseFloat(transaction.value)
      });

    txn
      .addInputs(
        inputs.map(i => ({
          hash: i.hash,
          index: i.index,
          nonWitnessUtxo: Buffer.from(i.script, "hex")
        }))
      )
      .addOutputs([
        {
          address: tx.to,
          value: tx.value * Math.pow(10, 8)
        },
        {
          address: payments.address,
          value: inputs.map(i => i.value).reduce((a, b) => a + b)
        }
      ]);
  }

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
