<br /><template>
  <div class="header-container" v-if="!isWechat">
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
        <slot name="right"></slot>
      </div>
    </div>
    <div style="height: 49px;"></div>
  </div>
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
      activityType: {
        type: String,
        default () {
          return '0'
        }
      }
    },
    methods: {
      goBack: function () {
        console.log(this.$route)
        if (this.isBridge) {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
        } else {
          if (this.ifNativeGoBack) {
            return
          }
          console.log(history)
          if (history.length && history.length > 1) {
            //  添加判断，路由跳转过来之后继续操作之后想要回退需要调用 router_back
//            let isEve = this.$route.name && this.$route.name.substr(0, 3)

            // 这个判断可能会导致会员卡页面返回有问题, 暂时屏蔽
            // if (this.$route.name === 'cb_card') {
            //   this.$.push('router_back', {}, (res) => {
            //     console.log('router_back executed')
            //   })
            // } else {
              window.history.go(-1)
            // }
          } else {
            this.$.push('router_back', {}, (res) => {
              console.log('router_back executed')
            })
          }
          // this.$.push('router_back')
        }
      }
    },
    mounted () {
      let clientInName = ''
      if (this.$.isWechat) {
        this.isWechat = true
      }
      if (this.activityType === '4') {
        clientInName = '帮砍价'
      } else if (this.activityType === '3') {
        clientInName = '拼团购'
      } else if (this.activityType === '2') {
        clientInName = '限时秒杀'
      } else if (this.activityType === '2') {
        clientInName = 'N元抢购'
      } else {
        clientInName = 'V服爱车'
      }
      document.title = this.mainText || clientInName
    }
  }
</script>

<style>
  /*.header-container{
    position: absolute;
    top: 49px;
  }*/
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
    /*overflow: hidden;*/
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

</style>
