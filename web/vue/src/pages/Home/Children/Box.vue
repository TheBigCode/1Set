<template>
  <!-- <div class="box"> -->
  <!-- <cube-scroll class="scoll"> -->
  <div class="wrapper">
    <ul class="content">
      <!--current-->
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
      <li>
        <img src="http://118.24.240.127/images/home/s1.png">
      </li>
    </ul>
  </div>
  <!-- </cube-scroll> -->
  <!-- </div> -->
</template>

<script>
import BScroll from 'better-scroll'


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

    }
  },
  mounted () {
    console.log('mounted');
    let scroll = new BScroll('.wrapper');
  }
}
</script>

<style scoped lang='stylus' ref='stylesheet/stylus'>
@import '../../../common/stylus/mixins.styl';
@import '../../../common/stylus/variable';

.wrapper {
  width: 100%;
  height: 100%;
  background: purple;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
