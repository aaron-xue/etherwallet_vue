import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/pages/index'
import createWallet from '@/pages/createWallet'
import importWallet from '@/pages/importWallet'
import myWallet from '@/pages/myWallet'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect:'/createWallet',
      children:[
        {
          path: '/createWallet',
          name: 'createWallet',
          component: createWallet
        },
        {
          path: '/importWallet',
          name: 'importWallet',
          component: importWallet
        }
      ]
    },
    {
      path: '/myWallet',
      name: 'myWallet',
      component: myWallet
    }
  ]
})
