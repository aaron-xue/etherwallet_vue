<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <p class="p1">您将发送
        <span>0.5ETH</span>到地址:</p>
      <p class="p2">0x116818dBF7F2Ef1AD5083dD686e4b889F5aaaDC0</p>
      <p class="p3">You are interacting with the ETH chain,provided by MyEtherWallet.<br>你确定这样做吗？

      </p>
      <div class="btn" @click="lastStep">上一步</div>
      <div class="btn" @click="sendTransaction">转账</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      txData: {
        to: "",
        value: "",
        unit: "ether",
        gasLimit: "",
        data: "",
        from: "",
        privKey: "",
        path: "",
        hwType: "",
        hwTransport: "",
        gasPrice: "",
        nonce: ""
      },
      transaction:{
        tx_id:''
      }
    };
  },

  components: {},
  created() {
    this.txData = this.$store.state.txData;
  },

  mounted() {},

  methods: {
    lastStep() {
      this.$router.go(-1);
    },
    nextStep() {},
    //转账
    sendTransaction() {
      if (this.txData.gasPrice && this.txData.nonce)
        this.txData.isOffline = true;
      this.globalutil.generateTx(this.txData, rawTx => {
        console.log(rawTx);
        if (!rawTx.isError) {
          this.myFetch
            .post("eth_sendRawTransaction", [`0x${rawTx.signedTx}`])
            .then(res => {
              this.transaction.tx_id = res.data.result;
              this.$store.commit("createTransaction", this.transaction);
              this.$router.push({ name: "transactionSuccess" });
            });
        } else {
          this.toast.toastFaill("转账失败", "请重新转账");
          setTimeout(() => {
            this.toast.closeToast();
            this.$router.go(-1);
          }, 2000);
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 700px;
  .p1 {
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 41px;
    letter-spacing: 0px;
    color: #535353;
    margin-top: 91px;
    span {
      font-size: 25px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #323232;
    }
  }
  .p2 {
    font-family: SourceHanSansCN-Normal;
    font-size: 25px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 41px;
    letter-spacing: 0px;
    color: #323232;
  }
  .p3 {
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 43px;
    letter-spacing: 0px;
    color: #535353;
    margin-top: 33px;
  }
  .btn {
    display: inline-block;
    margin-top: 30px;
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
    margin-right: 10px;
  }
}
</style>