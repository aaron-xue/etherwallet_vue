import Vue from 'vue'
import Vuex from 'vuex'
import wallet from './modules/wallet'
import onMutation from './myPlugin'
import mutations from './mutations'

Vue.use(Vuex)
// const debug = process.env.NODE_ENV !== 'production'  //生产环境不使用严格模式

export default new Vuex.Store({
    modules: {
      wallet
    },
    mutations:mutations,
    strict: false,
    plugins: [onMutation()]     //中间件选项暴露出每次 mutation 的回调
  })