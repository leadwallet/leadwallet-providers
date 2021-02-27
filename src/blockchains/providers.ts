import { EthereumProvider } from "./ethereum/provider";

export default (config: any = {}) => ({
  ethereum: new EthereumProvider(config.ethRpc || "")
});
