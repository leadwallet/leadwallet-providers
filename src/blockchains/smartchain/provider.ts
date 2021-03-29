import ethers from "ethers";
// import Web3 from "web3";
import { Transaction as EthTransaction } from "ethereumjs-tx";
import { RpcServer } from "../common";
import { Tx } from "./tx";
import bep20ContractAbi from "./tokens/BEP20ABI.json";

export class SmartChainProvider {
  private _rpc: RpcServer;

  constructor(rpcUrl: string = "https://bsc.getblock.io") {
    this._rpc = rpcUrl
      ? new RpcServer(rpcUrl)
      : new RpcServer("https://bsc.getblock.io");
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

  getBalance(address: string): Promise<any> {
    return this._rpc
      .call({
        method: "eth_getBalance",
        params: [address, "latest"],
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

  sendRawTransaction(
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

    return this._rpc
      .call({
        method: "eth_sendRawTransaction",
        jsonrpc: "2.0",
        id: 1,
        params: ["0x" + serializedTx]
      })
      .then(this.handleResponse);
  }

  sendBEP20Token(
    tx: Tx,
    contractAddress: string,
    privateKey: string
  ): Promise<any> {
    const pk = Buffer.from(privateKey.replace("0x", ""), "hex");
    // const erc20ContractAbi = [];
    const iFace = new ethers.utils.Interface(bep20ContractAbi);
    const data = iFace.encodeFunctionData("transfer", [
      tx.to,
      ethers.utils.parseEther(tx.value.toString())
    ]);
    const t = new EthTransaction({
      nonce: tx.nonce ? ethers.utils.hexValue(tx.nonce) : null,
      to: contractAddress,
      gasLimit: ethers.utils.hexValue(tx.gas),
      gasPrice: ethers.utils.hexValue(tx.gasPrice),
      value: "0x",
      data
    });

    t.sign(pk);

    const serializedTx = t.serialize().toString("hex");

    return this._rpc
      .call({
        method: "eth_sendRawTransaction",
        jsonrpc: "2.0",
        id: 1,
        params: ["0x" + serializedTx]
      })
      .then(this.handleResponse);
  }

  getTransactionsByAddress(address: string): Promise<any> {
    return fetch(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}`
    )
      .then(res => res.json())
      .then(this.handleResponse);
  }

  getTransactionByHash(hash: string): Promise<any> {
    return this._rpc
      .call({
        method: "eth_getTransactionByHash",
        jsonrpc: "2.0",
        id: 1,
        params: [hash]
      })
      .then(this.handleResponse);
  }

  private handleResponse(res: any) {
    if (!res.result && res.error) {
      console.error(res.error);
      throw new Error(res.error.message || "An error occured with rpc call");
    }
    return res;
  }
}
