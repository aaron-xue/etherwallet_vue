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
  width: 585px;
  height: 316px;
  margin: 148px auto 0;
  text-align: center;
  h2 {
    font-family: SourceHanSansCN-Regular;
    font-size: 35px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 35px;
    letter-spacing: 0px;
    color: #333333;
    text-align: center;
    height: 35px;
  }
  h3 {
    height: 20px;
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #5e5d5d;
    text-align: center;
    margin-top: 63px;
  }
  .input{
    margin-top: 21px;
  }
  .btn {
    display: inline-block;
    margin-top: 64px;
    padding: 13px 45px;
    background-color: #22b9ff;
    border-radius: 4px;
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>