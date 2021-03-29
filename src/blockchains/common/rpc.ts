interface RpcPayload {
  jsonrpc: "2.0";
  method: string;
  params?: Array<any> | Record<string, any>;
  id?: number | string;
}

export class RpcServer {
  private apiKey: string = "8b972b80-88f6-444e-bfbe-13e2a5633e52";
  private url: string = "";

  constructor(url: string) {
    this.url = url;
  }

  public async call(payload: RpcPayload): Promise<any> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        body: JSON.stringify({ ...payload }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": this.apiKey
        }
      });
      const responseJson = await res.json();
      return responseJson;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
