import { Tx } from "./tx";
export declare class BitcoinProvider {
    private _rpc;
    constructor(rpcUrl?: string);
    getAddressInfo(address: string): Promise<any>;
    estimateFee(confirmations?: number): Promise<any>;
    sendRawTransaction(tx: Tx, privateKey: string, isDev?: boolean): Promise<any>;
    private handleResponse;
}
