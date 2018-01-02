<template>
  <section id="get-coupon">
    <!-- <appbar/> -->
    <!-- <content-with-loading :loaded="loaded"> -->
      <magic-header titleName="领取优惠券"></magic-header>
      <section class="couponNone" v-if="!couponIsHave">
        <img :src="imgUri" alt="">
        <p>当前没有可用的优惠券!</p>
      </section>
      <ul class="couponHave" v-if="couponIsHave">
        <li v-for="item in couponInfo">
          <div class="toCouponInfo" @click="activeCouponInfo(item)"></div>
          <div v-if="isFromIndex" class="coupon-list-left" v-bind:class="{activeState:item.state !== '1'}">
            <span v-bind:class="{active:item.minimumPrice == ''}">￥</span>
            <h3 v-bind:class="{active:item.minimumPrice == ''}">{{parseFloat(item.amount || 100)}}</h3>
            <!--规则-->
            <p v-if="item.minimumPrice !== ''">满{{item.minimumPrice}}减{{item.amount}}</p>
          </div>
          <div v-if="!isFromIndex" class="coupon-list-left" v-bind:class="{activeState:item.state !== '2'}">
            <span v-bind:class="{active:item.minimumPrice !== ''}">￥</span>
            <h3 v-bind:class="{active:item.minimumPrice !== ''}">{{parseFloat(item.amount || 100)}}</h3>
            <!--规则-->
            <p>{{""}}</p>
          </div>
          <div v-if="isFromIndex" class="pic-ticket-bg"
               :style="item.state !=='1'?'background-image:url('+indentIconG+')':'background-image:url('+indentIconY+')'"></div>
          <!--<div v-if="!isFromIndex" class="pic-ticket-bg"-->
          <!--:style="item.state !=='2'?'background-image:url('+indentIconG+')':'background-image:url('+indentIconY+')'"></div>-->
          <div class="coupon-list-right">
            <p v-if="isFromIndex" class="right-title" v-bind:class="{activeState:item.state !== '1'}">
              {{item.name || '优惠券'}}</p>
            <span v-if="isFromIndex" @click="activeGet(item)" v-bind:class="{activeState:item.state !== '1'}">
              {{item.state !== '1' ? '已领取' : '领取'}}
            </span>
            <p class="right-text">{{item.couponDesc || '&nbsp;'}}</p>
            <p class="right-validity">有效期：{{item.beginDate}}至{{item.endDate}}</p>
          </div>
        </li>
      </ul>
    <!-- </content-with-loading> -->

  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import routerCouponIcon from 'assets/router-coupon-icon.png'
  import getCouponData from 'services/get-coupon-data'
  // 引入图片
  // import apiHost from 'settings/api-host'
  import picTicketBgGray from 'assets/pic_ticket_bg_grey.png'
  import picTicketBgY from 'assets/pic_ticket_bg_y.png'
  export default{
    components: {
      // Appbar,
      // ContentWithLoading
      magicHeader
      
    },
    data() {
      return {
        loaded: true,
        imgUri: routerCouponIcon,
        couponIsHave: false,
//        传参
        couponType: 1,
        // 存放获取的数组
        couponInfo: [],
//        判断刷新
        isRefresh: false,
        indentIconY: picTicketBgY,
        indentIconG: picTicketBgGray,
//        接受详情页面返回值
        infoCouponID: '',
        infoState: '',
//        判断是哪个页面进来的
        isFromIndex: true,
        isAndroid: null
      }
    },
//    watch: {
//      '$route': function (to, from) {
//        if (from.name === 'my-pages') {
//          this.isFromIndex = true
//        }
//        if (this.isFromIndex) {
//          this.getCouponInfoInI(1)
//        } else {
//          this.getCouponInfoInM(2)
//        }
//      }
//    },
    created(){

      this.getCouponInfoInI(this.couponType)

    },
    mounted(){
      let vm = this
      // 获取客户端是否是安卓
      let u = navigator.userAgent
      vm.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      console.log(vm.isAndroid)
    },
    beforeUpdate(){
      //      接收返回的 优惠券ID 和 状态
      this.infoCouponID = this.$route.params.couponId
      this.infoState = this.$route.params.state
      if (this.infoCouponID) {
        this.judgeState()
      }
    },
    methods: {
//      判断返回的数据是否更新领取状态
      judgeState(){
        this.couponInfo.forEach((item, index) => {
          if (item.promotionId === this.infoCouponID) {
            this.couponInfo[index].state = this.infoState
          }
        })
      },
//      获取优惠券列表(首页进入）
      getCouponInfoInI(couponType){
        getCouponData.getGetCouponInfo.bind(this)({
          type: couponType
        }, (data) => {
          data.touterCouponList.forEach((item, index) => {
            this.couponInfo.push(item.coupon)
          })
          console.log(this.couponInfo.length)
          this.couponIsHave = this.couponInfo.length
        }, (err) => {
          this.couponIsHave = false
          console.log(err)
        })
      },
//      获取优惠券列表(我的页面进入）
      getCouponInfoInM(couponType){
        getCouponData.getListCoupon.bind(this)({
          type: couponType
        }, (data) => {
          console.log(data)
          data.touterCouponList.forEach((item, index) => {
            this.couponInfo.push(item)
          })
          console.log(this.couponInfo)
          this.couponIsHave = this.couponInfo.length
        }, (err) => {
          this.couponIsHave = false
          console.log(err)
        })
      },
//    领取优惠券
      getReceiveConpon(item){
        console.log(item)
        getCouponData.receiveConpon.bind(this)({
          couponId: item.id
        }, (data) => {
          console.log(data)
          item.state = '2'
        }, (err) => {
          console.log(err)
        })
      },
//      点击领取
      activeGet(item){
        console.log(item.couponDesc)
        if (item.state !== '1') {
          return false
        }
        console.log(item.id)
        this.getReceiveConpon(item)
      },
//      点击li标签跳转到优惠券详情页
      activeCouponInfo(item){
        this.$router.push({
          name: 'coupon-info',
          meta: {
            title: '优惠券详情',
            auth: true
          },
          params: {
            id: item.promotionId,
            linkName: 'get-coupon'
          }
        })
      },
//      跳转到使用页面
      activeToUse(item){

      }
    }
  }
</script>

<style lang="scss">
  /*
  .activeState 为已经获取了优惠券或优惠券不可领取的状态class名
  */
  #get-coupon {
    background-color: #efeff4 !important;
    .couponNone {
      text-align: center;
      padding-top: 30%;
      img {
        width: 40%;
      }
    }
    .couponHave {
      padding-top: 2rem;
      li {
        margin: 0 auto 1.3rem;
        height: 8rem;
        width: 90%;
        border-radius: 7px;
        overflow: hidden;
        background-color: #fff;
        position: relative;
        z-index: 5;
        .toCouponInfo {
          width: 75%;
          height: 100%;
          background-color: red;
          position: absolute;
          z-index: 5;
          opacity: 0;
        }
        .coupon-list-left {
          width: 30%;
          height: 100%;
          float: left;
          background-color: #ffac30;
          color: #fff;
          position: relative;
          padding-left: 2.2rem;
          /*min-width: 11.5rem;*/
          overflow: hidden;
          span {
            font-size: 2rem;
            position: absolute;
            top: 1.1rem;
            left: 1.1rem;
          }
          span.active {
            transform: translateY(0.7rem);
          }

          h3 {
            text-align: center;
            font-size: 3rem;
            font-weight: normal;
            margin-top: 0.5rem;
          }
          h3.active {
            transform: translateY(0.7rem);
          }
          p {
            color: #fff;
            opacity: 0.9;
            font-size: 1.2rem;
            margin-top: -3rem;
            margin-left: -1rem;
            text-align: center;
          }
        }
        .coupon-list-left.activeState {
          background-color: #b1b1b1;
        }
        .coupon-list-right {
          width: 100%;
          position: relative;
          height: 100%;
          .right-title {
            position: absolute;
            height: 1.7rem;
            padding-left: 33%;
            left: 0.7rem;
            top: 1rem;
            font-size: 1.4rem;
            max-width: 40rem;
            width: 75%;
            overflow: hidden;
          }
          .right-title.activeState {
            color: #929292;
          }
          span {
            position: absolute;
            width: 6rem;
            height: 3rem;
            right: 1rem;
            top: 1rem;
            background-color: #f98700;
            border-radius: 0.4rem;
            line-height: 3rem;
            text-align: center;
            color: #fff;
            font-size: 1.35rem;
            z-index: 6;
          }
          span.activeState {
            color: #929292;
            border: 1px solid #929292;
            background-color: #fff;
          }
          .right-text {
            font-size: 1.2rem;
            padding-top: 4rem;
            transform: translateX(1.2rem);
            color: #929292;
          }
          .right-validity {
            font-size: 1.2rem;
            transform: translateX(1.2rem);
            color: #929292;
          }
        }
        .pic-ticket-bg {
          width: 0.5rem;
          height: 8rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          float: left;
          margin-left: -1px;
        }
      }
    }
  }

</style>
