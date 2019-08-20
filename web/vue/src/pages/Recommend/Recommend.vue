<template>
<!-- cube scroll 标准配置 -->
  <div class="flex">
    <div class="container">
      <div class="wrapper">
        <cube-scroll class="scroll" ref="scroll" :options="scrollOptions">
          <div class="recommend-container" v-if="recommendshoplist.length > 0">
            <ul class="recommend">
              <shop-list
                tag="li"
                v-for="(item, index) in recommendshoplist"
                :item="item"
                :key="index"
              />
            </ul>
          </div>
        </cube-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ShopList from "./../../components/ShopList/ShopList";

export default {
  name: "Recommend",
  data() {
    return {
      page: 1,
      scrollOptions: {
        directionLockThreshold: 0,
        click: false
      },
      count: 10
    };
  },
  mounted() {
    this.$store.dispatch("reqRecommendShopList");
  },
  computed: {
    ...mapState(["recommendshoplist"])
  },
  components: {
    ShopList
  },
  watch: {
    recommendshoplist() {
      this.$nextTick(() => {
        // 让当前的页码+1
        this.page += 1;
        // 初始化
        this._initBScroll();
      });
    }
  },
  methods: {
    _initBScroll() {
      // 1.1 初始化
      this.listScroll = new BScroll(".recommend-container", {
        scrollY: true,
        probeType: 3
      });

      // 1.2 监听列表的滚动
      this.listScroll.on("touchEnd", pos => {
        // 1.2.1 监听下拉
        // 1.2.2 监听上拉
        if (this.listScroll.maxScrollY > pos.y + 20) {
          console.log(this.page);
          console.log("上拉加载更多");
          this.$store.dispatch("reqRecommendShopList", {
            page: this.page,
            count: this.count,
            callback: () => {}
          });
        }
      });

      // 1.3 列表滚动结束
      this.listScroll.on("scrollEnd", () => {
        this.listScroll.refresh();
      });
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';
@import '../../common/stylus/variable';

.flex {
  // cube scroll 标准配置
  display: flex;
  flex-direction: column;

  .container {
    flex: 1;
    flex-position: relative;

    .wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .scroll {
        .recommend-container {
          background: #F5F5F5;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .recommend {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            background: #F5F5F5;
            padding-bottom: 50px;
          }
        }
      }
    }
  }
}
</style>
