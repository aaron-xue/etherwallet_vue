<!--  -->
<template>
  <div>
    <p>请粘贴/输入您的私钥：</p>
    <textarea v-model="privateKey"></textarea>
    <p>您的钱包被加密，请输入钱包密码：</p>
    <myInput readonly='' class="input" type='password' v-model="account.password"></myInput>
    <div class="btn" @click="decryptWalletPrivKey">解锁</div>
  </div>
</template>

<script>
import myInput from "../components/myInput";
import walletCtrl from "../utils/walletCtrl";

export default {
  data() {
    return {
      wallet: {},
      privateKey: "",
      account: {
        password: ""
      }
    };
  },

  components: {
    myInput
  },

  mounted() {},

  methods: {
    //通过私钥解锁钱包
    decryptWalletPrivKey() {
      if (!this.globalutil.isStrongPass(this.account.password)) {
        this.toast.toastFaill("密码错误", "请输入正确的密码");
        setTimeout(() => {
          this.toast.closeToast();
        }, 2000);
        return;
      }
      this.wallet = walletCtrl.fromMyEtherWalletKey(this.privateKey);
      this.$store.commit("createWallet", this.wallet);
      this.$store.commit("createAccount", this.account);
      this.$router.push({ name: "myWallet" });
    }
  }
};
</script>
<style lang='less' scoped>
p {
  height: 22px;
  font-family: SourceHanSansCN-Normal;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #535353;
  margin-top: 52px;
}
textarea {
  width: 822px;
  height: 167px;
  background-color: #dcdcdc;
  border-radius: 10px;
  border: solid 1px #ffffff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 7px;
  outline: none;
}
.btn {
  display: inline-block;
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
  margin-top: 109px;
}
.input {
  margin-top: 7px;
}
</style>