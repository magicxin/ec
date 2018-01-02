<template>

  <section id="cb_coupon_info">
    <!-- <icar-header main-text="优惠券详情" bgColor="#F7F7F7" textColor="#242424">
      <img :src="left" alt="">
    </icar-header> -->
    <magic-header titleName="优惠券详情"></magic-header>

    <section class="coupon-info-content">
      <div class="goBack" @click="goToBack(linkName)"></div>
      <div class="coupon-bg">
        <div id="coupon-bg" :style="'background-image:url('+picPacket+')'"></div>
        <div class="coupon-info-text">
          <div class="coupon-info-text-top">
            <span v-if="couponInfo.amount">￥</span>
            <section v-if="couponInfo.amount">{{parseFloat(couponInfo.amount || 0)}}</section>
            <p class="info-name">{{couponInfo.name || "优惠券"}}</p>
            <p class="info-desc">{{couponInfo.couponDesc || ""}}</p>
          </div>
          <div class="info-text-bottom">
            <p class="info-introduce">{{couponInfo.desc || '&ensp;'}}</p>
            <div v-if="!!couponInfo.endDate">
              <p class="info-validity">有效期：{{couponInfo.beginDate}}至{{couponInfo.endDate}}</p>
            </div>
          </div>
        </div>
        <div class="activeGetCoupon" v-tap="{methods: use, item: couponInfo}"
             v-if="couponInfo.state === '2'&&couponInfo.type !== '2'&&couponInfo.type !== '3'">使用
        </div>
        <div class="activeGetCoupon activeState"
             v-if="couponInfo.state === '0'&&couponInfo.type !== '2'&&couponInfo.type !== '3'">未开始
        </div>
        <div class="activeGetCoupon activeState"
             v-if="couponInfo.state === '3'&&couponInfo.type !== '2'&&couponInfo.type !== '3'">已过期
        </div>
        <div class="activeGetCoupon activeState"
             v-if="couponInfo.state === '4'&&couponInfo.type !== '2'&&couponInfo.type !== '3'">已使用
        </div>
      </div>
    </section>
    <div class="imgBox">
      <img :src="couponInfo.qrCodePath" v-if="!!couponInfo.qrCodePath" alt="二维码">
      <p class="couponCode">{{ linkName.name == 'get-coupon' ? '&ensp;' : '优惠券：' + couponInfo.code}}</p>
    </div>
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
  </section>

</template>

<script>
	import Vue from 'vue'
  // import icarHeader from 'components/my-header'
  // import left from 'assets/left-gray.svg'
  import magicHeader from 'components/magicHeader'
  import picPacket from 'assets/pic_packet1.png'
  import Order from 'tools/order.service.js'
  let order = Order.getInstance()


  export default{
    components: {
      magicHeader
    },
    data(){
      return {
        picPacket: picPacket,
        couponInfo: {},
//        会员券ID 
        couponId: '',
        linkName: ''
      }
    },
    methods: {
      use (params) {
        if(params.item.type === '1'){
          this.$router.push({
            name: "sg_goodsList"
          });
        }else if(params.item.type === '2'|| params.item.type === '3'){
          this.$router.push({
            name: "cb_couponInfo",
            query: {
              id: params.item.id
            }
          });
        }else if(params.item.type === '4'){ //团购券
          this.$router.push({
            name:'eve_groupShoppingDetails',
            params:{
              coupon:{
                name:item.name,
                id:item.id
              },
              activityId:item.activityId
            }
          })
        }else if(params.item.type === '5'){  //秒杀券
          this.$router.push({
            name: "eve_timeSpikeDetails",
            params:{
              coupon:{
                name:item.name,
                id:item.id
              },
              activityId:item.activityId
            }
          });
        }else{
          this.$router.push({
            name: "sg_goodsList"
          });
        }
      },
    },
    beforeRouteEnter (to, from, next) {
      console.log(to.query.id)
      Vue.prototype.$.get({
        methodName: 'QueryCoupon',
        couponId: to.query.id
      }).then(resp => {
        next(vm => {
          vm.couponInfo = resp.data.coupon
          vm.couponInfo.qrCodePath = resp.data.coupon.qrCodePath ? vm.addPath(resp.data.coupon.qrCodePath): ''
          console.log(vm.couponInfo)
        })
      })
    }
  }
</script>

<style lang="scss">
  #cb_coupon_info {
    .imgBox{
      text-align: center;
      background-color: #efeff4;
      img{
        width: 200px;
      }
      p{
        line-height: 40px;
      }
    }
    .coupon-info-content {
      background-color: #efeff4;
      padding: 2rem;
      .coupon-bg {
        width: 100%;
        background-size: cover;
        height: 18rem;
        position: relative;
        #coupon-bg {
          width: 100%;
          background-size: 100% 18rem;
          height: 18rem;
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
              font-size: 2rem;
              float: left;
            }
            section {
              margin-top: 0;
              font-size: 4rem;
              float: left;
            }
            .info-name {
              width: 44%;
              padding-left: 5%;
              float: right;
              height: 2rem;
              overflow: hidden;
            }
            .info-desc {
              width: 44%;
              float: right;
              padding-left: 5%;
              margin-top: 0.5rem;

            }
          }
          .info-text-bottom {
            margin-top: .6rem;
            color: rgba(255, 255, 255, 0.7);
            p {
              line-height: 1.5rem;
            }
            .info-introduce {
              text-align: center;
            }
            div {
              width: 22rem;
              margin: 0 auto;
            }
          }
        }
        .activeGetCoupon {
          text-align: center;
          position: absolute;
          width: 50%;
          height: 2.5rem;
          line-height: 2.5rem;
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
          top: 1.5rem;
        }
        h3 {
          text-align: center;
          padding: 0 1rem;
          color: #414141;
          background-color: #F8F8F8;
          position: absolute;
          z-index: 100;
          top: .9rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .regulation-content {
        padding: 3rem 2rem 0;
        p {
          padding-top: 0.6rem;
        }
      }
    }
  }

</style>
