"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Utils = void 0;
var ethers_1 = __importDefault(require("ethers"));
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.walletFromMnemonic = function (mnemonic) {
        var _a = ethers_1["default"].Wallet.fromMnemonic(mnemonic), address = _a.address, privateKey = _a.privateKey;
        return { address: address, privateKey: privateKey };
    };
    Utils.walletFromPrivateKey = function (pk) {
        var _a = new ethers_1["default"].Wallet(pk), address = _a.address, privateKey = _a.privateKey;
        return { address: address, privateKey: privateKey };
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map