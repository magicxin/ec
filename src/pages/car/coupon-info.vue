<template>
  <section id="coupon-info">
    <!-- <appbar :link="linkName"/> -->
    <magic-header titleName="优惠券详情"></magic-header>
    <section class="coupon-info-content">
      <div class="goBack" @click="goToBack(linkName)"></div>
      <div class="coupon-bg">
        <div id="coupon-bg" :style="'background-image:url('+picPacket+')'"></div>
        <div class="coupon-info-text">
          <div class="coupon-info-text-top">
            <span>￥</span>
            <section>{{parseFloat(couponInfo.amount || '')}}</section>
            <p class="info-name">{{couponInfo.name || "优惠券"}}</p>
            <p class="info-desc">{{couponInfo.couponDesc || ""}}</p>
          </div>
          <div class="info-text-bottom">
            <p class="info-introduce">{{couponInfo.desc || '&ensp;'}}</p>
            <div>
              <p class="couponCode">{{linkName.name == 'get-coupon' ? '&ensp;' : '优惠券：' + couponInfo.code}}</p>
              <p class="info-validity">有效期：{{couponInfo.beginDate}}至{{couponInfo.endDate}}</p>
            </div>
          </div>
        </div>
        <div class="activeGetCoupon" @click="activeGet(couponInfo)"
             v-bind:class="{activeState:couponInfo.state !== '1'}">
          {{couponInfo.state !== '1' ? '已领取' : '点击领取'}}
        </div>
      </div>
    </section>
    <!--使用规则-->
    <section class="regulation">
      <div class="regulation-title">
        <div class="oneLine"></div>
        <h3>使用规则</h3>
        <div class="regulation-content" v-html="couponInfo.introduction">
          {{couponInfo.introduction}}
        </div>
      </div>
    </section>
    <section id="shareButton" @click="activeToShare(couponInfo)"
             :style="'background-image:url('+iconShare+')'"></section>
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  import getCouponData from 'services/get-coupon-data'
  import couponInfoData from 'services/coupon-info-data'
  //  引入图片
  import picPacket from 'assets/pic_packet1.png'
  import iconShare from 'assets/icon_share.png'
  // import apiHost from 'settings/api-host'

  import calcMethod from 'utilities/calc-method'
  // import hybridRouter from 'settings/hybrid-router'

  export default{
    components: {
      // Appbar
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
        linkName: '',
        picPacket: picPacket,
//        优惠券详情
        couponInfo: {},
//        会员券ID
        couponId: '',
        iconShare: iconShare
      }
    },
    created(){
      this.linkName = {name: this.$route.params.linkName}
      console.log(this.linkName)
      this.couponId = this.$route.params.id
      this.getCouponInfo(this.couponId)
    },
    methods: {
      //返回上一页
      goToBack(){
        this.$router.push({
          name: 'get-coupon',
          meta: {
            title: '优惠券',
            auth: false
          },
          params: {
            couponId: this.couponId,
            state: this.couponInfo.state
          }
        })
      },
//      获取优惠券详情
      getCouponInfo(couponId){
        couponInfoData.getCouponInfo.bind(this)({
          id: couponId
        }, (data) => {
          this.couponInfo = data.coupon
        }, (err) => {
          console.log(err)
        })
      },
//      点击领取
      activeGet(item){
        if (item.state !== '1') {
          return false
        }
        console.log(item.id)
        this.getReceiveConpon(item)
      },
      //    领取优惠券
      getReceiveConpon(item){
        getCouponData.receiveConpon.bind(this)({
          couponId: item.id
        }, (data) => {
          console.log(data)
          item.state = '5'
        }, (err) => {
          console.log(err)
        })
      },
      activeToShare(item){
        console.log(item.promotionId)
        calcMethod({
          native(){
            this.$.push({
              name: 'route_share',
              query: {
                shareId: item.promotionId,  //产品id
                shareType: '10',    //分享类型
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
      }
    }
  }

</script>

<style lang="scss">

  #coupon-info {
    #shareButton {
      position: fixed;
      width: 4.5rem;
      height: 4.5rem;
      z-index: 10000000;
      right: 0;
      top: 0;
      background-size: cover;
    }
    .goBack {
      width: 4.5rem;
      height: 4.5rem;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .coupon-info-content {
      background-color: #efeff4;
      padding: 2rem;
      .coupon-bg {
        width: 100%;
        background-size: cover;
        height: 24rem;
        position: relative;
        #coupon-bg {
          width: 100%;
          background-size: 100% 24rem;
          height: 24rem;
          position: absolute;
        }
        .coupon-info-text {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          padding: 2rem;
          .coupon-info-text-top {
            color: #fff;
            padding-left: 5%;
            overflow: hidden;
            span {
              font-size: 2.5rem;
              float: left;
            }
            section {
              margin-top: -1.4rem;
              font-size: 6rem;
              float: left;
            }
            .info-name {
              width: 44%;
              padding-left: 5%;
              float: left;
              height: 4rem;
              overflow: hidden;
            }
            .info-desc {
              width: 44%;
              float: left;
              padding-left: 5%;
              margin-top: 0.5rem;

            }
          }
          .info-text-bottom {
            color: rgba(255, 255, 255, 0.7);
            .info-introduce {
              text-align: center;
            }
            div {
              width: 100%;
              text-align: center;
              margin: 0 auto;
            }
          }
        }
        .activeGetCoupon {
          text-align: center;
          position: absolute;
          width: 50%;
          height: 3.5rem;
          line-height: 3.5rem;
          bottom: 8.5%;
          left: 50%;
          margin-left: -25%;
          background-color: #f98700;
          color: #fff;
          border-radius: 0.7rem;
        }
        .activeGetCoupon.activeState {
          background-color: #bcbcbc;
        }
      }
    }
    .regulation {
      .regulation-title {
        position: relative;
        .oneLine {
          position: absolute;
          width: 100%;
          height: 0;
          border-top: 1px solid #c2c2c2;
          top: 3rem;
        }
        h3 {
          text-align: center;
          padding: 0 1rem;
          color: #414141;
          background-color: #fff;
          position: absolute;
          z-index: 100;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .regulation-content {
        padding: 5rem 2rem;
        p {
          padding-top: 0.6rem;
        }
      }
    }
  }
</style>
