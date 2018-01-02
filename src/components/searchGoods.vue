<style scoped>
  .border_bottom {
    /*border-bottom: 1px solid #929292;*/
  }
  .header-bar {
    height: 50px;
    position: relative;
  }
  .header-back-img {
    height: 40px;
    width: 40px;
    position: absolute;
    left: 10px;
    top: 13px;
    z-index: 9999;
  }
  .header-right-img {
    height: 24px;
  }
  .header-content {
    text-align: center;
    font-size: 20px;
    font-weight: 300;
  }
</style>
<template>
  <div class="border_bottom">
    <layout justify="space-between" class="header-bar" :style="{ backgroundColor: bgColor }">
      <div class="header-back-img">
        <slot name="left"></slot>
      </div>
      <flex class="header-content">
        <slot name="search"></slot>
      </flex>
      <div class="header-right-img">
        <slot name="right"></slot>
      </div>
    </layout>
    <mu-divider :style="{ backgroundColor: lineColor }"/>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    bgColor: {
      type: String, // header-bar背景颜色,默认蓝色
      default () {
        return '#548cd1'
      }
    },
    mainText: {
      type: String // header中间的文字,必填项
    },
    textColor: {
      type: String, // header中间文字的字体颜色,默认白色
      default () {
        return '#fff'
      }
    },
    lineColor: {
      type: String, // header最下面0.5px高的细线的颜色
      default () {
        return 'inherit'
      }
    }
  }
}
</script>
