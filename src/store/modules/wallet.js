const state = {
    curWallet: {
        privKey:'',
        pubKey:'',
        path:'',
        hwType:'',
        hwTransport:'',
        type:''
    },
    account: {
        address: "",
        nickName: "",
        encStr: "",
        password: ""
    }
}

// mutations
const mutations = {
    setCurWallet(state,data){
        state.curWallet = data
    },
    setAccount(state,data) {
        state.account = data
    }
}

export default {
    state,
    mutations
}