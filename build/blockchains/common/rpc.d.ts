interface RpcPayload {
    jsonrpc: "2.0";
    method: string;
    params?: Array<any> | Record<string, any>;
    id?: number | string;
}
export declare class RpcServer {
    private apiKey;
    private url;
    constructor(url: string);
    call(payload: RpcPayload): Promise<any>;
}
export {};
