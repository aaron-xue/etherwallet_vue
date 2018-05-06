import globalUtil from './globalutil'
import ethUtil from 'ethereumjs-util'
import crypto from 'crypto'
import scrypt from 'scryptsy'
import uuid from 'uuid'

var Wallet = function (priv, hwType, path, hwTransport) {
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
    return '0x' + this.getAddress().toString('hex')
}

Wallet.prototype.getAddress = function () {
    if (typeof this.pubKey == "undefined") {
        return ethUtil.privateToAddress(this.privKey)
    } else {
        return ethUtil.publicToAddress(this.pubKey, true)
    }
}

Wallet.prototype.getPrivateKeyString = function () {
    if (typeof this.privKey != "undefined") {
        return this.privKey.toString('hex')
    } else {
        return "";
    }
}

Wallet.prototype.toV3 = function (password, opts) {
    opts = opts || {}
    var salt = opts.salt || crypto.randomBytes(32)
    var iv = opts.iv || crypto.randomBytes(16)
    var derivedKey
    var kdf = opts.kdf || 'scrypt'
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString('hex')
    }
    if (kdf === 'pbkdf2') {
        kdfparams.c = opts.c || 262144
        kdfparams.prf = 'hmac-sha256'
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 262144
        kdfparams.r = opts.r || 8
        kdfparams.p = opts.p || 1
        derivedKey = scrypt(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else {
        throw new Error('Unsupported kdf')
    }
    var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
    if (!cipher) {
        throw new Error('Unsupported cipher')
    }
    var ciphertext = Buffer.concat([cipher.update(this.privKey), cipher.final()])
    var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]))
    return {
        version: 3,
        id: uuid.v4({
            random: opts.uuid || crypto.randomBytes(16)
        }),
        address: this.getAddress().toString('hex'),
        Crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: opts.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    }
}

Wallet.prototype.getV3Filename = function (timestamp) {
    var ts = timestamp ? new Date(timestamp) : new Date()
    return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', this.getAddress().toString('hex')].join('')
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