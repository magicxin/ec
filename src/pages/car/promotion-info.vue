<template>
  <section id="promotion-info">
    <!-- <content-with-loading :loaded="loaded"> -->
      <!-- <appbar :link="linkName"/> -->
      <magic-header titleName="活动详情"></magic-header>
      <!-- <magic-header :titleName="linkName"></magic-header> -->
      <section class="promotion-title">
        <h3>{{promotionInfo.title}}</h3>
        <p class="time">发布时间：{{promotionInfo.publishDate}}</p>
        <div>优惠时间：{{promotionInfo.beginDate}} 至 {{promotionInfo.endDate}}</div>
        <p class="text">{{promotionInfo.content}}</p>
      </section>
      <section class="promotion-content">
        <div class="promotion-content-top">
          <div class="content-top-left">优惠车型</div>
          <!--<div class="content-top-right">-->
          <!--<span class="active">排量</span>-->
          <!--<span>销量</span>-->
          <!--<span>价格</span>-->
          <!--</div>-->
        </div>
        <ul class="promotion-content-list">
          <li v-for="item in promotionInfo.product">
            <div @click="activeToInfo(item)" class="list-title">{{item.fullName || '&nbsp;'}}</div>
            <div @click="activeToInfo(item)" class="list-left">
              <p class="old">原&nbsp;&nbsp;&nbsp; 价： ￥{{(item.marketPrice || 0) / 10000}}万</p>
              <p class="new">优惠价： ￥{{(item.price || 0) / 10000}}万</p>
              <span
                :style="'background-image:url('+iconDepreciateGray+')'">{{((item.marketPrice || 0) - (item.price || 0)) / 10000}}万</span>
            </div>
            <div class="list-right">
              <!--判断是不是整车 是否显示试驾-->
              <div @click="activeToDrive(item)" v-if="item.categoryType ==='0'">
                <span :style="'background-image:url('+iconService+')'"></span>
                <p>试驾</p>
              </div>
              <i v-if="item.categoryType ==='0'"></i>
              <div @click="callAppointment(item)">
                <span :style="'background-image:url('+iconCall+')'"></span>
                <p class="callIcon">预约</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    <!-- </content-with-loading> -->
    <section id="shareButton" @click="activeToShare(promotionInfo)"
             :style="'background-image:url('+iconShare+')'"></section>
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'

  // import apiHost from 'settings/api-host'
  import promotionInfoData from 'services/promotion-info-data'

  //引入图标
  import defaultCallIcon from 'assets/default_call_icon.png'
  import serviceDrivingIcon from 'assets/service_driving_icon.png'
  import iconDepreciateGray from 'assets/icon-depreciate-gray.png'
  import iconShare from 'assets/icon_share.png'

  import calcMethod from 'utilities/calc-method'
  // import hybridRouter from 'settings/hybrid-router'

  export default{
    components: {
      magicHeader
    },
    deactivated () {
      //不是你期望的数据 则销毁组件
      if (this.couponId !== this.$route.params.id) {
        this.$destroy()
      }
    },
    data() {
      return {
//        会员券id
        couponId: '',
//        接受上一级的路由
        linkName: '',
//        促销活动详情
        promotionInfo: {},
        loaded: true,
        locationHref: this.addPath(),
//        手机图标
        iconCall: defaultCallIcon,
//        预约图标
        iconService: serviceDrivingIcon,
        iconDepreciateGray: iconDepreciateGray,
        iconShare: iconShare
      }
    },
    created(){
      this.linkName = {name: this.$route.params.linkName}
      this.couponId = this.$route.params.id
//      this.couponId = '119'
      this.getPromotionInfo(this.couponId)
    },
    methods: {
//      获取促销详情
      getPromotionInfo(couponId){
        promotionInfoData.getPromotionInfo.bind(this)({
          id: couponId
        }, (data) => {
          console.log(data.promotion.product[0])
          this.promotionInfo = data.promotion
          this.loaded = true;
          //遍历一遍数组 给图片全部增加本地的地址
          this.promotionInfo.product.forEach((data) => {
            data.brandLogo = this.addPath(data.brandLogo)
          })
        }, (err) => {
          console.log(err)
          this.loaded = true;
        })
      },
//      分享
      activeToShare(item){
        console.log(item)
        calcMethod({
          native(){
            this.$.push({
              name: 'route_share',
              query: {
                shareId: item.id,  //产品id
                shareType: '4',    //分享类型
                shareTitle: item.name,
                shareContent: item.desc,
                targetUrl: location.pathname + location.hash
              }
            })
          },
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', location.pathname + location.hash)
          }
        })()
      },
//      跳转到预约试驾
      activeToDrive(item){
        console.log(item.id)
        calcMethod({
          native(){
            this.$.push({
              name: 'router_driveAppointment',
              query: {
                ProductID: item.id
              }
            })
          },
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', 'router_driveAppointment')
          }
        })()
      },
//      预约电话
      callAppointment(item){
        console.log(item)
        calcMethod({
          native(){
            this.$.push({
              name: 'router_callOthers',
              query: {
                phone: item.shop.mobile
              }
            })
          },
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', 'router_callOthers,phone:', item.shop.mobile)
          }
        })()
//
      },
//      跳转到车辆详情
      activeToInfo(item){
        let uri = '#sg_goods_car/' + item.id + '/1'
        calcMethod({
          native(){
            this.$.push({
//              name: 'router_compareProduct',
//              query: {
//                ProductID: item.id
//              }
              name: 'router_crossWebView',
              query: {
                project: 'ec',
                routeAndParams: uri
              }

            })
          },
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', uri)
          }
        })()
      }
    }
  }
</script>

<style lang="scss">
  #promotion-info {
    #shareButton {
      position: fixed;
      width: 4.5rem;
      height: 4.5rem;
      z-index: 10000000;
      right: 0;
      top: 0;
      background-size: cover;
    }
    .promotion-title {
      padding: 1rem 1rem 0;
      text-align: center;
      h3 {
        margin: 0;
        font-size: 2rem;
        padding: 1rem 0;
      }
      p.time {
        color: #929292;
      }
      div {
        margin-top: 1rem;
        width: 100%;
        height: 4rem;
        line-height: 4rem;
        border: 1px solid #c60007;
        background-color: #fdf7f7;
        color: #414141;
      }
      p.text {
        margin-top: 1rem;
        text-align: left;
        text-indent: 2em;
      }
    }
    .promotion-content {
      padding: 2rem 1rem 0;
      .promotion-content-top {
        overflow: hidden;
        border-bottom: 1px solid #c5c5c5;
        padding-bottom: 0.3rem;
        .content-top-left {
          float: left;
          border-left: 0.4rem solid #c60007;
          padding-left: 1rem;
          line-height: 1.6rem;
          font-size: 1.5rem;
          color: #1a1a1a;
        }
        .content-top-right {
          float: right;
          span.active {
            color: #c60007;
          }
          span {
            padding-left: 1.4rem;
          }
        }
      }
      .promotion-content-list {
        overflow: hidden;
        padding-top: 1rem;
        li {
          margin-bottom: 1rem;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid #c5c5c5;
          padding: 0 1.4rem 0.3rem;
          .list-title {
            color: #000;
          }
          .list-left {
            float: left;
            .old {
              color: #929292;
            }
            .new {
              color: #c60007;
              float: left;
              margin-right: 2rem;
            }
            span {
              color: #68a200;
              padding: 0.2rem 0 0.3rem 1.4rem;
              background-repeat: no-repeat;
              background-size: 10px 20px;
            }
          }
          .list-right {
            float: right;
            position: relative;
            div {
              float: left;
              margin-left: 1.5rem;
              text-align: center;
              width: 3rem;
              span {
                width: 2rem;
                height: 2rem;
                float: left;
                background-size: cover;
                background-repeat: no-repeat;
                margin-left: 0.5rem;
              }
              p {
                font-size: 1.3rem;
                color: #666;
              }
              p.callIcon {
                color: #4b9100;
              }
            }
            i {
              height: 3rem;
              width: 1px;
              background-color: #959595;
              border-right: 1px solid #dedede;
              position: absolute;
              left: 60%;
              top: .2rem;
            }
          }
        }
      }
    }
  }
</style>
