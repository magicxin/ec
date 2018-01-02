<style>
  .imgBody-dialog .imgBody {
    color: #000;
    margin-left: 0px;
    background-color: #fff;
  }
</style>

<template>
  <!--查看大图-->
  <div class="imgBody-dialog">
    <section class="imgBody"  @click="closePhoto">
      <label class="num_label">{{ indexImgIn + 1 }}/{{ images.length }}</label>
    </section>
    <div id="photo-swipe" style="height: 100%;"  @click="closePhoto" >
      <div v-for="(imgUrl, _index) in images" class="imgTouch">
        <img :src="addPath(imgUrl)"  v-show="_index === indexImgIn" alt="" :style="{maxHeight: screenHeightImg + 'px'}"/>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    data () {
      return {
        bigImgsDialog: false,
        dialogIn: false,
        indexImgIn: 0,
        screenHeightImg: window.screen.height - 165,
        fromRoutePath: null
      }
    },

    computed: {
      data () {
        return this.$route.params
      },
      images () {
        return this.data.images
      },
      index () {
        return this.data.index
      }
    },



    methods: {
      // 关闭页面
      closePhoto () {
        this.$router.push({ path: this.fromRoutePath })
        // this.$router.go(-1)
      },
      mountedTouchMove () {
         // 点击图片放大查看
        let nStartX, nEndX
        let photoSwipe = document.getElementById('photo-swipe')
        if (photoSwipe) {
          photoSwipe.addEventListener('touchstart', (e) => {
            nStartX = e.targetTouches[0].pageX
          })

          photoSwipe.addEventListener('touchend', (e) => {
            nEndX = e.changedTouches[0].pageX
            if (nStartX - nEndX > 0) {
              // 从左至右
              if (this.indexImgIn === this.images.length - 1) {
                this.indexImgIn = 0
              } else {
                this.indexImgIn++
              }
            } else if (nStartX - nEndX < 0) {
                // 从右至左
              if (this.indexImgIn === 0) {
                this.indexImgIn = this.images.length - 1
              } else {
                this.indexImgIn--
              }
            } else {

            }
          })
        }
      }
    },
    mounted () {
      this.indexImgIn = this.index
      this.mountedTouchMove()
    },
    beforeRouteEnter (to, from ,next) {
      let fromRoutePath = from.path
      next(vm => {
        vm.fromRoutePath = fromRoutePath
      })
    }
  }
</script>
