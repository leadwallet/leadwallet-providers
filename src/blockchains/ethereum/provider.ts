import { RpcServer } from "../common";

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
      .then(res => {
        this.handleError(res);
        return res;
      });
  }

  getNetVersion(): Promise<any> {
    return this._rpc
      .call({
        method: "net_version",
        jsonrpc: "2.0",
        id: 67
      })
      .then(res => {
        this.handleError(res);
        return res;
      });
  }

  private handleError(res: any) {
    if (!res.result && res.error) {
      console.error(res.error);
      throw new Error(
        res.error.message ||
          "An error occured with rpc call"
      );
    }
  }
}
