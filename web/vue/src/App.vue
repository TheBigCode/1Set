<template>
  <div id="app">
    <div>
      <router-view></router-view>
    </div>
    <tab-bar v-show="$route.meta.showBottomTabBar" class="bottom-view"></tab-bar>
  </div>
</template>

<script>
import TabBar from './components/TabBar/TabBar'

export default {
  name: 'App',
  created () {
    this.$store.dispatch('getUserInfo')
  },
  components: {
    TabBar
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.bottom-view {
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
}


</style>
