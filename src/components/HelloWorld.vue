<template>
  <div class="hello">
    <child>
      <p slot-scope="{msg}">{{$store.state.wallet.type}}</p>
    </child>
    <input type="password" class="input_pw" v-model="passWord">
    <div>
      <span @click="creatWallet(passWord)" class="btn">生成钱包</span>
    </div>
    <a :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc" class="btn">
      <span>下载 Keystore文件（UTC / JSON）</span>
    </a>
    <div>
      <h2>通过私钥解锁钱包</h2>
      <textarea v-model="privateKeyString" aria-label="私钥（未加密）" aria-describedby="这是未加密的文本格式私钥文件，这意味发送交易不需要密码。 如果某个人拿到了你的未加密的私钥，他们无需密码就能够控制你的钱包。 出于这个考虑，我们推荐你使用加密的私钥文件。 " class="form-control" readonly="readonly" rows="3"></textarea>
      <div>
        <span @click="decryptWalletPrivKey" class="btn">通过私钥解锁钱包</span>
      </div>
    </div>
    <div>
      <h2>通过钱包文件解锁钱包</h2>
      <input type="file" @change="getFileContent($event)">
      <input type="password" class="input_pw" v-model="passWord" placeholder="输入钱包密码">
      <div>
        <span @click="decryptWalletByFile" class="btn">通过钱包文件解锁钱包</span>
      </div>
    </div>
    <div>
      <h2>解锁后钱包信息</h2>
      <h3>地址</h3>
      <input type="text" readonly='readonly' :value="account.address">
      <h3>Keystore File（UTC / JSON·推荐加密的）</h3>
      <a :href="blobEnc" :download="encFileName" aria-label="下载 Keystore File (UTC / JSON · 推荐加密的) " aria-describedby="x_KeystoreDesc" class="btn">
        <span>下载 Keystore文件（UTC / JSON）</span>
      </a>
      <h3>私钥（未加密）</h3>
      <input type="text" readonly='readonly' :value="privateKeyString">
    </div>

    <div>
      <h2>钱包操作</h2>
      <div>账户余额
        <span>{{balance}}</span>
      </div>
      <div>
        <span class="btn" @click="getBalance">获取余额</span>
      </div>
      <div>
        <h2>转账</h2>
        <div>
          转入用户地址<input type="text" v-model="sendTransactionAddress">
        </div>
        <div>
          金额<input type="number" v-model="sum">
        </div>
        <div>
          <span class="btn" @click="sendTransaction">转账</span>
        </div>
        <div>
          交易
          <p>{{transaction}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import child from "./child";
import walletCtrl from "../utils/walletCtrl";

export default {
  data() {
    return {
      wallet: {
        privKey: "",
        pubKey: "",
        type: ""
      },
      account: {
        address: "",
        nickName: "",
        encStr: "",
        password: ""
      },
      passWord: "",
      blobEnc: "",
      encFileName: "",
      privateKeyString: "",
      fileContent: "",
      balance: "",
      sendTransactionAddress: "",
      sum: 0,
      transaction: ""
    };
  },
  methods: {
    creatWallet(passWord) {
      this.wallet = walletCtrl.genNewWallet(passWord);
      this.addAccount(passWord, "aaron");
    },
    addAccount(passWord, nickName) {
      this.account.nickName = nickName;
      this.account.password = passWord;
      this.account.address = this.wallet.getAddressString();
      var wStr = this.wallet.toV3(passWord, {
        kdf: this.kdf,
        n: this.scrypt_n
      });
      this.account.encStr = JSON.stringify(wStr);
      this.$store.commit("setAccount", this.account);
      if (this.account.password != "") {
        this.blobEnc = this.globalutil.getBlob(
          "text/json;charset=UTF-8",
          this.wallet.toV3(this.account.password, {
            kdf: this.kdf,
            n: this.scrypt_n
          })
        );
        this.encFileName = this.wallet.getV3Filename();
      }
      this.privateKeyString = this.wallet.getPrivateKeyString();
    },
    //通过私钥解锁钱包
    decryptWalletPrivKey() {
      this.wallet = walletCtrl.fromMyEtherWalletKey(this.privateKeyString);

      if (this.wallet != null) {
        this.account.address = this.wallet.getAddressString();

        var web3 = new Web3();
        web3.setProvider(
          new web3.providers.HttpProvider(
            "https://ropsten.infura.io/1ZMDPvoZXyBvc0Nkn2Ux"
          )
        );
        var balance = web3.eth.getBalance(this.account.address).toString();
        this.balance = balance;
      }
    },
    //通过钱包文件解锁钱包
    decryptWalletByFile() {
      this.wallet = walletCtrl.getWalletFromPrivKeyFile(
        this.fileContent,
        this.passWord
      );
      if (this.passWord != "") {
        this.blobEnc = this.globalutil.getBlob(
          "text/json;charset=UTF-8",
          this.wallet.toV3(this.passWord, {
            kdf: this.kdf,
            n: this.scrypt_n
          })
        );
        this.encFileName = this.wallet.getV3Filename();
      }
      this.privateKeyString = this.wallet.getPrivateKeyString();
      this.account.address = this.wallet.getAddressString();
    },
    //获取账户余额
    getBalance() {
      // this.balance = this.web3.eth.getBalance(this.account.address).toString();
      this.myFetch
        .post("eth_getBalance", [this.account.address, "latest"])
        .then(res => {
          var balance = this.globalutil.toEther(res.data.result, "wei");
          console.log(balance);
        });
    },
    //转账
    sendTransaction() {
      if (!this.globalutil.validateEtherAddress(this.sendTransactionAddress)) {
        return;
      }
      var txData = {
        to: this.sendTransactionAddress,
        value: this.sum,
        unit: "ether",
        gasLimit: 21000,
        data: "",
        from: this.account.address,
        privKey: this.privateKeyString,
        path: this.wallet.path,
        hwType: this.wallet.hwType,
        hwTransport: this.wallet.hwTransport
      };
      this.myFetch
        .postMany([
          {
            method: "eth_getBalance",
            params: [this.account.address, "pending"]
          },
          {
            method: 'eth_gasPrice',
            params: []
          },
          {
            method: "eth_getTransactionCount",
            params: [this.account.address, "pending"]
          }
        ])
        .then(res => {
          var balance = this.globalutil.toEther(res.data[0].result, "wei");
          if (balance < this.sum) {
            console.log("余额不足");
            return;
          }
          txData.gasPrice = res.data[1].result;
          txData.nonce = res.data[2].result;
        })
        .then(res => {
          if (txData.gasPrice && txData.nonce) txData.isOffline = true;
          this.globalutil.generateTx(txData, rawTx => {
            console.log(rawTx);
            if (!rawTx.isError) {
              console.log(rawTx.rawTx);
              console.log(rawTx.signedTx);
              this.myFetch
                .post("eth_sendRawTransaction", [`0x${rawTx.signedTx}`])
                .then(res => {
                  console.log(res);
                });
            } else {
              console.log("faill");
            }
          });
        });
    },
    getFileContent(event) {
      var _this = this;
      var reader = new FileReader();
      reader.onload = function(onLoadEvent) {
        _this.fileContent = onLoadEvent.target.result;
      };
      reader.readAsText((event.srcElement || event.target).files[0]);
    }
  },
  created() {
    
    
  },
  components: {
    child
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.btn {
  background-image: none;
  cursor: pointer;
  border: 1px solid gray;
  display: inline-block;
  color: #000;
}
</style>
