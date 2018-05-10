<!--  -->
<template>
  <div>
    <div id="main_head">
      <i id="logo"></i>
      <div id="main_tab">
        <router-link tag="div" :to="{name:'createWallet'}" active-class="main_tab_active">创建钱包</router-link>
        <router-link tag="div" :to="{name:'importWallet'}" active-class="main_tab_active">导入钱包</router-link>
      </div>
    </div>
    <div id="main_head_line"></div>
    <router-view> </router-view>
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
#main_head {
  width: 100%;
  height: 102px;
  background-image: linear-gradient(-90deg, #2cb0fc 0%, #123f58 100%);
  line-height: 102px;
  #logo {
    display: inline-block;
    width: 251px;
    height: 50px;
    background: url(../assets/logo.png);
    vertical-align: middle;
    margin-left: 54px;
  }
  #main_tab {
    float: right;
    height: 100%;
    font-size: 0;
    margin-right: 20px;
    div {
      display: inline-block;
      width: 130px;
      height: 100%;
      cursor: pointer;
      font-size: 20px;
      color: #fff;
      line-height: 102px;
      text-align: center;
    }
    .main_tab_active {
      background-color: #2078aa;
    }
  }
}
#main_head_line {
  width: 100%;
  height: 8px;
  background-image: linear-gradient(-90deg, #f877bf 0%, #159ff2 100%);
}
</style>