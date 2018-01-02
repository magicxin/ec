<template>
  <div id="panelTwo" layout="column" :style="{ width: width + 'px', height: 1.4 * width + 'px' }">
    <div flex="nogrow" class="chose">
      <slot name="chose"></slot>
    </div>
    <div flex="nogrow" :style="{ width: width + 'px', height: width + 'px' }">
      <!--<img :src="'http://carowl.cn' + value.image" alt="">
      -->
      <img :src="value.image ? addPath(value.image) : defaultImg" alt="">

    </div>
    <div flex layout="column" class="panel_box_bd">
      <div flex="noshrink" layout="column" layout-align="start start" class="panel_box_top">
        <h4 class="sm_f panel_h4">{{ value.fullName }}</h4>
        <slot name="desc"></slot>
      </div>
      <div flex="grow" layout="row" layout-align="space-between end" class="panel_box_bottom">
        <div flex>
          <slot name="price"></slot>
        </div>
        <!--<div flex="nogrow">
          <slot name="number"></slot>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
  import defaultImg from 'assets/default_user_icon.png'

  export default {
    name: 'panel-two',
    data () {
      return {
        screenWidth: window.screen.width,
        defaultImg
      }
    },

    props: {
      value: {
        type: Object,
        default () {
          return {
            name: '2016款 插插插等 180X'
          }
        }
      },
      width: {
        type: Number,
        default () {
          return 120
        }
      }
    }
  }
</script>

<style>

  #panelTwo {
    background-color: #fff;
    position: relative;
  }

  #panelTwo .chose {
    align-self: center;
    padding-left: 2px;
  }

  #panelTwo img {
    width: 100%;
    height: 100%;
    position: relative;
    /* margin-top: 50%; */
    top: 50%;
    transform: translateY(-50%);
    vertical-align: middle;
  }

  #panelTwo .panel_box_bd {
    padding-left: 3%;
  }

  /*  #panelTwo:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }*/

  #panelTwo .panel_h4 {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-weight: 500;
    font-size: 16px;
    line-height: 1;
  }

  #panelTwo .panel_box_top {
    width: 120%;
    transform: scale(0.7);
    transform-origin: 0% 70% 0;
  }

  #panelTwo .panel_box_bottom {
    width: 160%;
    font-size: 1rem;
    /*transform: scale(0.7);*/
    /*transform-origin: 0% 10% 0;*/
  }

</style>
