import wallet from './modules/wallet'
import account from './modules/account'
import txData from './modules/txData'
import transaction from './modules/transaction'

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
        state.tx_id = data
    }

}