<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <div class="success_hd">
        <i></i>交易成功！
      </div>
      <p class="p1">TX was broadcast to the blockchain. Click to see your transaction & verify it was mined and dose not have any out of gas or contract execution errors. </p>
      <p class="p2">TX ID:
        <span>{{tx_id}}</span>
      </p>
      <div class="btn" @click="gotoFirstStep">继续转账</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tx_id: this.$store.state.transaction.tx_id
    };
  },

  components: {},

  mounted() {},

  methods: {
    gotoFirstStep() {
      this.$router.push({ name: "transaction" });
    }
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  .success_hd {
    font-family: SourceHanSansCN-Normal;
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 58px;
    letter-spacing: 0px;
    color: #535353;
    margin-top: 49px;
    i {
      vertical-align: middle;
      display: inline-block;
      width: 58px;
      height: 58px;
      background: url(../assets/icons/transactionSuccess.png);
      margin-right: 15px;
    }
  }
  .p1,
  .p2 {
    font-family: SourceHanSansCN-Normal;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 24px;
    letter-spacing: 0px;
    color: #535353;
    margin-top: 72px;
  }
  .p2 {
    span {
      font-size: 25px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #323232;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
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