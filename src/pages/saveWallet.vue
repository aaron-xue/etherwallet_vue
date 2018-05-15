<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>保存keystore和私钥，不要忘记你的密码。</h2>
      <a class="btn imp_file" :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc">下载keystore File（UTC）</a>
      <div class="private_wrap">
        <p>私钥</p>
        <textarea :value='privateKeyString' readonly></textarea>
      </div>
      <div class="btn goon" @click="goon">继续</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blobEnc: "",
      encFileName: "",
      privateKeyString: "",
      passWord: ""
    };
  },

  components: {},
  created() {
    this.passWord = this.$store.state.account.password;
    this.blobEnc = this.globalutil.getBlob(
      "text/json;charset=UTF-8",
      this.$store.state.wallet.toV3(this.passWord, {
        kdf: this.kdf,
        n: this.scrypt_n
      })
    );
    this.encFileName = this.$store.state.wallet.getV3Filename();
    this.privateKeyString = this.$store.state.wallet.getPrivateKeyString();
  },
  mounted() {},

  methods: {
    goon() {
      this.$router.push({ name: "myWallet" });
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 711px;
  height: 611px;
  margin: 149px auto 0;
  h2 {
    height: 35px;
    font-family: SourceHanSansCN-Regular;
    font-size: 35px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 35px;
    letter-spacing: 0px;
    color: #333333;
    text-align: center;
  }
  .btn {
    display: block;
    padding: 13px 45px;
    background-color: #22b9ff;
    border-radius: 10px;
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #ffffff;
    cursor: pointer;
    text-align: center;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .imp_file {
    width: 585px;
    margin-top: 55px;
    height: 70px;
    line-height: 40px;
  }
  .private_wrap {
    width: 585px;
    margin: 0 auto;
    p {
      height: 20px;
      font-family: SourceHanSansCN-Normal;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 20px;
      letter-spacing: 0px;
      color: #535353;
      margin-top: 59px;
    }
    textarea {
      width: 100%;
      height: 159px;
      background-color: #dcdcdc;
      border-radius: 10px;
      border: solid 1px #ffffff;
      box-sizing: border-box;
      padding: 20px;
      margin-top: 8px;
      outline: none;
    }
  }

  .goon {
    width: 132px;
    height:45px;
    margin-top: 64px;
    border-radius: 4px;
  }
}
</style>