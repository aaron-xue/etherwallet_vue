import globalutil from "./globalutil";
import toast from "../components/toast"
import ethUtil from 'ethereumjs-util'
import coder from './solidity/coder'
import contractCfg from './contract'


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
    initContract(contractCfg.contractAddress,contractCfg.abi);
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