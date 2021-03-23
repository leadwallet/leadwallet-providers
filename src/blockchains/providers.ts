import { EthereumProvider } from "./ethereum/provider";
import { SmartChainProvider } from "./smartchain/provider";

interface RpcUrlConfig {
  ethereum?: string;
  bitcoin?: string;
  polkadot?: string;
  smartchain?: string;
}

export default (rpcUrlConfig: RpcUrlConfig = {}) => {
  return {
    ethereum: new EthereumProvider(rpcUrlConfig.ethereum),
    smartchain: new SmartChainProvider(rpcUrlConfig.smartchain)
  };
};
