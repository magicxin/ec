<style>
  #fullButton .mu-raised-button {
    position: fixed;
    bottom: 0px;
  }
  #fullButton .mu-raised-button.joinIos {
    bottom: 49px;
  }
</style>
<template>
  <div id="fullButton">
    <mu-raised-button v-bind:class="{joinIos: isIos}" :style="{ backgroundColor: bgColor, color: textColor }"  fullWidth>{{ content }}</mu-raised-button>
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
        type: String,
        default () {
          return '#F98700'
        }
      },
      textColor: {
        type: String,
        default () {
          return '#fff'
        }
      },
      content: {
        type: String,
        default () {
          return 'fullButton'
        }
      }
    },
    beforeCreate () {
      let u = navigator.userAgent
      this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  }
</script>
