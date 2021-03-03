import { RpcServer } from "../common";

export class BitcoinProvider {
 private _rpc: RpcServer;

 constructor(rpcUrl: string) {
  this._rpc = new RpcServer(rpcUrl);
 }

 // getBalance(address: string): Promise<any> {
 //  return this._rpc.call({
 //   method: "getbalance",
 //   id: "curltest"
 //  })
 // }
}
