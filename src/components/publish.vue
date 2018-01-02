<template>
  <div>
    <div layout="row" layout-align="center baseline " class="header-bar border_bottom" :style="{ backgroundColor: bgColor }" id="publish">
      <div layout="row" layout-align="flex-start center" class="header-right-img left">
        <mu-flat-button label="取消"/>
      </div>
      <div flex :style="{ color: textColor }" class="header-content">
        {{mainText}}
        <slot name="center"></slot>
      </div>
      <div class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow">
        <slot name="right"></slot>
        <!--<mu-flat-button class="send" label="发送" />-->
        <mu-raised-button class="send" label="发送" />
      </div>
    </div>
    <!--<div style="height: 50px;"></div>-->
  </div>

  <!--<mu-divider :style="{ backgroundColor: lineColor }"/>-->
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    ifNativeGoBack: {
      type: Boolean
    },
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

<style>
  #publish.border_bottom {
    border-bottom: 1px solid #929292;
  }

  #publish {
    background-color: #F7F7F7;
    min-height: 50px;
    position: fixed;
    top: 0px;
    line-height: 50px;
    width: 100%;
    z-index: 9111289;
  }

  #publish .header-right-img {
    width: 50px;
  }

  #publish .header-content {
    text-align: center;
    font-size: 1.6rem;
  }

  #publish .mu-flat-button {
    position: relative;
    top: 8px;
    left: -15px;
    font-size: 16px;
  }
  #publish .mu-raised-button {
    position: relative;
    top: 10px;
    right: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 13px;
    background-color: #F7F7F7;
  }
  #publish .left {
    padding-left: 10px;
  }

</style>
