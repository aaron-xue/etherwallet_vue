<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>保存keystore和私钥，不要忘记你的密码。</h2>
      <a class="btn imp_file" :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc">下载keystore File（UTC）</a>
      <p>私钥</p>
      <textarea :value='privateKeyString' readonly></textarea>
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
      passWord:''
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
      this.$router.push({ name: 'myWallet'});
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 823px;
  height: 689px;
  margin: 222px auto 0;
  h2 {
    height: 40px;
    font-family: SourceHanSansCN-Regular;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #333333;
    text-align: center;
  }
  .btn {
    display: block;
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
    text-align: center;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .imp_file {
    box-sizing: border-box;
    width: 100%;
    margin-top: 45px;
  }
  p {
    height: 25px;
    font-family: SourceHanSansCN-Normal;
    font-size: 25px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 25px;
    letter-spacing: 0px;
    color: #535353;
    margin-top: 55px;
  }
  textarea {
    width: 100%;
    height: 167px;
    background-color: #dcdcdc;
    border-radius: 10px;
    border: solid 1px #ffffff;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 8px;
    outline: none;
  }
  .goon {
    width: 220px;
    height: 70px;
    margin-top: 94px;
  }
}
</style>