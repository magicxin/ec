<template>
  <div id="tabs">
    <slot></slot>
    <span class="offline"></span>
  </div>
</template>

<script>
  export default {
    name: 'tabs',
    props: {
      value: {
        type: String
      }
    },
    data () {
      return {
        active: 'tab1'
      }
    },
    methods: {
      handleTabClick (value, tab) {
        if (this.value !== value) {
          this.$emit('change', value)
          // this.initSlide(value)
        }
      },
      initSlide (val) {
        let parent = document.querySelector('#tabs')
        let els = document.querySelectorAll('.tab')
        let elsArray = Array.from(els)
        // 获取到点击的tab
        let _el
        elsArray.some(el => {
          let name = el.getAttribute('name')
          if (name === val) {
            _el = el
            return
          }
        })
        let rect = _el.getBoundingClientRect()

        // 给offline 设置样式
        let offest = rect.left + parent.scrollLeft
        let parentOffest = parent.getBoundingClientRect().left || 0
        let width = rect.width

        let offline = document.querySelector('.offline')
        offline.style.left = offest - parentOffest + 'px'
        offline.style.width = width + 'px'
      }
    },
    mounted () {
      this.initSlide(this.value)
    },
    updated () {
      this.initSlide(this.value)
    }
  }
</script>

<style>
  #tabs::-webkit-scrollbar {
    width: 0px;
  }

  #tabs{
    overflow: auto;
    word-break: keep-all;           /* 不换行 */
    white-space: nowrap;
  }

  #tabs .offline {
    height: 2px;
    background-color: #F98700;
    display: block;
    position: relative;
    transition: all .3s;
  }
</style>
