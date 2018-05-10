<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>账户详情</h2>
      <div class='account'>
        <img src="../assets/icons/head_img.png" alt="head_img">
        <span>{{address_from}}</span>
      </div>
      <div class="row1">
        <div class="balance">
          <div class="balance_th">余额
            <i :class="showBalance?'close':'open'" @click="showBalance_method"></i>
          </div>
          <div class="balance_td">ETH:
            <span>{{showBalance?balance:'****'}}</span>
          </div>
        </div>
        <div class="keystore">
          <div class="keystore_th">Keystore File (UTC / JSON · 推荐加密的)</div>
          <a class="keystore_dl" :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc">点击下载</a>
        </div>
      </div>
      <div class="row2">
        <div></div>
        <div class="privatekey">
          <div class="privatekey_th">私钥
            <i :class="showPrivateKey?'close':'open'" @click="showPrivateKey_method"></i>
          </div>
          <div class="privatekey_td">
            {{showPrivateKey?privateKeyString:'****'}}
          </div>
        </div>
      </div>
      <div class="row3">
        <div class="transaction">
          <h3>转账</h3>
          <router-view> </router-view>
        </div>
        <div class="gathering">
          <h3>收款</h3>
          <div class="qrcode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBalance: false,
      showPrivateKey: false,
      address_from: "",
      balance: "",
      blobEnc: "",
      encFileName: "",
      privateKeyString: ""
    };
  },

  components: {},
  created() {
    this.address_from = this.$store.state.wallet.getAddressString();
    this.getBalance();
    this.blobEnc = this.globalutil.getBlob(
      "text/json;charset=UTF-8",
      this.$store.state.wallet.toV3(this.$store.state.account.password, {
        kdf: this.kdf,
        n: this.scrypt_n
      })
    );
    this.encFileName = this.$store.state.wallet.getV3Filename();
    this.privateKeyString = this.$store.state.wallet.getPrivateKeyString();
  },

  mounted() {},

  methods: {
    //获取账户余额
    getBalance() {
      this.myFetch
        .post("eth_getBalance", [this.address_from, "latest"])
        .then(res => {
          this.balance = this.globalutil.toEther(res.data.result, "wei");
        });
    },
    showBalance_method() {
      this.showBalance = !this.showBalance;
    },
    showPrivateKey_method() {
      this.showPrivateKey = !this.showPrivateKey;
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 1031px;
  height: 1090px;
  margin: 104px auto 0;
  h2 {
    height: 40px;
    font-family: SourceHanSansCN-Regular;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 40px;
    letter-spacing: 0px;
    color: #333333;
  }
  .account {
    height: 66px;
    line-height: 66px;
    margin-top: 37px;
    width: 100%;
    img {
      display: inline-block;
      width: 66px;
      height: 66px;
      vertical-align: middle;
      margin-right: 36px;
    }
    span {
      height: 25px;
      font-family: SourceHanSansCN-Regular;
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 25px;
      letter-spacing: 0px;
      color: #333333;
      vertical-align: middle;
    }
  }
  .row1 {
    width: 100%;
    font-size: 0;
    margin-top: 95px;
    div {
      display: inline-block;
      width: 50%;
      font-size: 0;
    }
    .balance {
      overflow: hidden;
      div {
        display: block;
      }
      .balance_th {
        height: 25px;
        font-family: SourceHanSansCN-Normal;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #535353;
        i {
          cursor: pointer;
          background-position: center;
          background-repeat: no-repeat;
          display: inline-block;
          width: 19px;
          height: 12px;
          margin-left: 16px;
        }
      }
      .balance_td {
        height: 25px;
        font-family: SourceHanSansCN-Medium;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #2c2c2c;
        margin-top: 29px;
        span {
          margin-left: 16px;
        }
      }
    }
    .keystore {
      overflow: hidden;
      div {
        display: block;
        width: 100%;
      }
      .keystore_th {
        height: 25px;
        font-family: SourceHanSansCN-Normal;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #535353;
      }
      .keystore_dl {
        display: inline-block;
        width: 112px;
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
  }
  .row2 {
    width: 100%;
    font-size: 0;
    margin-top: 106px;
    div {
      display: inline-block;
      width: 50%;
      font-size: 0;
    }
    .privatekey {
      overflow: hidden;
      div {
        display: block;
      }
      .privatekey_th {
        height: 25px;
        font-family: SourceHanSansCN-Normal;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #535353;
        i {
          cursor: pointer;
          background-position: center;
          background-repeat: no-repeat;
          display: inline-block;
          width: 19px;
          height: 12px;
          margin-left: 16px;
        }
      }
      .privatekey_td {
        height: 25px;
        font-family: SourceHanSansCN-Medium;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #2c2c2c;
        margin-top: 29px;
      }
    }
  }
  .row3 {
    width: 100%;
    font-size: 0;
    margin-top: 95px;
    div {
      display: inline-block;
      font-size: 0;
      overflow: hidden;
      vertical-align: top;
    }
    .transaction {
      width: 700px;
      margin-right: 66px;
      h3 {
        height: 25px;
        font-family: SourceHanSansCN-Normal;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #535353;
      }
    }
    .gathering {
      width: 200px;
      h3 {
        height: 25px;
        font-family: SourceHanSansCN-Normal;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 25px;
        letter-spacing: 0px;
        color: #535353;
      }
      .qrcode {
        width: 199px;
        height: 199px;
        background-color: #b5b5b5;
        margin-top: 41px;
      }
    }
  }
  .open {
    background: url(../assets/icons/eye_open.png);
  }
  .close {
    background: url(../assets/icons/eye_close.png);
  }
}
</style>