<template>
  <div :style="layoutCss">
    <slot></slot>
  </div>
</template>
<script>
  export default{
    name: 'layout',
    props: {
      direction: {
        direction: String, // 布局方向
        default () {
          return 'row'
        }
      },
      wrap: {
        type: String, // 是否换行
        default () {
          return 'nowrap'
        }
      },
      justify: {
        type: String, // 对齐
        default () {
          return 'space-around'
        }
      },
      align: {
        type: String, // 对齐
        default () {
          return 'center'
        }
      },
      full: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        layout: null
      }
    },
    computed: {
      layoutCss () {
        return {
          'flex-wrap': this.wrap,
          'flex-direction': this.direction,
          'justify-content': this.justify,
          'align-items': this.align,
          'display': 'flex',
          'height': this.full ? '100%' : null
        }
      }
    }
  }
</script>

<style scoped>
</style>
