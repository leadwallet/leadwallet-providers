import { EthereumProvider } from "./ethereum/provider";
import { SmartChainProvider } from "./smartchain/provider";
interface RpcUrlConfig {
    ethereum?: string;
    bitcoin?: string;
    polkadot?: string;
    smartchain?: string;
}
declare const _default: (rpcUrlConfig?: RpcUrlConfig) => {
    ethereum: EthereumProvider;
    smartchain: SmartChainProvider;
};
export default _default;
