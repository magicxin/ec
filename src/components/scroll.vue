<template>
  <section class="scroll-box" :style="{bottom: marginBottom + 'px', top: marginTop + 'px'}">
    <slot></slot>
  </section>
</template>
<script>
  /* eslint-disable */
  let startY, endY, direction, maxDistance = 0, distance
  function handler (event) {
    event.preventDefault()
  }
  export default {
    name: 'scroll',
    props: {
      top: Boolean,
      bottom: Boolean,
      marginBottom: [String, Number],
      marginTop: [String, Number]
    },
    methods: {
      judgeTopOrBottom (event) {
        // if (!maxDistance) {
        //   return
        // }
        // window.alert(!maxDistance)
        // window.alert(this.$el.scrollTopz)
        if (this.$el.scrollTop === 0) {
          this.arriveTop(event)
          return
        }
        // console.log(maxDistance, this.$el.scrollTo)
        if (this.$el.scrollTop + 5 > maxDistance) {
          this.arriveBottom(event)
          return
        }
        event.stopPropagation()
      },
      arriveTop (event) {
        endY = event.touches[0].pageY
        distance = endY - startY
        if (distance < 0 || this.top) {
          event.stopPropagation()
        }
      },
      arriveBottom (event) {
        endY = event.touches[0].pageY
        distance = endY - startY
        if (distance > 0 || this.bottom) {
          event.stopPropagation()
        }
      },
      customGetMaxDistance() {
        maxDistance = this.$el.scrollHeight - this.$el.clientHeight
      }
    },
    beforeDestroy() {
      document.removeEventListener('touchmove', handler, false)
    },
    mounted () {
      this.$nextTick(() => {
        this.customGetMaxDistance()
      })
      document.addEventListener('touchmove', handler, false)
      let vm = this
      this.$el.addEventListener('touchstart', (event) => {
        startY = event.touches[0].pageY
      })
      this.$el.addEventListener('touchmove', function (event) {
        vm.judgeTopOrBottom(event)
      }, false)
      window.addEventListener('hashchange', () => {
        document.removeEventListener('touchmove', handler, false)
      })
    }
  }
</script>
<style>
  .scroll-box{
    overflow-x: hidden;
    position: absolute;
    background-color: #fff;
    /*height: 100%;*/
    top: 49px;
    bottom: 49px;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    z-index: 2;
    /*margin-bottom: 49px;*/
  }

  .scroll-box::-webkit-scrollbar{
    display: none;
  }
  .scroll-box .mint-swipe-indicator.is-active{background:#f98700 !important;opacity: 1;}
</style>
