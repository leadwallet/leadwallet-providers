"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BitcoinProvider = void 0;
var bitcoin = __importStar(require("bitcoinjs-lib"));
var common_1 = require("../common");
var BitcoinProvider = /** @class */ (function () {
    function BitcoinProvider(rpcUrl) {
        if (rpcUrl === void 0) { rpcUrl = "https://btc.getblock.io" +
            (!!process.env.NODE_ENV && process.env.NODE_ENV === "production")
            ? "/mainnet"
            : "/testnet"; }
        var network = !!process.env.NODE_ENV && process.env.NODE_ENV === "production"
            ? "/mainnet"
            : "/testnet";
        this._rpc = rpcUrl
            ? new common_1.RpcServer(rpcUrl)
            : new common_1.RpcServer("https://btc.getblock.io" + network);
    }
    // generateWallet() {
    //   const keypair = bitcoin.ECPair.makeRandom();
    //   const { address } = bitcoin.payments.p2wpkh({
    //     pubkey: keypair.publicKey
    //   });
    //   return {
    //     address,
    //     privateKey: keypair.privateKey.toString("hex"),
    //     wif: keypair.toWIF()
    //   };
    // }
    BitcoinProvider.prototype.getAddressInfo = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://blockchain.info/rawaddr/" + address, {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json"
                            }
                        })];
                    case 1:
                        res = _a.sent();
                        if (res.status >= 400)
                            throw new Error("Couldn't get info for address: " + address);
                        return [2 /*return*/, Promise.resolve(res.json())];
                }
            });
        });
    };
    BitcoinProvider.prototype.estimateFee = function (confirmations) {
        if (confirmations === void 0) { confirmations = 4; }
        return this._rpc
            .call({
            method: "estimatesmartfee",
            jsonrpc: "2.0",
            id: 1,
            params: [confirmations]
        })
            .then(this.handleResponse);
    };
    BitcoinProvider.prototype.sendRawTransaction = function (tx, privateKey, isDev) {
        if (isDev === void 0) { isDev = false; }
        return __awaiter(this, void 0, void 0, function () {
            var res, unspentTxResponseAsJson, network, keypair, txn, inputs, _i, _a, transaction, isValidated, hex;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("https://sochain.com/api/v2/get_tx_unspent/" + (isDev ? "BTCTEST" : "BTC") + "/" + tx.from)];
                    case 1:
                        res = _b.sent();
                        if (res.status >= 400)
                            throw new Error("Could not get unspent outputs for " + tx.from);
                        return [4 /*yield*/, res.json()];
                    case 2:
                        unspentTxResponseAsJson = _b.sent();
                        network = isDev ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
                        keypair = bitcoin.ECPair.fromWIF(privateKey, network);
                        txn = new bitcoin.Psbt({ network: network });
                        inputs = [];
                        for (_i = 0, _a = unspentTxResponseAsJson.data.txs; _i < _a.length; _i++) {
                            transaction = _a[_i];
                            inputs = inputs.concat({
                                hash: transaction.txid,
                                index: transaction.output_no,
                                script: transaction.script_hex,
                                value: parseFloat(transaction.value)
                            });
                        }
                        isValidated = txn
                            .addInputs(inputs.map(function (i) { return ({
                            hash: i.hash,
                            index: i.index,
                            witnessUtxo: {
                                script: Buffer.from(i.script, "hex"),
                                value: i.value * Math.pow(10, 8)
                            }
                        }); }))
                            .addOutput({
                            address: tx.to,
                            value: tx.value * Math.pow(10, 8)
                        })
                            .signAllInputs(keypair)
                            .validateSignaturesOfAllInputs();
                        hex = "";
                        if (isValidated)
                            hex = txn.finalizeAllInputs().extractTransaction().toHex();
                        return [2 /*return*/, this._rpc
                                .call({
                                jsonrpc: "2.0",
                                method: "sendrawtransaction",
                                params: [hex]
                            })
                                .then(this.handleResponse)];
                }
            });
        });
    };
    // getBalance(address: string): Promise<any> {
    //  return this._rpc.call({
    //   method: "getbalance",
    //   id: "curltest"
    //  })
    // }
    BitcoinProvider.prototype.handleResponse = function (res) {
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
    return BitcoinProvider;
}());
exports.BitcoinProvider = BitcoinProvider;
//# sourceMappingURL=provider.js.map