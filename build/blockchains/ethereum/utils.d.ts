export declare class Utils {
    static walletFromMnemonic(mnemonic: string): {
        address: string;
        privateKey: string;
    };
    static walletFromPrivateKey(pk: string): {
        address: string;
        privateKey: string;
    };
}
