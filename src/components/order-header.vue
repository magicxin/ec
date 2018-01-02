<template>
  <div class="order-header" id="order_header" layout="row">
    <div flex="noshrink">
      <slot name="label"></slot>
    </div>
    <div flex="grow" layout="row" class="order-header-title text-right" layout-align="center flex-start">
      <slot name="value">
        <div flex layout layout-align="center center" :class="{ 'item-check': itemNum === index || itemNum === index + 3 }" v-tap="{ methods: checked, num: index}" v-for="(item, index) in textArray">
          {{ item }}
          <i class="material-icons icon" v-if="itemNum < 3">arrow_drop_down</i>
          <i class="material-icons icon" v-if="itemNum > 2">arrow_drop_up</i>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  let currentNum = ''
  export default {
    name: 'orderHeader',
    props: {
      widthVal: {
        type: String, // 总宽度，默认100%
        default () {
          return '100%'
        }
      },
      textArray: {
        type: Array, // 3个字段内容
        default () {
          return ['综合', '销量', '价格']
        }
      }
    },
    data () {
      return {
        orderName: 'Together',
        itemNum: 0
      }
    },
    methods: {
      Together () {
        this.orderName = 'Together'
      },
      sales () {
        this.orderName = 'sales'
      },
      price () {
        this.orderName = 'price'
      },
      checked (params) {
        let nowNum = params.num
        if (parseInt(currentNum) === parseInt(nowNum)) {
          if (nowNum > 2) {
            this.itemNum = nowNum - 3
          } else {
            this.itemNum = nowNum + 3
          }
          currentNum = ''
        } else {
          this.itemNum = params.num
          currentNum = params.num
        }
        this.$emit('checked', this.itemNum)
      }
    }
  }
</script>

<style>
  #order_header{
    -webkit-align-item: center;
    position: relative;
    background-color: #fff;
    width: 100%;
    padding-top: 6px;
  }

  #order_header i{
    vertical-align: middle;
  }

  #order_header .order-header-title {
    font-size: 14px;
  }

  #order_header .order-header-title div{
    position: relative;
  }

  #order_header .order-header-title div:after{
    content: " ";
    position: absolute;
    right: 3px;
    top: 10%;
    width: 2px;
    height: 80%;
    bottom: 0;
    border-right: 1px solid #D6D6D6;
    color: #D6D6D6;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
    -webkit-transform: scaleY(.8);
    transform: scaleY(.8);
  }

  #order_header .order-header-title>div:last-child::after {
    border-right-width: 0;
  }

  #order_header .active {
    color:#c60007;
  }

  #order_header .icon {
    color: #929292;
    font-size: 16px;
  }

  #order_header .item-check,
  #order_header .item-check .icon {
    color: #F98700;
  }
</style>
