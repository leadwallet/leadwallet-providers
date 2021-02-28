import { RpcServer } from "../common";
import { Tx } from "./tx";

export class EthereumProvider {
  private _rpc: RpcServer;
  public address: string;

  constructor(rpcUrl: string) {
    this._rpc = new RpcServer(rpcUrl);
  }

  getAccounts(): Promise<any> {
    return this._rpc
      .call({
        method: "eth_accounts",
        params: [],
        id: 1,
        jsonrpc: "2.0"
      })
      .then(this.handleResponse);
  }

  getNetVersion(): Promise<any> {
    return this._rpc
      .call({
        method: "net_version",
        jsonrpc: "2.0",
        id: 67
      })
      .then(this.handleResponse);
  }

  estimateGas(tx: Tx): Promise<any> {
    return this._rpc
      .call({
        method: "eth_estimateGas",
        jsonrpc: "2.0",
        id: 1,
        params: [{ ...tx }]
      })
      .then(this.handleResponse);
  }

  signTransaction(tx: Tx): Promise<any> {
    return this._rpc
      .call({
        method: "eth_signTransaction",
        jsonrpc: "2.0",
        id: 1,
        params: [{ data: "0x", ...tx }]
      })
      .then(this.handleResponse);
  }

  private handleResponse(res: any) {
    if (!res.result && res.error) {
      console.error(res.error);
      throw new Error(
        res.error.message ||
          "An error occured with rpc call"
      );
    }
    return res;
  }
}
