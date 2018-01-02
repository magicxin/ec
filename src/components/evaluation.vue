<template>
  <div id="evaluation">
    <div layout layout-align="space-between center" class="main-content-header" v-show="evlIsShow">
      <div flex="nogrow" class="mid_f">
        {{ titleText }} ({{ value.all }}条)
      </div>
      <div flex="nogrow"><slot name="praiseRate"></slot></div>
    </div>
    <div layout="column" layout-align="center start" class="evaluation-content" v-for="(item, index) in value.reviews">
      <div flex layout layout-align="start center">
        <img :src="item.member.head ? addPath(item.member.head) : defaultImg" height="25" width="25">
        <span class="content-username">{{ item.member.nickname }}</span>
      </div>
      <div class="content-text">{{ item.content }}</div>
      <div class="content-time">{{ item.happenDate }}
       <span class="goods_class" v-for="val in item.specificationValues"> {{ val.specificationData.name }}: {{ val.name }} </span>
      </div>
      <div layout layout-align="start center" layout-wrap="wrap">
        <div class="content-img my-gallery" :data-pswp-uid="index + 1">
          <figure v-for="image,index in item.images">
            <div :style="{width: imgHeight + 'px', height: imgHeight + 'px', overflow: 'hidden'}">
              <img :src="addPath(image)" :width="imgWidth" @click="openPhoto(item.images, index)">
            </div>
          </figure>
        </div>
      </div>
    </div>
    <mu-dialog :open="dialogIn" dialogClass="imgBody-dialog">
      <section class="imgBody"  @click="close">
        <label class="num_label">{{ indexImgIn + 1 }}/{{ images.length }}</label>
      </section>
      <div id="photo-swipe"  @click="close" >
        <div v-for="(imgUrl, index) in images">
          <img :src="addPath(imgUrl)" alt=""  width="90%" v-show="index === indexImgIn" :style="{maxHeight: screenHeight + 'px'}"/>
        </div>
      </div>
    </mu-dialog>
  </div>
</template>
<script>

  import defaultImg from 'assets/default_user_icon.png'
  import '../css/default-skin.css'
  import '../css/photoswipe.css'
  // let initPhotoSwipeFromDOM
  export default {
    name: 'evaluation',
    data () {
      return {
        defaultImg,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height - 80,
        isImgViewsShow: false,
        imgSrc: '',
        indexImgIn: 0,
        dialogIn: false,
        images: []
      }
    },

    computed: {
      imgWidth () {
        let width = (this.screenWidth - 28) * 0.33 - 4
        return width
      },
      imgHeight () {
        return this.imgWidth
      }
    },
    props: {
      titleText: {
        type: String, // 设置评论标题，默认为‘评论’
        default () {
          return '评论'
        }
      },
      value: {
        type: Object,
        default () {
          return {
            name: 'hahahahah'
          }
        }
      },
      evlIsShow: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    methods: {
      eImgClick: function (e) {
        this.isImgViewsShow = true
        this.imgSrc = e.target.src
        console.log(this.imgSrc)
      },
      eImgViewClick: function () {
        this.isImgViewsShow = 0
      },
      openPhoto (images, index) {
        this.images = images
        this.indexImgIn = index
        this.dialogIn = true
        console.log(document)
        let vm = this
        setTimeout(function(){
          vm.addTouch()
        },0)
        
      },
      init () {
        console.log('执行方法')
        // initPhotoSwipeFromDOM('.my-gallery')
      },
      addNum () {
        if (this.indexImgIn === this.images.length - 1) {
          this.indexImgIn = 0
        } else {
          this.indexImgIn++
        }
        console.log(this.indexImgIn)
      },
      close () {
        this.dialogIn = false
      },
      reduceNum () {
        if (this.indexImgIn === 0) {
          this.indexImgIn = this.images.length - 1
        } else {
          this.indexImgIn--
        }
        console.log(this.indexImgIn)
      },
      addTouch (){
      /* eslint-disable */
      let nStartX, nEndX
      document.getElementById('photo-swipe').addEventListener('touchstart', (e) => {
        nStartX = e.targetTouches[0].pageX
      })

      document.getElementById('photo-swipe').addEventListener('touchend', (e) => {
        nEndX = e.changedTouches[0].pageX
        console.log("nStartX:" + nStartX)
        console.log("nEndX:" + nEndX)
        if (nStartX - nEndX > 0) {
          // 从左至右
          this.addNum()
        } else if (nStartX - nEndX < 0) {
          console.log('reduceNum')
            // 从右至左
          this.reduceNum()
        } else {

        }
      })
      }
    },
    mounted () {
      
    }
  }
</script>

<style>
  #evaluation {
    background-color: #fff;
  }

  #evaluation .main-content-header {
    font-size: 14px;
    color: #797979;
    padding: 14px;
    border-bottom: 1px solid #dcdcdd;
  }

  #evaluation .evaluation-content {
    padding: 14px;
    border-bottom: 1px solid #dcdcdd;
  }

  #evaluation .evaluation-content:last-child {
    border-bottom: none;
  }

  #evaluation .goods_class {
      color: #929292;
      padding-left: 20px;
  }

  #evaluation .content-username {
    padding-left: 8px;
    font-size: 16px;
    color: #000;
  }

  #evaluation .content-text {
    padding-top: 8px;
    font-size: 14px;
    line-height: 1.3;
    color: #414141;
    word-wrap: break-word;
    width: 100%;
  }

  #evaluation .content-time {
    padding-top: 4px;
    font-size: 12px;
    color: #929292;
  }
  #evaluation .content-img{
    margin-right: 1px;
  }
  #evaluation figure {
    display: inline-block;
  }
  #evaluation .my-gallery figure {
     margin-top: 4px;
     margin-right: 4px;
  }
  #evaluation .pswp {
    z-index: 9999999;
  }
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
  .imgBody-dialog img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  #photo-swipe {
    margin-top: 20px;
  }
  .imgHeight1 img {
    max-height: 500px;
  }
</style>
