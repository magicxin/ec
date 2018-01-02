<style scoped>

</style>

<template>
  <div :style="flexCss">
    <slot>
      &nbsp;
    </slot>
  </div>

</template>

<script>
  export default{
    name: 'flex',
    props: {
      grow: {
        type: String, // 有空间时扩大
        default () {
          return '1'
        }
      },
      shrink: {
        type: String, // 空间不够缩小
        default () {
          return '1'
        }
      },
      basis: {
        type: String, // 这个基本不用改
        default () {
          return 'auto'
        }
      },
      self: {
        type: String,
        default () {
          return 'auto'
        }
      }
    },
    data () {
      return {
        flex: null
      }
    },
    computed: {
      flexCss () {
        return {
          'flex-basis': this.basis,
          'flex-shrink': this.shrink,
          'flex-grow': this.grow,
          'align-self': this.self
        }
      }
    }
  }
</script>
