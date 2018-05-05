import globalUtil from './globalutil'
import ethUtil from 'ethereumjs-util'
import crypto from 'crypto'

var Wallet = function (priv,hwType,path,hwTransport) {
    if (typeof priv != "undefined") {
        this.privKey = priv.length == 32 ? priv : Buffer(priv, 'hex')
    }
    this.pubKey = ethUtil.privateToPublic(this.privKey);
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = "default";
}

Wallet.prototype.getAddressString = function () {
    var address = []
    if (typeof this.pubKey == "undefined") {
        address =  ethUtil.privateToAddress(this.privKey)
    } else {
        address =  ethUtil.publicToAddress(this.pubKey, true)
    }
    return '0x' + address.toString('hex')
}


//新建钱包
function genNewWallet(password) {
    if (!globalUtil.isStrongPass(password)) {
        console.log('密码错误');
    } else {
        var wallet = generate(false);
        return wallet;
    }
}

//new一个钱包对象
function generate(icapDirect) {
    if (icapDirect) {
        while (true) {
            var privKey = crypto.randomBytes(32)
            if (ethUtil.privateToAddress(privKey)[0] === 0) {
                return new Wallet(privKey)
            }
        }
    } else {
        return new Wallet(crypto.randomBytes(32))
    }
}

export default {
    genNewWallet
}