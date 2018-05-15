import wallet from './modules/wallet'
import account from './modules/account'
import txData from './modules/txData'
import transaction from './modules/transaction'
import mgyData from './modules/mgyData'

export default {
    createWallet(state, data) {
        state.wallet = data
    },
    createAccount(state, data) {
        state.account = data
    },
    createTxData(state, data){
        state.txData = data
    },
    createTransaction(state, data){
        state.transaction = data
    },
    createMgyData(state, data){
        state.mgyData = data
    }

}