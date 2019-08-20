<template>
  <div class="chat">
    <div v-if="userInfo.id">聊天</div>
    <select-login v-else />
  </div>
</template>

<script>
import SelectLogin from "./../Login/SelectLogin";
import { mapState } from "vuex";
export default {
  name: "Chat",
  computed: {
    ...mapState(["userInfo"])
  },
  components: {
    SelectLogin
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.chat {
  background: deepskyblue;
  width: 100%;
  height: 100%;
}
</style>
