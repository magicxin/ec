<template>
  <div id="clip" :style="{top: position + 'px', zIndex: zIndex}">
    <div class="label"></div>
    <div class="value"  @click="openDetail">
      {{value.value}}
    </div>
  </div>
</template>
<script>
  import balloon from 'assets/qiqiu.svg'
  export default {
    data () {
      return {
        queryData: {},
        zIndex: 100,
        balloon
      }
    },
    props: {
      value: Object,
      month: Number
    },
    computed: {
      position () {
        return this.value.beiginTime / 31 * 160 - 20
      }
    },
    methods: {
      openDetail () {
        /*
          对于一个月来说, 首先是这个月的高度扩展为能放的下 活动列表
          然后是判断点击之后的点, 向下移动同样多的单位
          现在的难度在与如何知道这个点是哪一个点
          如果点击的不是同一个点 就不是关闭, 而是移动空白的地方
        */
        let els = document.querySelectorAll('.timeline-month')
        let el = els[this.month - 1]
        if (el.style.height !== '160px') {
          el.style.height = '160px'
        } else {
          els[this.month - 1].style.height = 500 + 'px'
        }
        this.$emit('showDetail', JSON.stringify({
          month: this.month,
          position: this.position
        }))
      }
    }
  }
</script>
<style>
  #clip {
    position: absolute;
    line-height: 40px;
    height: 40px;
    z-index: 999;
  }

  #clip .label {
    border-radius: 50%;
    width:12px;
    height: 12px;
    background-color: #ccc;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    border: 1px solid orange
  }


  #clip .value {
    text-align: center;
    line-height: 35px;
    height: 35px;
    display: inline-block;
    width: 35px;
    border-radius: 50%;
    background-color: orange;
    vertical-align: middle;
    margin-left: 120px;
    position: relative;
  }

  #clip .value:hover{
    z-index: 999;
  }

  #clip .value::before{
    content: "";
    width: 123px;
    height: 1px;
    background-color: #ccc;
    position: absolute;
    top: 17px;
    left: -123px;
  }
</style>