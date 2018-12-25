<template>
  <div>
    <cube-tab-bar
      class="tab-bar"
      v-model="selectedLabelDefault"
      :data="tabs"
      @click="clickHandler"
      @change="changeHandler"
    ></cube-tab-bar>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  data () {
    return {
      selectedLabelDefault: '首页',
      tabs: [{
        label: '首页',
        icon: 'cubeic-home'
      }, {
        label: '推荐',
        icon: 'cubeic-hot'
      }, {
        label: '搜索',
        icon: 'cubeic-search'
      }, {
        label: '消息',
        icon: 'cubeic-message'
      }, {
        label: '我的',
        icon: 'cubeic-person'
      }]
    }
  },
  methods: {
    switchTo (path) {
      console.log(path)
      this.$router.replace(path)
    },
    clickHandler (label) {
      switch (label) {
        case '首页':
          this.switchTo('/home')
          break
        case '推荐':
          this.switchTo('/recommend')
          break
        case '搜索':
          this.switchTo('/search')
          break
        case '消息':
          this.switchTo('/chat')
          break
        case '我的':
          this.switchTo('/me')
          break
      }
    },
    changeHandler (label) {
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.tab-bar {
  color: red;
}
</style>
