import { RpcServer } from "../common";

export class PolkadotProvider {
  private _rpc: RpcServer;

  constructor(rpcUrl: string = "https://dot.getblock.io") {
    this._rpc = rpcUrl
      ? new RpcServer(rpcUrl)
      : new RpcServer("https://dot.getblock.io");
  }

  async getBalance(address: string) {}

  submitExtrinsic() {
    return this._rpc.call({
      jsonrpc: "2.0",
      method: "author_submitExtrinsic",
      params: [],
      id: 1
    });
  }
}
