"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getProviders = void 0;
var providers_1 = __importDefault(require("./blockchains/providers"));
exports.getProviders = function (config) {
    if (config === void 0) { config = {}; }
    return providers_1["default"](config);
};
//# sourceMappingURL=index.js.map