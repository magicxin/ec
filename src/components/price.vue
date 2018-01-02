<template>
  <div class="price" id="price" flex>
    <span class="price-money mid_f">￥{{value}}</span>
    <slot name="origin"></slot>
    <span class="desc">{{desc}}</span>
  </div>
</template>
<script>
  import origin from 'components/origin'
  export default {
    name: 'price',
    components: {
      origin
    },
    props: {
      value: {
        type: String,
        default () {
          return '0'
        }
      },
      desc: {
        type: String
      }
    }
  }
</script>

<style scoped>
  #price img{
    width: 10px;
  }

  #price .price-money{
    vertical-align: bottom;
    color: #E13E13;
    margin-right: 10px;
    text-decoration: none;
    display: inline-block;
  }

  #price .desc {
    color: #ff4081;
  }
</style>
