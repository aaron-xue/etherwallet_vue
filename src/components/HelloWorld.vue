<template>
  <div class="hello">
    <child>
      <p slot-scope="{msg}">{{$store.state.wallet.type}}</p>
    </child>
    <a :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc" class="btn"></a>
    <textarea v-model="privateKeyString" aria-label="私钥（未加密）" aria-describedby="这是未加密的文本格式私钥文件，这意味发送交易不需要密码。 如果某个人拿到了你的未加密的私钥，他们无需密码就能够控制你的钱包。 出于这个考虑，我们推荐你使用加密的私钥文件。 " class="form-control" readonly="readonly" rows="3"></textarea>
  </div>
</template>

<script>
import child from './child'
import walletCtrl from '../utils/walletCtrl'

export default {
  data () {
    return {
      wallet:{},
      account:{},
      blobEnc:'',
      encFileName:'',
      privateKeyString:''
    }
  },
  methods:{
    creatWallet(passWord){
      this.wallet = walletCtrl.genNewWallet(passWord);
      this.addAccount(passWord,'aaron');
    },
    addAccount(passWord,nickName){
      this.account.nickName = nickName;
      this.account.password = passWord;
      this.account.address = this.wallet.getAddressString();
      var wStr = this.wallet.toV3(passWord, {
            kdf: this.kdf,
            n: this.scrypt_n
        });
      this.account.encStr = JSON.stringify(wStr);
      this.$store.commit("setAccount", this.account);
    }
  },
  created(){
    this.creatWallet('123456789');
    if (this.account.password != '') {
        this.blobEnc = this.globalutil.getBlob("text/json;charset=UTF-8", this.wallet.toV3(this.account.password, {
            kdf: this.kdf,
            n: this.scrypt_n
        }));
        this.encFileName = this.wallet.getV3Filename();
    }
    this.privateKeyString = this.wallet.getPrivateKeyString()
  },
  components: {
    child
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.btn {
  background-image: none;
  cursor: pointer;
  border: 1px solid gray;
  display: inline-block;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
  margin-bottom: 0;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  padding: 0.75rem 2rem;
  font-size: 1.07rem;
  line-height: 1.4;
  border-radius: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
