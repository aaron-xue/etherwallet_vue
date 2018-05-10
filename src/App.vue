<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data(){
    return {
      blobEnc: "241241",
      encFileName: "",
      privateKeyString:''
    };
  },
  name: "App",
  created(){
    if (!this.$store.state.wallet.privKey) {
      this.$router.push({ name: 'createWallet'});
    }
  }
};
</script>

<style lang='less'>
#app {
  width: 1280px;
  margin: 0 auto;
  background-color: #eeeeee;
  min-height: 100%;
}
</style>
