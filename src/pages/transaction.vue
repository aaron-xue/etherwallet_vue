<!--  -->
<template>
  <div>
    <div class="item_wrap">
      <div class="head">
        <img :src="`../../static/img/${$route.params.transaction}-icon.png`">
        <span>{{$route.params.transaction}}</span>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },

  components: {},
  created() {
  },
  mounted() {
  },

  methods: {
  }
};
</script>
<style lang='less' scoped>
.item_wrap {
  width: 501px;
  .head {
    img {
      width: 66px;
      height: 66px;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      font-family: SourceHanSansCN-Regular;
      font-size: 36px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #a3a3a3;
      vertical-align: middle;
      margin-left: 18px;
    }
  }
}
</style>