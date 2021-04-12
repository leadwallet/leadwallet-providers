"use strict";
exports.__esModule = true;
var provider_1 = require("./ethereum/provider");
var provider_2 = require("./smartchain/provider");
exports["default"] = (function (rpcUrlConfig) {
    if (rpcUrlConfig === void 0) { rpcUrlConfig = {}; }
    return {
        ethereum: new provider_1.EthereumProvider(rpcUrlConfig.ethereum),
        smartchain: new provider_2.SmartChainProvider(rpcUrlConfig.smartchain)
    };
});
//# sourceMappingURL=providers.js.map