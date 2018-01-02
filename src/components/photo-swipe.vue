<template>
  <section>
    <mu-dialog :open="dialogIn" dialogClass="imgBody-dialog">
      <section class="imgBody"  @click="close">
        <label class="num_label">{{ indexImgIn + 1 }}/{{ images.length }}</label>
      </section>
      <div id="photo-swipe"  @click="close">
        <div v-for="(imgUrl, index) in images">
          <img :src="addPath(imgUrl)" alt=""  width="90%" v-show="index === indexImgIn" />
        </div>
      </div>
    </mu-dialog>
  </section>
</template>
<script>

  export default {
    data () {
      return {
        indexImgIn: this.indexImg,
        dialogIn: null
      }
    },
    methods: {
      addNum () {
        if (this.indexImgIn === this.images.length - 1) {
          this.indexImgIn = 0
        } else {
          this.indexImgIn++
        }
      },
      close () {
        this.dialogIn = false
        console.log(this.dialogIn)
      },
      reduceNum () {
        if (this.indexImgIn === 0) {
          this.indexImgIn = this.images.length - 1
        } else {
          this.indexImgIn--
        }
      }
    },

    props: {
      images: {
        type: Array
      },
      dialog: {
        type: Boolean
      },
      indexImg: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    computed: {

    },
    mounted () {
      /* eslint-disable */
      setTimeout(() => {
        this.dialogIn = this.dialog
      }, 1000)
      let nStartX, nEndX
      document.getElementById('photo-swipe').addEventListener('touchstart', (e) => {
        nStartX = e.targetTouches[0].pageX
      })

      document.getElementById('photo-swipe').addEventListener('touchend', (e) => {
        nEndX = e.changedTouches[0].pageX
        console.log(this.indexImgIn)
        console.log(this.images.length)
        if (nStartX - nEndX > 0) {
          // 从左至右
          this.addNum()
        } else if (nStartX - nEndX > 0) {
            // 从右至左
          this.reduceNum()
        } else {

        }
      })
    }
  }
</script>
<style>
  .imgBody-dialog .mu-dialog-body {
    padding: 0px;
    text-align: center;
    max-height: 750px;
  }
  .imgBody-dialog .imgBody {
    color: #fff;
    padding: 15px;
    text-align: left;
    margin-left: 5px;
  }
  .imgBody-dialog, .imgBody-dialog .mu-dialog, imgBody-dialog .mu-dialog .mu-dialog-body   {
    width: 100%;
    height: 100%;
    background: #000;
  }
</style>
