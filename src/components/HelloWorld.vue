<template>
  <div class="hello">
    <child >
      <p slot-scope="{msg}">{{$store.state.wallet.type}}</p>
    </child>
  </div>
</template>

<script>
import child from './child'
import walletCtrl from '../utils/walletCtrl'

export default {
  data () {
    return {
      wallet:{},
      account:{}
    }
  },
  created(){
    console.log(walletCtrl.genNewWallet('123456789').getAddressString());
    
  },
  components: {
    child
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
