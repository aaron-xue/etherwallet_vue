<!--  -->
<template>
  <div id="ip_wrap" :width='width' :height='height'>
    <input :type="ip_type" @input="$emit('input', $event.target.value)" :width='width' :height='height' ref="input">
    <i id="eye" :class="[type,isOpen]" @click="changeOpen"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ip_type: "password",
      isOpen: "open"
    };
  },
  props: ["type", "value", "readonly", "width", "height"],

  mounted() {
    if (this.$props.readonly === "readonly") {
      this.$refs.input.setAttribute("readonly", "readonly");
    }
  },

  methods: {
    changeOpen() {
      if (this.isOpen === "open") {
        this.isOpen = "close";
        this.ip_type = "text";
        return;
      } else {
        this.isOpen = "open";
        this.ip_type = "password";
      }
    }
  }
};
</script>
<style lang='less' scoped>
#ip_wrap {
  position: relative;
  width: 822px;
  height: 70px;

  input {
    width: 822px;
    height: 70px;
    background-color: #dcdcdc;
    border-radius: 10px;
    border: solid 1px #ffffff;
    outline: none;
    padding-left: 20px;
    box-sizing: border-box;
  }
  #eye {
    position: absolute;
    top: 29px;
    right: 28px;
    width: 19px;
    height: 12px;
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
  }
  .open {
    background: url(../assets/icons/eye_open.png);
  }
  .close {
    background: url(../assets/icons/eye_close.png);
  }
  .password {
    display: block;
  }
  .text {
    display: none;
  }
}
</style>