<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <h2>导入钱包</h2>
      <div id="main_tab">
        <router-link tag="div" :to="{name:'importByUTC'}" active-class="main_tab_active">keystore File(UTC)</router-link>
        <i></i>
        <router-link tag="div" :to="{name:'importByPrivateKey'}" active-class="main_tab_active">私钥</router-link>
      </div>
      <router-view> </router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 823px;
  height: 632px;
  margin-top: 104px;
  margin-left: 139px;
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
  #main_tab {
    height: 64px;
    font-size: 0;
    line-height: 64px;
    margin-top: 64px;
    i {
      display: inline-block;
      width: 4px;
      height: 54px;
      vertical-align: middle;
      background-color: #dcdcdc;
      margin:0 16px;
    }
    div {
      box-sizing: border-box;
      height: 64px;
      display: inline-block;
      line-height: 64px;
      font-size: 30px;
      vertical-align: middle;
      cursor: pointer;
      font-family: SourceHanSansCN-Regular;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: rgba(51, 51, 51, 0.6);
    }
    .main_tab_active{
      color: #333333;
      border-bottom: 5px #707070 solid;
    }
  }
}
</style>