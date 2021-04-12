"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SmartChainProvider = void 0;
var ethers_1 = __importDefault(require("ethers"));
// import Web3 from "web3";
var ethereumjs_tx_1 = require("ethereumjs-tx");
var common_1 = require("../common");
var BEP20ABI_json_1 = __importDefault(require("./tokens/BEP20ABI.json"));
var SmartChainProvider = /** @class */ (function () {
    function SmartChainProvider(rpcUrl) {
        if (rpcUrl === void 0) { rpcUrl = "https://bsc.getblock.io" +
            (!!process.env.NODE_ENV && process.env.NODE_ENV === "production")
            ? "/mainnet"
            : "/testnet"; }
        var network = !!process.env.NODE_ENV && process.env.NODE_ENV === "production"
            ? "/mainnet"
            : "/testnet";
        this._rpc = rpcUrl
            ? new common_1.RpcServer(rpcUrl)
            : new common_1.RpcServer("https://bsc.getblock.io" + network);
    }
    SmartChainProvider.prototype.getAccounts = function () {
        return this._rpc
            .call({
            method: "eth_accounts",
            params: [],
            id: 1,
            jsonrpc: "2.0"
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.getBalance = function (address) {
        return this._rpc
            .call({
            method: "eth_getBalance",
            params: [address, "latest"],
            id: 1,
            jsonrpc: "2.0"
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.getNetVersion = function () {
        return this._rpc
            .call({
            method: "net_version",
            jsonrpc: "2.0",
            id: 67
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.estimateGas = function (tx) {
        return this._rpc
            .call({
            method: "eth_estimateGas",
            jsonrpc: "2.0",
            id: 1,
            params: [__assign({}, tx)]
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.sendRawTransaction = function (tx, privateKey, chain) {
        if (chain === void 0) { chain = "mainnet"; }
        var pk = Buffer.from(privateKey.replace("0x", ""), "hex");
        var t = new ethereumjs_tx_1.Transaction({
            nonce: tx.nonce ? ethers_1["default"].utils.hexValue(tx.nonce) : null,
            to: tx.to,
            gasLimit: ethers_1["default"].utils.hexValue(tx.gas),
            gasPrice: ethers_1["default"].utils.hexValue(tx.gasPrice),
            value: ethers_1["default"].utils.hexValue(ethers_1["default"].utils.parseEther(tx.value.toString()))
        }, { chain: chain });
        t.sign(pk);
        var serializedTx = t.serialize().toString("hex");
        return this._rpc
            .call({
            method: "eth_sendRawTransaction",
            jsonrpc: "2.0",
            id: 1,
            params: ["0x" + serializedTx]
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.sendBEP20Token = function (tx, contractAddress, privateKey) {
        var pk = Buffer.from(privateKey.replace("0x", ""), "hex");
        // const erc20ContractAbi = [];
        var iFace = new ethers_1["default"].utils.Interface(BEP20ABI_json_1["default"]);
        var data = iFace.encodeFunctionData("transfer", [
            tx.to,
            ethers_1["default"].utils.parseEther(tx.value.toString())
        ]);
        var t = new ethereumjs_tx_1.Transaction({
            nonce: tx.nonce ? ethers_1["default"].utils.hexValue(tx.nonce) : null,
            to: contractAddress,
            gasLimit: ethers_1["default"].utils.hexValue(tx.gas),
            gasPrice: ethers_1["default"].utils.hexValue(tx.gasPrice),
            value: "0x",
            data: data
        });
        t.sign(pk);
        var serializedTx = t.serialize().toString("hex");
        return this._rpc
            .call({
            method: "eth_sendRawTransaction",
            jsonrpc: "2.0",
            id: 1,
            params: ["0x" + serializedTx]
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.getTransactionsByAddress = function (address) {
        return fetch("https://api.bscscan.com/api?module=account&action=txlist&address=" + address)
            .then(function (res) { return res.json(); })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.getTransactionByHash = function (hash) {
        return this._rpc
            .call({
            method: "eth_getTransactionByHash",
            jsonrpc: "2.0",
            id: 1,
            params: [hash]
        })
            .then(this.handleResponse);
    };
    SmartChainProvider.prototype.handleResponse = function (res) {
        if (!res.result) {
            if (res.error) {
                console.error(res.error);
                throw new Error(res.error.message);
            }
            else {
                console.error(res);
                throw new Error("An error occured with the rpc call");
            }
        }
        return res;
    };
    return SmartChainProvider;
}());
exports.SmartChainProvider = SmartChainProvider;
//# sourceMappingURL=provider.js.map