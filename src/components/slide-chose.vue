<template>
  <div id="slide_chose">
    <div class="slide_box" >
      <div v-for="(item, index) in currentValue" v-tap="{methods: chose, item: item}" class="slide-item">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'slideChode',
    data () {
      return {
        cache: {
        }
      }
    },
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      }
    },
    computed: {
      currentValue () {
        let _cacheValue = []
        this.value.forEach(val => {
          if (!val.name) {
            _cacheValue.push({
              name: val
            })
          }
        })
        return _cacheValue.length > 0 ? _cacheValue : this.value
      }
    },
    methods: {
      chose (params) {
        this.$emit('chose', params.item)
      },
      handleTouchStart (event) {
        this.cache.startY = event.touches[0].clientY
        event.preventDefault()
      },
      handleTouchMove (event) {
        this.cache.currentY = event.touches[0].clientY
        this.cache.distance = this.cache.currentY - this.cache.startY
        this.cache.direction = this.cache.distance > 0 ? 'down' : 'top'
        let origin = this.cache.el.style.top.split('px')[0]
        this.cache.el.style.top = Number(origin) + this.cache.distance / 6 + 'px'
        event.preventDefault()
      },
      handleTouchEnd (event) {
        let distance = Number(this.cache.el.style.top.split('px')[0])
        let el = document.querySelector('.slide_box')
        let react = el.getBoundingClientRect()
        let maxDistance = this.cache.direction === 'top' ? react.height - 60  : 0
        if (Math.abs(distance) > maxDistance) {
          if (this.cache.direction === 'down') {
            this.cache.el.style.top = maxDistance + 'px'
          } else {
            this.cache.el.style.top = -maxDistance + 'px'
          }
        }
        event.preventDefault()
      },
      init (el) {
        el.addEventListener('touchstart', this.handleTouchStart, false);
        el.addEventListener('touchmove', this.handleTouchMove, false);
        el.addEventListener('touchend', this.handleTouchEnd, false);
      }
    },
    mounted () {
      let el = this.cache.el = document.querySelector('.slide_box')
      el.style.top = 0 + 'px'
      this.init(el)
    }
  }
</script>

<style>
  #slide_chose{
    position: relative;
    max-height: 80px;
    overflow: hidden;
  }

  .slide_box {
    position: relative;
    top: 0px;
    transition: all .5s ease-in-out;
  }

  .slide_box .slide-item:last-child::after {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }

  .slide-item {
    position: relative;
    /*transition: all 0.1s;*/
  }

  .slide-item::after{
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
    
  }


</style>
