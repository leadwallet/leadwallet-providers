import { Utils as utils } from "./utils";
import { EthereumProvider } from "./provider";

const privateKey: string = "e1fc78844aaaa080507f50f358547ecab70f9502bb94a3da6f12f079f2c98126";
const wallet = utils.walletFromPrivateKey(privateKey);

const provider = new EthereumProvider();

provider.getBalance(wallet.address).then((result) => {
 console.log(result);
});

// console.log("Address ==> ", wallet.address);
