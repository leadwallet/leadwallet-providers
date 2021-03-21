import ethers from "ethers";
// import Web3 from "web3";
import { Transaction as EthTransaction } from "ethereumjs-tx";
import { RpcServer } from "../common";
import { Tx } from "./tx";

export class EthereumProvider {
  private _rpc: RpcServer;
  public address: string;

  constructor(rpcUrl: string = "https://eth.getblock.io") {
    this._rpc = new RpcServer(rpcUrl);
  }

  generateWallet(mnemonic: string) {
    return ethers.Wallet.fromMnemonic(mnemonic);
  }

  async getAccounts(): Promise<any> {
    const res = await this._rpc.call({
      method: "eth_accounts",
      params: [],
      id: 1,
      jsonrpc: "2.0"
    });
    return this.handleResponse(res);
  }

  async getBalance(address: string): Promise<any> {
    const res = await this._rpc.call({
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1,
      jsonrpc: "2.0"
    });
    return this.handleResponse(res);
  }

  async getNetVersion(): Promise<any> {
    const res = await this._rpc.call({
      method: "net_version",
      jsonrpc: "2.0",
      id: 67
    });
    return this.handleResponse(res);
  }

  async estimateGas(tx: Tx): Promise<any> {
    const res = await this._rpc.call({
      method: "eth_estimateGas",
      jsonrpc: "2.0",
      id: 1,
      params: [{ ...tx }]
    });
    return this.handleResponse(res);
  }

  async sendRawTransaction(
    tx: Tx,
    privateKey: string,
    chain: string = "mainnet"
  ): Promise<any> {
    const pk = Buffer.from(privateKey.replace("0x", ""), "hex");
    const t = new EthTransaction(
      {
        nonce: tx.nonce ? ethers.utils.hexValue(tx.nonce) : null,
        to: tx.to,
        gasLimit: ethers.utils.hexValue(tx.gas),
        gasPrice: ethers.utils.hexValue(tx.gasPrice),
        value: ethers.utils.hexValue(
          ethers.utils.parseEther(tx.value.toString())
        )
      },
      { chain }
    );

    t.sign(pk);

    const serializedTx = t.serialize().toString("hex");

    const res = await this._rpc.call({
      method: "eth_sendRawTransaction",
      jsonrpc: "2.0",
      id: 1,
      params: ["0x" + serializedTx]
    });
    return this.handleResponse(res);
  }

  private handleResponse(res: any) {
    if (!res.result && res.error) {
      console.error(res.error);
      throw new Error(res.error.message || "An error occured with rpc call");
    }
    return res;
  }
}
