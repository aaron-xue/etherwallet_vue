<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h3>转账：</h3>
      <input type="text" class="input" placeholder="收款人钱包地址" v-model="txData.to" v-if="$route.params.transaction === 'ETH'">
      <input type="text" class="input" placeholder="收款人钱包地址" v-model="mgyData.mgy_address" v-if="$route.params.transaction === 'MGY'">
      <input type="text" class="input" placeholder="转账金额" v-model="txData.value" v-if="$route.params.transaction === 'ETH'">
      <input type="text" class="input" placeholder="转账金额" v-model="mgyData.mgy_value" v-if="$route.params.transaction === 'MGY'">
      <input type="text" class="input" placeholder="矿工费用" v-model="txData.gasLimit">
      <div class="btn" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
import conTractCtrl from "../utils/conTractCtrl";

export default {
  data() {
    return {
      txData: {
        to: "",
        value: 0,
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
      mgyData: {
        mgy_value: 0,
        mgy_address: ""
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
      if (this.$route.params.transaction === "MGY") {
        this.txData.data = conTractCtrl.getTxData(7, {
          address: this.mgyData.mgy_address,
          uint256: this.mgyData.mgy_value
        });
        this.txData.to = "0x9975927293095e17E89C5122628a7461D1E21DDC";
      }
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
          this.$store.commit("createMgyData", this.mgyData);
          this.$router.push({ name: "transactionStep2" });
        });
    },
    getGasLimit() {
      this.myFetch.post("eth_blockNumber", []).then(res => {
        this.myFetch
          .post("eth_getBlockByNumber", [res.data.result, true])
          .then(res => {
            this.txData.gasLimit = this.globalutil.toEther(
              res.data.result.gasLimit
            );
          });
      });
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  h3 {
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
}
</style>