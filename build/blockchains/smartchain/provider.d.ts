import { Tx } from "./tx";
export declare class SmartChainProvider {
    private _rpc;
    constructor(rpcUrl?: string);
    getAccounts(): Promise<any>;
    getBalance(address: string): Promise<any>;
    getNetVersion(): Promise<any>;
    estimateGas(tx: Tx): Promise<any>;
    sendRawTransaction(tx: Tx, privateKey: string, chain?: string): Promise<any>;
    sendBEP20Token(tx: Tx, contractAddress: string, privateKey: string): Promise<any>;
    getTransactionsByAddress(address: string): Promise<any>;
    getTransactionByHash(hash: string): Promise<any>;
    private handleResponse;
}
