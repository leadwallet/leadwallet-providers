export interface Tx {
    from?: string;
    to: string;
    gas?: number;
    gasPrice?: number;
    data?: string;
    value: number;
    nonce?: number;
}
