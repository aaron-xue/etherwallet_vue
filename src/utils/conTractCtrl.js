import globalutil from "./globalutil";
import toast from "../components/toast"
import ethUtil from 'ethereumjs-util'
import coder from './solidity/coder'

var contract = {}

function initContract(address, abi) {
    if (!globalutil.validateEtherAddress(address)) {
        toast.toastFaill('合约地址错误', '请及时反馈！！！');
        return;
    } else if (!globalutil.isJson(abi)) {
        toast.toastFaill('ABI错误', '请及时反馈！！！');
        return;
    }
    contract = {
        address: address,
        abi: abi,
        functions: []
    }
    var tAbi = JSON.parse(contract.abi);
    for (var i in tAbi) {
        if (tAbi[i].type == "function") {
            tAbi[i].inputs.map(function (i) {
                i.value = '';
            });
            contract.functions.push(tAbi[i]);
        }
    }
}

//index: balanceOf:5
function getTxData(index,data) {
    initContract('0x9975927293095e17E89C5122628a7461D1E21DDC','[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]');
    var curFunc = contract.functions[index];
    var fullFuncName = globalutil.transformToFullName(curFunc);
    var funcSig = getFunctionSignature(fullFuncName);
    var typeName = globalutil.extractTypeName(fullFuncName);
    var types = typeName.split(',');
    types = types[0] == "" ? [] : types;
    var values = [];
    var inputs = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            for (var i in curFunc.inputs) {
                if (curFunc.inputs[i].type===key) {
                    let input = curFunc.inputs[i];
                    input.value = data[key]
                    inputs.push(input)
                }
            }
            
        }
    }

    for (var i in inputs) {
        if (inputs[i].value) {
            if (inputs[i].type.indexOf('[') !== -1 && inputs[i].type.indexOf(']') !== -1) values.push(inputs[i].value.split(',')); else values.push(inputs[i].value);
        } else values.push('');
    }
    return '0x' + funcSig + coder.coder.encodeParams(types, values);
}

function getFunctionSignature(name) {
    return ethUtil.sha3(name).toString('hex').slice(0, 8);
};

export default {
    getTxData
}