// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ethUtil from 'ethereumjs-util'
import crypto from 'crypto'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.prototype.ethUtil= ethUtil
Vue.prototype.crypto= crypto
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
