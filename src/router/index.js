import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/pages/index'
import createWallet from '@/pages/createWallet'
import importWallet from '@/pages/importWallet'
import myWallet from '@/pages/myWallet'
import importByUTC from '@/pages/importByUTC'
import importByPrivateKey from '@/pages/importByPrivateKey'
import saveWallet from '@/pages/saveWallet'
import transaction from '@/pages/transaction'
import transactionStep2 from '@/pages/transactionStep2'
import transactionSuccess from '@/pages/transactionSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: '/createWallet',
      children: [
        {
          path: '/createWallet',
          name: 'createWallet',
          component: createWallet
        },
        {
          path: '/importWallet',
          name: 'importWallet',
          component: importWallet,
          redirect: '/importWallet/importByUTC',
          children: [
            {
              path: '/importWallet/importByUTC',
              name: 'importByUTC',
              component: importByUTC
            },
            {
              path: '/importWallet/importByPrivateKey',
              name: 'importByPrivateKey',
              component: importByPrivateKey
            },
          ]
        },
        {
          path: '/saveWallet',
          name: 'saveWallet',
          component: saveWallet
        },
        {
          path: '/myWallet',
          name: 'myWallet',
          component: myWallet,
          redirect: '/myWallet/transaction',
          children:[
            {
              path: '/myWallet/transaction',
              name: 'transaction',
              component: transaction
            },
            {
              path: '/myWallet/transactionStep2',
              name: 'transactionStep2',
              component: transactionStep2
            },
            {
              path: '/myWallet/transactionSuccess',
              name: 'transactionSuccess',
              component: transactionSuccess
            },
          ]

        }

      ]
    }

  ]
})
