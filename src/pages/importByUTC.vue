<!--  -->
<template>
  <div>
    <label class="btn imp_file">{{fileContent?'重新选择文件':'选择钱包文件'}}
      <input type="file" @change="getFileContent($event)" hidden>
    </label>
    <p>您的钱包被加密，请输入钱包密码：</p>
    <myInput readonly='' class="input" type='password' v-model="account.password" width='465px'></myInput>
    <div class="btn openclock" @click="decryptWalletByFile">解锁</div>
  </div>
</template>

<script>
import myInput from "../components/myInput";
import walletCtrl from "../utils/walletCtrl";
export default {
  data() {
    return {
      wallet: {},
      fileContent: "",
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
    getFileContent(event) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = function(onLoadEvent) {
        _this.fileContent = onLoadEvent.target.result;
      };
      reader.readAsText((event.srcElement || event.target).files[0]);
    },
    //通过钱包文件解锁钱包
    decryptWalletByFile() {
      if (!this.fileContent) {
        this.toast.toastFaill("导入钱包失败", "请上传钱包文件");
        setTimeout(() => {
          this.toast.closeToast();
        }, 2000);
        return;
      }
      this.wallet = walletCtrl.getWalletFromPrivKeyFile(
        this.fileContent,
        this.account.password
      );
      this.$store.commit("createWallet", this.wallet);
      this.$store.commit("createAccount", this.account);
      this.$router.push({ name: "myWallet" });
    }
  }
};
</script>
<style lang='less' scoped>
.btn {
  display: inline-block;
  margin-top: 50px;
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
.imp_file {
  height: 70px;
  box-sizing: border-box;
  width: 100%;
  margin-top: 45px;
  line-height: 40px;
  border-radius: 10px;
}
p {
  height: 20px;
  font-family: SourceHanSansCN-Normal;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: #535353;
  margin-top: 34px;
}
.input {
  margin-top: 7px;
}
.openclock {
  margin-top: 56px;
}
</style>