<template>
  <!-- <cube-page type="tab-composite-view" title="tab-composite"> -->
  <div class="home">
    <cube-tab-bar
      :useTransition="false"
      :showSlider="true"
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
    ></cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        :loop="false"
        :auto-play="false"
        :show-dots="false"
        :initial-index="index"
        :options="slideOptions"
        @scroll="onScroll"
        @change="onChange"
        ref="slide"
      >
        <cube-slide-item v-for="(tab,index) in tabs" :key="index">
          <component ref="component" :is="tab.component"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
  <!-- </cube-page> -->
</template>

<script>
import Hot from "../Home/Children/Hot/Hot.vue";
import Box from "../Home/Children/Box.vue";
import Dress from "../Home/Children/Dress.vue";
import Man from "../Home/Children/Man.vue";
import MBaby from "../Home/Children/Mbaby.vue";
import Food from "../Home/Children/Food.vue";
export default {
  name: "Home",
  props: {
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      index: this.initialIndex,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      },
      tabs: [
        {
          label: "热门",
          component: Hot
        },
        {
          label: "包箱",
          component: Box
        },
        {
          label: "服装",
          component: Dress
        },
        {
          label: "男装",
          component: Man
        },
        {
          label: "母婴",
          component: MBaby
        },
        {
          label: "美食",
          component: Food
        }
      ]
    };
  },
  computed: {
    selectedLabel: {
      get() {
        return this.tabs[this.index].label;
      },
      set(newVal) {
        this.index = this.tabs.findIndex(value => {
          return value.label === newVal;
        });
      }
    }
  },
  mounted() {
    this.onChange(this.index);
  },
  methods: {
    onScroll(pos) {
      const tabBarWidth = this.$refs.tabBar.$el.clientWidth;
      const slideWidth = this.$refs.slide.slide.scrollerWidth;
      const transform = (-pos.x / slideWidth) * tabBarWidth;
      this.$refs.tabBar.setSliderTransform(transform);
    },
    onChange(current) {
      this.index = current;
      const instance = this.$refs.component[current];
      if (instance && instance.fetch) {
        instance.fetch();
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';
@import '../../common/stylus/variable';

.home {
  display: flex;
  flex-direction: column;

  >>> .cube-tab {
    padding: 10px 0;
  }

  .slide-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
