<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>创建钱包</h2>
      <h3>创建一个密码（至少9位数）</h3>
      <myInput readonly='' class="input" type='password' v-model="account.password"></myInput>
      <div class="btn" @click="creatWallet(account.password)">生成</div>
    </div>
  </div>
</template>

<script>
import myInput from '../components/myInput'
import walletCtrl from "../utils/walletCtrl";

export default {
  data() {
    return {
      wallet:{},
      account:{
        password:''
      }
    };
  },

  components: {
    myInput
  },

  mounted() {},

  methods: {
    creatWallet(passWord) {
      this.wallet = walletCtrl.genNewWallet(passWord);
      this.$store.commit("createWallet", this.wallet);
      this.$store.commit("createAccount", this.account);
      this.$router.push({ name: 'saveWallet'});
    },
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 822px;
  height: 372px;
  margin: 222px auto 0;
  text-align: center;
  h2 {
    font-family: SourceHanSansCN-Regular;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #333333;
    text-align: center;
    height: 40px;
  }
  h3 {
    height: 25px;
    font-family: SourceHanSansCN-Normal;
    font-size: 25px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 25px;
    letter-spacing: 0px;
    color: #5e5d5d;
    text-align: center;
    margin-top: 58px;
  }
  .input{
    margin-top: 20px;
  }
  .btn {
    display: inline-block;
    margin-top: 91px;
    padding: 23px 78px;
    background-color: #22b9ff;
    border-radius: 10px;
    font-family: SourceHanSansCN-Normal;
    font-size: 25px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 24px;
    letter-spacing: 0px;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>