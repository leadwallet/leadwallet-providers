export declare class PolkadotProvider {
    private _rpc;
    constructor(rpcUrl?: string);
    getBalance(address: string): Promise<void>;
    submitExtrinsic(): Promise<any>;
}
