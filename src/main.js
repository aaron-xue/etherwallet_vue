// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ethUtil from 'ethereumjs-util'
import crypto from 'crypto'
import globalutil from "./utils/globalutil";
import BigNumber from "bignumber.js"
import myFetch from "../static/js/axios"
import toast from "./components/toast"
import '../src/assets/iconfont/iconfont.css'
import bus from '../src/utils/bus'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.prototype.ethUtil = ethUtil
Vue.prototype.crypto = crypto
Vue.prototype.globalutil = globalutil
Vue.prototype.kdf = 'scrypt'
Vue.prototype.scrypt_n = 8192
Vue.prototype.BigNumber = BigNumber
Vue.prototype.myFetch = myFetch
Vue.prototype.toast = toast
Vue.prototype.bus = bus

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
