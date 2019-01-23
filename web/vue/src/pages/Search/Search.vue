<template>
  <div class="search">
    <!--搜索导航-->
    <search-nav :showSearchPanel="showSearchPanel"/>
    <div class="shop">
      <cube-scroll-nav
        class="nav"
        :side="true"
        :data="searchgoods"
        :options="scrollOptions"
        v-if="searchgoods.length"
      >
        <template slot="bar" slot-scope="props">
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <template slot-scope="props">
              <div class="text">
                <span>{{props.txt.name}}</span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
        <cube-scroll-nav-panel
          class="nav-panel"
          v-for="good in searchgoods"
          :key="good.name"
          :label="good.name"
          :title="good.name"
        >
          <ul class="item">
            <li v-for="item in good.items" :key="item.name" class="shops-item">
              <div class="icon">
                <img width="57" height="57" :src="item.icon">
              </div>
              <div class="content">
                <h2 class="name">{{item.title}}</h2>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <!--搜索面板-->
    <search-panel v-if="isShow" :showSearchPanel="showSearchPanel"/>
  </div>
</template>

<script>
import SearchNav from './children/SearchNav'
import SearchPanel from './children/SearchPanel'
import {mapState} from 'vuex'

export default {
  name: 'Search',
  data () {
    return {
      scrollY: 0, // 右侧列表滑动的Y轴坐标(实时更新)
      rightLiTops: [], // 所有分类的头部位置
      isShow: false
    }
  },
  mounted () {
    this.$store.dispatch('reqSearchGoods')
  },
  computed: {
    ...mapState(['searchgoods']),

    barTxts () {
      let ret = []
      this.searchgoods.forEach((good) => {
        const name = good.name
        ret.push({
          name
        })
      })
      return ret
    }
  },

  components: {
    SearchNav,
    SearchPanel
  },

  methods: {
    // 1.5 是否显示搜索面板
    showSearchPanel (flag) {
      this.isShow = flag
    }
  }
}
</script>

<style scoped lang='stylus' ref='stylesheet/stylus'>
@import '../../common/stylus/mixins.styl';

.search {
  background: #F5F5F5;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shop {
  display: flex;
  position: absolute;
  top: 60px;
  bottom: 50px;
  width: 100%;
  overflow: hidden;

  >>> .cube-scroll-nav-bar {
    width: 80px;
    white-space: normal;
    overflow: hidden;
  }

  >>> .cube-scroll-nav-bar-item_active {
    color: #f00;
  }

  >>> .cube-scroll-nav-panel-title {
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    font-size: 7px;
    color: #333;
    background: #ccc;
    text-align: left;
  }

  .nav {
    width: 100%;

    .nav-panel {
      .item {
        display: flex;
        flex-wrap: wrap;

        .shops-item {
          display: flex;
          flex-direction: column;
          width: 33.3%;
          height: 90px;
          justify-content: center;
          align-items: center;

          .icon {
            width: 60%;
            height: 60%;
            margin-bottom: 5px;
          }

          .content {

            .name {
              margin: 2px 0 0 8px;
              height: 14px;
              line-height: 14px;
              font-size: 7px;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
