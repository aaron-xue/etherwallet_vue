import globalUtil from './globalutil'
import ethUtil from 'ethereumjs-util'
import crypto from 'crypto'
import scrypt from 'scryptsy'
import uuid from 'uuid'
import toast from '../components/toast'

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
        this.toast.toastFaill("密码错误", "请输入正确的密码");
        setTimeout(() => {
            this.toast.closeToast();
        }, 2000);
        return;
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

//输入私钥返回解锁后的钱包
function fromMyEtherWalletKey(input) {
    try {
        var privKey = input.indexOf("0x") === 0 ? input : "0x" + input;

        if (!globalUtil.validateHexString(input)) {
            // $scope.notifier.danger(globalFuncs.errorMsgs[37]);
            return;
        } else if (!ethUtil.isValidPrivate(ethUtil.toBuffer(privKey))) {
            // $scope.notifier.danger(globalFuncs.errorMsgs[40]);
            return;
        } else {
            return new Wallet(fixPkey(input));
        }
    } catch (e) {
        // $scope.notifier.danger(globalFuncs.errorMsgs[6] + e);
    }
}
//通过钱包文件返回解锁后的钱包
function getWalletFromPrivKeyFile(strjson, password) {
    var jsonArr = JSON.parse(strjson);
    if (jsonArr.encseed != null) return fromEthSale(strjson, password);
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return fromV3(strjson, password, true);
    else if (jsonArr.hash != null) return fromMyEtherWallet(strjson, password);
    else if (jsonArr.publisher == "MyEtherWallet") return fromMyEtherWalletV2(strjson);
    else
        throw 'Your password must be at least 9 characters. Please ensure it is a strong password.'
}
function fixPkey(key) {
    if (key.indexOf('0x') === 0) {
        return key.slice(2);
    }
    return key;
}

function fromEthSale(input, password) {
    var json = (typeof input === 'object') ? input : JSON.parse(input)
    var encseed = new Buffer(json.encseed, 'hex')
    var derivedKey = crypto.pbkdf2Sync(Buffer(password), Buffer(password), 2000, 32, 'sha256').slice(0, 16)
    var decipher = crypto.createDecipheriv('aes-128-cbc', derivedKey, encseed.slice(0, 16))
    var seed = decipherBuffer(decipher, encseed.slice(16))
    var wallet = new Wallet(ethUtil.sha3(seed))
    if (wallet.getAddress().toString('hex') !== json.ethaddr) {
        throw new Error('Decoded key mismatch - possibly wrong passphrase')
    }
    return wallet
}
function decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
}
function fromV3(input, password, nonStrict) {
    var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)
    if (json.version !== 3) {
        throw new Error('Not a V3 wallet')
    }
    var derivedKey
    var kdfparams
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams
        derivedKey = scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams
        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2')
        }
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
    } else {
        throw new Error('Unsupported key derivation scheme')
    }
    var ciphertext = new Buffer(json.crypto.ciphertext, 'hex')
    var mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong passphrase')
    }
    var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
    var seed = decipherBuffer(decipher, ciphertext, 'hex')
    while (seed.length < 32) {
        var nullBuff = new Buffer([0x00]);
        seed = Buffer.concat([nullBuff, seed]);
    }
    return new Wallet(seed)
}
function fromMyEtherWallet(input, password) {
    var json = (typeof input === 'object') ? input : JSON.parse(input)
    var privKey
    if (!json.locked) {
        if (json.private.length !== 64) {
            throw new Error('Invalid private key length')
        }
        privKey = new Buffer(json.private, 'hex')
    } else {
        if (typeof password !== 'string') {
            throw new Error('Password required')
        }
        if (password.length < 7) {
            throw new Error('Password must be at least 7 characters')
        }
        var cipher = json.encrypted ? json.private.slice(0, 128) : json.private
        cipher = decodeCryptojsSalt(cipher)
        var evp = evp_kdf(new Buffer(password), cipher.salt, {
            keysize: 32,
            ivsize: 16
        })
        var decipher = crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv)
        privKey = decipherBuffer(decipher, new Buffer(cipher.ciphertext))
        privKey = new Buffer((privKey.toString()), 'hex')
    }
    var wallet = new Wallet(privKey)
    if (wallet.getAddressString() !== json.address) {
        throw new Error('Invalid private key or address')
    }
    return wallet
}
function decodeCryptojsSalt(input) {
    var ciphertext = new Buffer(input, 'base64')
    if (ciphertext.slice(0, 8).toString() === 'Salted__') {
        return {
            salt: ciphertext.slice(8, 16),
            ciphertext: ciphertext.slice(16)
        }
    } else {
        return {
            ciphertext: ciphertext
        }
    }
}
function evp_kdf(data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

    function iter(block) {
        var hash = crypto.createHash(opts.digest || 'md5')
        hash.update(block)
        hash.update(data)
        hash.update(salt)
        block = hash.digest()
        for (var i = 1; i < (opts.count || 1); i++) {
            hash = crypto.createHash(opts.digest || 'md5')
            hash.update(block)
            block = hash.digest()
        }
        return block
    }
    var keysize = opts.keysize || 16
    var ivsize = opts.ivsize || 16
    var ret = []
    var i = 0
    while (Buffer.concat(ret).length < (keysize + ivsize)) {
        ret[i] = iter((i === 0) ? new Buffer(0) : ret[i - 1])
        i++
    }
    var tmp = Buffer.concat(ret)
    return {
        key: tmp.slice(0, keysize),
        iv: tmp.slice(keysize, keysize + ivsize)
    }
}
function fromMyEtherWalletV2(input) {
    var json = (typeof input === 'object') ? input : JSON.parse(input);
    if (json.privKey.length !== 64) {
        throw new Error('Invalid private key length');
    };
    var privKey = new Buffer(json.privKey, 'hex');
    return new Wallet(privKey);
}

export default {
    genNewWallet,
    fromMyEtherWalletKey,
    getWalletFromPrivKeyFile
}