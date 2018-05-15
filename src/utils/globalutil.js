import ethUtil from 'ethereumjs-util'
import TrezorConnect from "../../static/js/trezorConnect";
import BigNumber from "bignumber.js"
import Tx from 'ethereumjs-tx'

var unitMap = {
    'wei': '1',
    'kwei': '1000',
    'ada': '1000',
    'femtoether': '1000',
    'mwei': '1000000',
    'babbage': '1000000',
    'picoether': '1000000',
    'gwei': '1000000000',
    'shannon': '1000000000',
    'nanoether': '1000000000',
    'nano': '1000000000',
    'szabo': '1000000000000',
    'microether': '1000000000000',
    'micro': '1000000000000',
    'finney': '1000000000000000',
    'milliether': '1000000000000000',
    'milli': '1000000000000000',
    'ether': '1000000000000000000',
    'kether': '1000000000000000000000',
    'grand': '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether': '1000000000000000000000000',
    'gether': '1000000000000000000000000000',
    'tether': '1000000000000000000000000000000'
};

//校验密码
function isStrongPass(password) {
    return password.length > 8;
};
//校验私钥
function isValidPrivKey(privkeyLen) {
    return privkeyLen == 64 || privkeyLen == 66 || privkeyLen == 128 || privkeyLen == 132;
}

function validateHexString(str) {
    if (str == "") return true;
    str = str.substring(0, 2) == '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(str);
}

function validateEtherAddress(address) {
    if (address.substring(0, 2) != "0x") return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
    else
        return ethUtil.toChecksumAddress(address);
}

function isTxDataValid(txData) {
    if (txData.to != "0xCONTRACT" && !validateEtherAddress(txData.to)) throw '地址错误';
    else if (!isNumeric(txData.value) || parseFloat(txData.value) < 0) throw '数字错误';
    else if (!isNumeric(txData.gasLimit) || parseFloat(txData.gasLimit) <= 0) throw '数字错误';
    else if (!validateHexString(txData.data)) throw '签名交易错误';
    if (txData.to == "0xCONTRACT") txData.to = '';
}

function isJson(str) {
    try {
        return !!JSON.parse(str);
    } catch (e) {
        return false;
    }
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

function generateTx(txData, callback) {
    if ((typeof txData.hwType != "undefined") && (txData.hwType == "trezor") && !txData.trezorUnlocked) {
        trezorUnlockCallback(txData, callback);
        return;
    }
    try {
        isTxDataValid(txData);
        var genTxWithInfo = function (data) {
            var rawTx = {
                nonce: sanitizeHex(data.nonce),
                gasPrice: data.isOffline ? sanitizeHex(data.gasprice) : sanitizeHex(addTinyMoreToGas(data.gasprice)),
                gasLimit: sanitizeHex(decimalToHex(txData.gasLimit)),
                to: sanitizeHex(txData.to),
                value: sanitizeHex(decimalToHex(toWei(txData.value, txData.unit))),
                data: sanitizeHex(txData.data)
            }
            rawTx.chainId = 3;
            rawTx.data = rawTx.data == '' ? '0x' : rawTx.data;
            var eTx = new Tx(rawTx);
            eTx.sign(new Buffer(txData.privKey, 'hex'));
            rawTx.rawTx = JSON.stringify(rawTx);
            rawTx.signedTx = eTx.serialize().toString('hex');
            rawTx.isError = false;
            if (callback !== undefined) callback(rawTx);
        }
        if (txData.nonce || txData.gasPrice) {
            var data = {
                nonce: txData.nonce,
                gasprice: txData.gasPrice
            }
            data.isOffline = txData.isOffline ? txData.isOffline : false;
            genTxWithInfo(data);
        }
    } catch (e) {
        if (callback !== undefined) callback({
            isError: true,
            error: e
        });
    }
}

function getValueOfUnit(unit) {
    unit = unit ? unit.toLowerCase() : 'ether';
    var unitValue = unitMap[unit];
    if (unitValue === undefined) {
        throw new Error('globalFuncs.errorMsgs[4]' + JSON.stringify(unitMap, null, 2));
    }
    return new BigNumber(unitValue, 10);
};

function toWei(number, unit) {
    var returnValue = new BigNumber(String(number)).times(getValueOfUnit(unit));
    return returnValue.toString(10);
};
function toEther(number, unit) {
    var returnValue = new BigNumber(toWei(number, unit)).div(getValueOfUnit('ether'));
    return returnValue.toString(10);
};

function decimalToHex(dec) {
    return new BigNumber(dec).toString(16);
}

function trezorUnlockCallback(txData, callback) {
    TrezorConnect.open(function (error) {
        if (error) {
            console.log(error);

            if (callback !== undefined) callback({
                isError: true,
                error: error
            });
        } else {
            txData.trezorUnlocked = true;
            generateTx(txData, callback);
        }
    });
}

function addTinyMoreToGas(hex) {
    hex = sanitizeHex(hex);
    return new BigNumber(40 * getValueOfUnit('gwei')).toString(16);
}

function getValueOfUnit(unit) {
    unit = unit ? unit.toLowerCase() : 'ether';
    var unitValue = unitMap[unit];
    if (unitValue === undefined) {
        throw new Error('globalFuncs.errorMsgs[4]' + JSON.stringify(unitMap, null, 2));
    }
    return new BigNumber(unitValue, 10);
};

function sanitizeHex(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
    if (hex == "") return "";
    return '0x' + padLeftEven(hex);
}

function padLeftEven(hex) {
    hex = hex.length % 2 != 0 ? '0' + hex : hex;
    return hex;
}

function getBlob(mime, str) {
    var str = (typeof str === 'object') ? JSON.stringify(str) : str;
    if (str == null) return '';
    var blob = new Blob([str], {
        type: mime
    });
    return window.URL.createObjectURL(blob);
};

function transformToFullName(json) {
    if (json.name.indexOf('(') !== -1) {
        return json.name;
    }

    var typeName = json.inputs.map(function (i) { return i.type; }).join();
    return json.name + '(' + typeName + ')';
};

function extractTypeName(name) {
    /// TODO: make it invulnerable
    var length = name.indexOf('(');
    return length !== -1 ? name.substr(length + 1, name.length - 1 - (length + 1)).replace(' ', '') : "";
};



export default {
    isStrongPass,
    getBlob,
    validateHexString,
    validateEtherAddress,
    isTxDataValid,
    generateTx,
    toEther,
    isJson,
    transformToFullName,
    extractTypeName
}