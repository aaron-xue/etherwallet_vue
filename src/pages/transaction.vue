<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <input type="text" class="input" placeholder="收款人钱包地址" v-model="txData.to">
      <input type="text" class="input" placeholder="转账金额" v-model="txData.value">
      <input type="text" class="input" placeholder="矿工费用" v-model="txData.gasLimit">
      <div class="btn" @click="nextStep">下一步</div>
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
      }
    };
  },

  components: {},
  created() {
    this.txData.from = this.$store.state.wallet.getAddressString();
    this.txData.privKey = this.$store.state.wallet.getPrivateKeyString();
  },
  mounted() {
    this.getGasLimit();
  },

  methods: {
    nextStep() {
      if (!this.globalutil.validateEtherAddress(this.txData.to)) {
        this.toast.toastFaill("地址错误", "请填写正确的收款人地址");
        setTimeout(() => {
          this.toast.closeToast();
        }, 2000);
        return;
      }
      this.myFetch
        .postMany([
          {
            method: "eth_getBalance",
            params: [this.$store.state.wallet.getAddressString(), "pending"]
          },
          {
            method: "eth_gasPrice",
            params: []
          },
          {
            method: "eth_getTransactionCount",
            params: [this.$store.state.wallet.getAddressString(), "pending"]
          }
        ])
        .then(res => {
          var balance = this.globalutil.toEther(res.data[0].result, "wei");
          if (balance < this.txData.value) {
            this.toast.toastFaill("余额不足", "请确保余额充足");
            setTimeout(() => {
              this.toast.closeToast();
            }, 2000);
            return;
          }
          this.txData.gasPrice = res.data[1].result;
          this.txData.nonce = res.data[2].result;
          this.$store.commit("createTxData", this.txData);
          this.$router.push({ name: "transactionStep2" });
        });
    },
    getGasLimit() {
      this.myFetch
        .post("eth_blockNumber", [])
        .then(res => {
          this.myFetch
            .post('eth_getBlockByNumber',[res.data.result,true])
            .then(res=>{
              this.txData.gasLimit = this.globalutil.toEther(res.data.result.gasLimit);
            })
        });
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 700px;
  .input {
    display: block;
    width: 100%;
    height: 26px;
    outline: none;
    background: rgba(0, 0, 0, 0);
    border: none;
    border-bottom: 1px rgba(39, 45, 58, 0.3) solid;
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 26px;
    letter-spacing: 0px;
    color: #989898;
    margin-top: 54px;
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
  }
}
</style>