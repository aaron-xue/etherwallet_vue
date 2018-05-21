<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>账户详情</h2>
      <div :class="['account_wrap',showTransaction?'account_wrap_transform':'']">
        <img src="../assets/icons/head_img.png">
        <h3>你的地址：</h3>
        <p>{{address_from}}</p>
        <div class="line"></div>
        <h3>余额</h3>
        <router-link tag="div" :to="{name:'transaction',params:{transaction:'ETH'}}" class="icon-ETH links" active-class="link_active" @click.native="showTransactionFn">
          ETH:&nbsp;
          <span>{{balance}}</span>
          <i>转账</i>
        </router-link>
        <router-link tag="div" :to="{name:'transaction',params:{transaction:'MGY'}}" class="icon-MGY links" active-class="link_active" @click.native="showTransactionFn">
          MGY:
          <span>{{balance_mgy}}</span>
          <i>转账</i>
        </router-link>
        <div class="line"></div>
        <div class="tran_history">交易历史
          <a :href="`https://ropsten.etherscan.io/address/${address_from}`">查看</a>
        </div>
        <div class="line"></div>
        <div class="row">
          <div class="left">
            <h3 v-if="$store.state.account">Keystore File</h3>
            <p v-if="$store.state.account">(UTC / JSON 推荐加密的)</p>
            <a class="imp_file" :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc" v-if="$store.state.account">点击下载</a>
          </div>
          <div class="right">
            <h3>收款</h3>
            <div class="qrcode">
              <canvas ref="qrcode"></canvas>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <router-view class="transaction_wrap"> </router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import conTractCtrl from "../utils/conTractCtrl";
import contract from '../utils/contract'

export default {
  data() {
    return {
      showTransaction: false,
      address_from: "",
      balance: "0",
      balance_mgy: "0",
      blobEnc: "",
      encFileName: "",
      privateKeyString: ""
    };
  },

  components: {},
  created() {
    this.address_from = this.$store.state.wallet.getAddressString();
    this.getBalance();
    if (this.$store.state.account) {
      this.blobEnc = this.globalutil.getBlob(
        "text/json;charset=UTF-8",
        this.$store.state.wallet.toV3(this.$store.state.account.password, {
          kdf: this.kdf,
          n: this.scrypt_n
        })
      );
      this.encFileName = this.$store.state.wallet.getV3Filename();
    }
    this.privateKeyString = this.$store.state.wallet.getPrivateKeyString();
  },

  mounted() {
    QRCode.toCanvas(
      this.$refs.qrcode,
      this.address_from,
      { width: 127 },
      function(error) {}
    );
    this.bus.$on("updateMyWallet", ()=> {
      this.getBalance();
    });
  },

  methods: {
    //获取账户余额
    getBalance() {
      this.myFetch
        .postMany([
          {
            method: "eth_getBalance",
            params: [this.address_from, "pending"]
          },
          {
            method: "eth_call",
            params: [
              {
                to: contract.contractAddress,
                data: conTractCtrl.getTxData(5, {
                  address: this.address_from
                })
              },
              "pending"
            ]
          }
        ])
        .then(res => {
          this.balance = this.globalutil.toEther(res.data[0].result, "wei");
          this.balance_mgy = this.globalutil.toEther(res.data[1].result, "wei");
        });
    },
    showTransactionFn() {
      if (this.showTransaction) {
        return;
      }
      this.showTransaction = !this.showTransaction;
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  position: relative;
  width: 1028px;
  height: 723px;
  margin: 104px auto 0;
  h2 {
    font-family: SourceHanSansCN-Regular;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #333333;
  }
  .account_wrap {
    position: absolute;
    top: 36px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 350px;
    height: 649px;
    background-color: #ffffff;
    box-shadow: -1px 0px 10px 0px rgba(0, 0, 0, 0.14);
    border-radius: 10px;
    margin: 36px auto 0;
    padding: 25px 38px 0;
    -webkit-transition: 0.5s;
    -moz-transition: 0.5s;
    img {
      width: 66px;
      height: 66px;
      display: block;
      margin-bottom: 32px;
    }
    h3 {
      display: inline-block;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 20px;
      letter-spacing: 0px;
      color: #535353;
    }
    p {
      width: 329px;
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 24px;
      letter-spacing: 0px;
      color: #010101;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      margin-top: 20px;
    }
    .line {
      height: 1px;
      background-color: rgba(39, 45, 58, 0.3);
      opacity: 0.3;
      margin: 25px 0;
    }
    .links {
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 24px;
      letter-spacing: 0px;
      margin-top: 19px;
      cursor: pointer;
      i {
        float: right;
      }
      span {
        display: inline-block;
        width: 200px;
        overflow: hidden;
        vertical-align: top;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .link_active {
      color: #22b9ff;
      &::before {
        color: #22b9ff;
      }
    }
    .tran_history {
      font-family: SourceHanSansCN-Normal;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 24px;
      letter-spacing: 0px;
      color: #535353;
      a {
        float: right;
        color: #989898;
        &:active {
          color: #22b9ff;
        }
      }
    }
    .row {
      height: 153px;
      .left {
        width: 171px;
        display: inline-block;
        vertical-align: top;
        p {
          font-family: SourceHanSansCN-Normal;
          font-size: 15px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 15px;
          letter-spacing: 0px;
          color: #989898;
          margin-top: 4px;
        }
        .imp_file {
          display: inline-block;
          width: 100px;
          height: 36px;
          border-radius: 4px;
          border: solid 1px #707070;
          font-family: SourceHanSansCN-Normal;
          line-height: 36px;
          font-size: 20px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #535353;
          text-align: center;
          cursor: pointer;
          margin-top: 21px;
        }
      }
      .right {
        width: 128px;
        display: inline-block;
        vertical-align: top;
        margin-left: 45px;
        .qrcode {
          width: 127px;
          height: 127px;
          background-color: #b5b5b5;
          margin-top: 7px;
        }
      }
    }
  }
  .account_wrap_transform {
    transform: translateX(-71%);
  }
  .transaction_wrap {
    position: absolute;
    top: 72px;
    right: 0;
    width: 500px;
    height: 649px;
    background-color: #ffffff;
    box-shadow: -1px 0px 10px 0px rgba(0, 0, 0, 0.14);
    border-radius: 10px;
    padding: 25px 22px 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>