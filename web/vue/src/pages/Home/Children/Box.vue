<template>
  <div class="box">
  <cube-scroll :options="scrollOptions" class="scoll">
    <div class="cotent">
      <img src="http://img4.imgtn.bdimg.com/it/u=1394264431,1518168585&fm=26&gp=0.jpg">
      <br>
      <img src="http://img4.imgtn.bdimg.com/it/u=1394264431,1518168585&fm=26&gp=0.jpg">
      <br>
      <img src="http://img4.imgtn.bdimg.com/it/u=1394264431,1518168585&fm=26&gp=0.jpg">
      <br>
    </div>
  </cube-scroll>
  </div>
</template>

<script>
export default {
  name: 'Box',

  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      scrollOptions: {
        directionLockThreshold: 0,
        click: false
      },
    }
  },
}
</script>

<style scoped lang='stylus' ref='stylesheet/stylus'>
@import '../../../common/stylus/mixins.styl';
@import '../../../common/stylus/variable';

.box {
  width: 100%;
  height: 100%;
  background: purple;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  // position: absolute;

  .scroll {
    .cotnet {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }
  }
}
</style>
