<template>
  <cube-scroll ref="scroll">
    <div class="hot">
      <!--1.轮播图-->
      <cube-slide ref="slide" :data="homecasual">
        <cube-slide-item
          v-for="(item, index) in homecasual"
          :key="index"
          @click.native="clickHandler(item, index)"
        >
          <a :href="item.url">
            <img :src="item.image" width="100%">
          </a>
        </cube-slide-item>
      </cube-slide>
      <!--2.中间导航-->
      <hot-nav/>
      <!--3.广告位-->
      <div class="hot-ad">
        <img src="./../../imgs/hot_ad/home_ad.gif" alt width="100%">
      </div>
      <!--4.商品的列表-->
      <hot-shop-list/>
    </div>
  </cube-scroll>
</template>

<script>

import HotNav from './HotNav'
import HotShopList from './HotShopList'

import {
  mapState
} from 'vuex'

export default {
  name: 'Hot',
  components: {
    HotNav,
    HotShopList
  },
  computed: {
    ...mapState(['homecasual'])
  },
  mounted () {
    // 1. 请求轮播图的数据
    this.$store.dispatch('reqHomeCasual')
    // 2.请求首页导航的数据
    this.$store.dispatch('reqHomeNav')
    // 3. 请求首页的商品列表数据
    this.$store.dispatch('reqHomeShopList')
  }
}
</script>

<style scoped lang='stylus' ref='stylesheet/stylus'>
.hot {
  width: 100%;
  height: 100%;
  background: #F5F5F5;

  .hot-ad {
    background-color: #fff;
    margin: 8px 0;
    padding: 5px;
  }
}
</style>
