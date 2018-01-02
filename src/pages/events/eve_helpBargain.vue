
<template>
  <div id="hb_list">
    <magic-header :titleName="$route.query.title ? $route.query.title : '帮砍价'" :returnNative="$route.params.native"></magic-header>
    <!-- <my-header main-text="帮砍价" bg-color="#f7f7f7" text-color="#000" activityType="4">
      <img src="../../assets/left-gray.svg" slot="">
    </my-header> -->
    <div>
      <eveListTitle v-if="racentData && racentData.product"
                    v-tap="{methods: goHelpDetail, id: racentData.product.id, activityId: racentData.id}">
        <img :src="racentData.image ? addPath(racentData.image) : defaultImg" width="100%" height="150px" alt=""
             slot="imageShow">
        <div slot="title" class="mid_f">
          {{ racentData.product.fullName }}
        </div>
        <span slot="nowPrice" class="mid_f">
              ￥{{ racentData.activityPrice }}
          </span>
        <span slot="beforePrice" class="sm_f">
              原价:￥{{ racentData.product.price }}
          </span>
        <button class="btn_style btn" slot="clickEvent" v-tap="{methods: open, item: racentData}"
                v-if="racentData.state == '1'">
          再优惠
        </button>
        <button slot="clickEvent" class="btn_style btn btn_sty2" v-if="racentData.state == '0'" @click="isLogin">
          期待中
        </button>
        <span slot="more_content" class="mini_f">
              更多推荐
          </span>
      </eveListTitle>

      <!--<load-more :getMore="loadBottom" :allLoaded = "allLoaded">-->
      <panel v-for="(item, index) in exceptData" :key="index" :value="item.product"
             v-tap="{methods: goHelpDetail, id: item.product.id, activityId: item.id}">
        <span slot="fullName" class="mid_f">{{ item.product.fullName }}</span>
        <span slot="desc" class="sm_f col_gay"><del>原价:{{ item.product.marketPrice }}</del></span>
        <span slot="price" class="sm_f text_red">￥{{ item.activityPrice }}</span>
        <div slot="number" class="text-right">
          <a class="btn_style" v-tap="{methods: open, item: item}" v-if="item.state == '1'">再优惠</a>
          <a class="btn_sty2" v-tap="{methods: open, item: item}" v-if="item.state == '0'">期待中</a>
        </div>
      </panel>
      <!--</load-more>-->
    </div>
  </div>
</template>
<script>
	import Vue from 'vue'
  // import myHeader from 'components/my-header'
  import magicHeader from 'components/magicHeader'
  import eveListTitle from 'components/eve_list_title'
  import panel from 'components/panel'
  import origin from 'components/origin'
  import price from 'components/price'

  import Loadmore from 'components/loadmore'
  import defaultImg from 'assets/default_user_icon.png'


  let goFlag = true
  let query = {
    index: 5,
    count: 3
  }

  function getProduct (vm) {
    return Vue.prototype.$.get({
      methodName: 'ListBargain',
      index: query.index.toString(),
      count: query.count.toString()
    }).then(res => {
      query.index += query.count
      res.data.bargains.forEach(val => {
        vm.bargains.push(val)
      })
      if (res.data.bargains.length < query.count) {
        vm.allLoaded = true
      }
    })
  }

  export default {
    components: {
      magicHeader,
      eveListTitle,
      panel,
      loadMore: Loadmore,
      origin,
      price
    },
    data () {
      return {
        defaultImg,
        bargains: [],
        bottomPopup: false,
        shareId: '',
        activityId: this.$route.params.activityId,
        exceptData: [],
        racentData: {},
        shop: {}
      }
    },

    /* eslint-disable */
    methods: {
      initEvents () {
        let el = this.$refs.wrap
        let start, end, disY
        el.addEventListener('touchstart', (e) => {
          start = e.touches[0].screenX
          // console.log(start)
        }, false)

        el.addEventListener('touchmove', (e) => {
          disY = e.touches[0].screenX - start
          el.style.left = disY + 'px'
          // end = e.touches[0].screenX
          // console.log(end)

        }, false)
      },
      // 下拉刷新
      loadBottom () {
        getProduct(this)
      },
      // 分享
      open (param) {
        console.log(param)
        goFlag = false
        if(this.$.userId){
            if (!goFlag) {
              let shareThumImage = param.item.image || '/upload/image/default_user_icon.png'
              this.$.push('route_share', {
                shareTitle: param.item.title,
                shareContent: '这个东西真的很不错，希望你能帮我一把~',
                shareThumImage: shareThumImage,
                shareType: '9',
                needOAuth: '0',
                shareUrl: '/eve_helpBargainDetails/' + param.item.product.id + '/' + param.item.id + '/' + this.$.userId,
                shareId: this.activityId
              })
            }
        }else{
        	goLogin({
              shopId: this.shop.id,
              name:'login'
          })
        }
//      setTimeout(() => {
//        goFlag = true
//      }, 1000)
      },
      // 查看详情
      goHelpDetail (param) {
        if (goFlag) {
          this.$router.push({name: 'eve_helpDetail', params: {activityId: param.activityId, id: param.id}})
        }
      },
      isLogin () {
        this.$.getLoginStatus().then(() => {
          this.$.toast('稍等片刻，活动即将开始~')
        }, () => {
          goLogin({
            query: {
              shopId: this.shop.id
            }
          })
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'ListBargain',
        index: '0',
        count: '50',
        id: to.params.activityId
      }).then(res => {
        next(vm => {
          window.scroll(0, 0)
          vm.exceptData = res.data.exceptData
          vm.racentData = res.data.racentData
          vm.shop = res.data.shop

          setTimeout(() => {
            // 判断是否在微信，如果在微信 调用分享接口，返回数据覆盖微信自定义的分享
            if (Vue.prototype.$.isWechat) {
              Vue.prototype.$.get({
                methodName: 'CreateStaticPath',
                shareType: '9',
                shareFuncName: '近期活动',
                needOAuth: '1',
                id: vm.$route.params.activityId,
                shareWay: '1',
                title: vm.mainText,
                content: '活动好精彩，快来参加吧~',
                image: vm.shareThumImage,
                path: document.location.hash.slice(1, document.location.hash.length),
                shopId: vm.shop.id
              }).then(res => {
                changewxShare(res.data)
              })
            }
          })
        })
      })
    }
  }
</script>
<style>
  #hb_list {
    background-color: #fff;
  }

  #hb_list .lab_style {
    position: absolute;
    top: 15px;
    right: 12px;
    color: #929292;
  }

  #hb_list .original {
    margin-top: 5px;
  }

  #hb_list .text-right {
    color: #B7B7B7;
    margin-right: 10px;
  }

  #hb_list .btn {
    margin-left: 2%;
  }

  #hb_list .share {
    text-align: center;
    padding: 20px;
    font-weight: 100;
    color: #000;
  }

  .demo-popup-bottom {
    width: 100%;
    max-width: 375px;
  }

  #hb_list .btn_sty2 {
    background-color: #bcbcbc;
    color: #fff;
  }

  .cancel {
    text-align: center;
    padding: 12px;
    border-top: 1px solid #bdbdbd;
  }

  .mu-content-block p:last-child {
    margin-bottom: 10px;
  }
</style>
