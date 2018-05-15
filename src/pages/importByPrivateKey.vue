<!--  -->
<template>
  <div>
    <p>请粘贴/输入您的私钥：</p>
    <textarea v-model="privateKey"></textarea>
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
      privateKey: ""
    };
  },

  components: {
    myInput
  },

  mounted() {},

  methods: {
    //通过私钥解锁钱包
    decryptWalletPrivKey() {
      this.wallet = walletCtrl.fromMyEtherWalletKey(this.privateKey);
      this.$store.commit("createWallet", this.wallet);
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
  margin-top: 41px;
}
textarea {
  width: 465px;
  height: 120px;
  background-color: #dcdcdc;
  border-radius: 10px;
  border: solid 1px #ffffff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 7px;
  outline: none;
  resize: none;
}
.btn {
  display: inline-block;
  margin-top: 116px;
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
</style>