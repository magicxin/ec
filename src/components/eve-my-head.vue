<template>
  <div v-if="isWechat">
    <div layout="row" layout-align="center baseline " class="header-bar border_bottom"
         :style="{ backgroundColor: bgColor }" id="myHeader">
      <div v-tap="{methods: goBack}" layout="row" layout-align="flex-start center" class="header-right-img left">
        <slot></slot>
      </div>
      <div flex :style="{ color: textColor }" class="header-content">
        {{mainText}}
        <slot name="center"></slot>
      </div>
      <div class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow">
        <img src="../assets/eve_share.svg" class="badgeImg" @click="shareActivity">
      </div>
    </div>
    <div style="height: 49px;"></div>
  </div>
  <!--<mu-divider :style="{ backgroundColor: lineColor }"/>-->
</template>
<script>

  export default {
    data () {
      return {
        isWechat: false
      }
    },
    props: {
      ifNativeGoBack: {
        type: Boolean
      },
      bgColor: {
        type: String, // header-bar背景颜色,默认蓝色
        default () {
          return '#548cd1'
        }
      },
      mainText: {
        type: String // header中间的文字,必填项
      },
      textColor: {
        type: String, // header中间文字的字体颜色,默认白色
        default () {
          return '#fff'
        }
      },
      lineColor: {
        type: String, // header最下面0.5px高的细线的颜色
        default () {
          return 'inherit'
        }
      },
      isBridge: {
        type: Boolean,
        default () {
          return false
        }
      },
      shop: {
        type: Object
      }
    },
    created(){
      console.log(window.location.pathname)
      if (window.location.pathname === '/resources/admin/ecStatic/index.html') {
        this.isBridge = true
      }
    },
    methods: {
      goBack: function () {
        console.log(this.isBridge)
        if (this.isBridge) {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
        } else {
          if (this.ifNativeGoBack) {
            return
          }
          console.log(this.$route)
          if (history.length && history.length > 1) {
            //  添加判断，路由跳转过来之后继续操作之后想要回退需要调用 router_back
            let isEve = this.$route.name && this.$route.name.substr(0, 3)
            if (false && isEve === 'eve') {
              this.$.push('router_back', {}, (res) => {
                console.log('router_back executed')
              })
            } else {
              window.history.go(-1)
            }

          } else {
            this.$.push('router_back', {}, (res) => {
              console.log('router_back executed')
            })
          }
        }
      },
      shareActivity () {
      	if(this.$.userId){
      		let url = document.location.hash.slice(1, document.location.hash.length)
          let shareThumImage = '/upload/image/default_user_icon.png'
          this.$.push('route_share', {
            shareTitle: this.mainText,
            shareContent: '活动好精彩，快来参加吧~',
            shareThumImage: shareThumImage,
            shareType: '9',
            needOAuth: '0',
            shareUrl: url,
            shareId: url.split('/')[2]
          })
      	}else{
      		this.$.goLogin({
              shopId: this.shop.id
          })
      	}
      }
    },
    mounted () {
      let clientInName = ''
      if (!this.$.isWechat) {
        this.isWechat = true
      }
      if (this.$.isAndroid) {
        clientInName = 'Android'
      }
      if (this.$.isIos) {
        clientInName = 'IOS'
      }
      document.title = this.mainText || 'V服爱车' + clientInName
      setTimeout(() => {
        console.log(this.shop)
        // 判断是否在微信，如果在微信 调用分享接口，返回数据覆盖微信自定义的分享
        if (this.$.isWechat) {
          if(this.$.env === 'wxPublic'){
            return
          }else{
            this.$.get({
              methodName: 'CreateStaticPath',
              shareType: '9',
              shareFuncName: '近期活动',
              needOAuth: '1',
              id: this.$route.params.activityId,
              shareWay: '1',
              title: this.mainText,
              content: '活动好精彩，快来参加吧~',
              image: this.shareThumImage,
              path: document.location.hash.slice(1, document.location.hash.length),
              shopId: this.shop.id
            }).then(res => {
              // changewxShare(res.data)
            })
          }
        }
      }, 500)
    }
  }
</script>

<style>
  #myHeader.border_bottom {
    border-bottom: 1px solid #929292;
  }

  #myHeader {
    background-color: #F7F7F7;
    min-height: 49px;
    position: fixed;
    top: 0px;
    line-height: 50px;
    width: 100%;
    z-index: 9111289;
  }

  #myHeader .header-right-img {
    width: 36px;
  }

  #myHeader .header-content {
    text-align: center;
    font-size: 1.6rem;
  }

  #myHeader .left {
    padding-left: 10px;
  }

  #myHeader .badgeImg {
    position: absolute;
    top: 9px;
    width: 30px;
    right: 10px;
  }
</style>
