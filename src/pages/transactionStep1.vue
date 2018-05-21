<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h3>转账：</h3>
      <input type="text" class="input" placeholder="收款人钱包地址" v-model="txData.to" v-if="$route.params.transaction === 'ETH'">
      <input type="text" class="input" placeholder="收款人钱包地址" v-model="mgyData.mgy_address" v-if="$route.params.transaction === 'MGY'">
      <input type="text" class="input" placeholder="转账金额" v-model="txData.value" v-if="$route.params.transaction === 'ETH'">
      <input type="text" class="input" placeholder="转账金额" v-model="mgyData.mgy_value" v-if="$route.params.transaction === 'MGY'">
      <input type="text" class="input" :placeholder="`Gas Limit : ${gasLimit}`" v-model="txData.gasLimit">
      <h4>Gas Price <span>{{txData.gasPrice}}</span> </h4>
      <input type="range" class="ip_range" min="1" max="99" v-model="txData.gasPrice">
      <div class="btn" @click="nextStep">下一步</div>
    </div>
  </div>
</template>

<script>
import conTractCtrl from "../utils/conTractCtrl";
import contract from "../utils/contract";

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
        gasPrice: 1,
        nonce: ""
      },
      mgyData: {
        mgy_value: 0,
        mgy_address: ""
      },
      gasLimit: ""
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
        this.txData.data = conTractCtrl.getTxData(9, {
          address: this.mgyData.mgy_address,
          uint256: this.mgyData.mgy_value
        });
        this.txData.to = contract.contractAddress;
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
            method: "eth_getTransactionCount",
            params: [this.$store.state.wallet.getAddressString(), "pending"]
          }
        ])
        .then(res => {
          var balance = this.globalutil.toEther(res.data[0].result, "wei");
          console.log(balance, this.txData.value);

          if (parseFloat(balance) < parseFloat(this.txData.value)) {
            this.toast.toastFaill("余额不足", "请确保余额充足");
            setTimeout(() => {
              this.toast.closeToast();
            }, 2000);
            return;
          }
          this.txData.nonce = res.data[1].result;
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
            this.gasLimit = this.globalutil.toEther(res.data.result.gasLimit);
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
  .ip_range {
    display: block;
    margin-top: 29px;
    width: 500px;
    cursor: pointer;
    background-color: rgba(39, 45, 58, 0.3);
    height: 1px;
  }
  input[type="range"] {
    -webkit-appearance: none;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    border-top: 5px solid #fff;
    border-bottom: 5px solid #fff;
  }
  input[type="range"]::-moz-range-track {
    border-top: 5px solid #fff;
    border-bottom: 5px solid #fff;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 23px;
    width: 23px;
    background-color: #22b9ff;
    border-radius: 50%;
  }
  input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    height: 23px;
    width: 23px;
    background-color: #22b9ff;
    border-radius: 50%;
  }
  h4 {
    height: 20px;
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 20px;
    letter-spacing: 0px;
    color: #989898;
    margin-top: 55px;
    span {
      float: right;
    }
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