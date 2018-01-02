<template>
  <!--主要是放html页面结构-->
  <section id="sales-promotion">
    <!-- <content-with-loading :loaded="loaded"> -->
      <!-- <appbar/> -->
      <magic-header titleName="最新促销"></magic-header>
      <section class="couponNone" v-if="!promotionIsHave">
        <img :src="imgUri" alt="">
        <p>您当前还没有收到促销信息!</p>
      </section>
      <section class="promotion-list" v-if="promotionIsHave">
        <section class="promotion-item" v-for="item in promotions" @click="toPromotionInfo(item)">
          <section class="item-img" :style="'background-image:url('+item.cover+')'">
            <!--<img :src="item.cover" alt="">-->
          </section>
          <section class="item-text">
            <div>{{item.title}}</div>
            <p class="item-text-content">{{item.desc || '&nbsp;'}}</p>
            <p class="item-text-time">{{item.beginDate}} 至 {{item.endDate}}</p>
            <span>进行中</span>
          </section>
        </section>
      </section>
    <!-- </content-with-loading> -->
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import salesPromotionData from 'services/sales-promotion-data'
  import routerCouponIcon from 'assets/router-coupon-icon.png'
  // import apiHost from 'settings/api-host'

  export default{
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading
    },
    data() {
      return {
        promotionIsHave: false,
        imgUri: routerCouponIcon,
//        存放返回的促销列表
        promotions: [],
//        请求的type 值
        type: 2,
        loaded: false,
      }
    },
    created(){
      this.getSalesList(this.type)
    },
    methods: {
      getSalesList(type){
        salesPromotionData.getSalesPromotion.bind(this)({
          type: type
        }, (data) => {
          console.log(data)
          data.promotions.forEach((data) => {
            data.cover = this.addPath(data.cover)
            this.promotions.push(data)
          })
          console.log(this.promotions.length)
          this.promotionIsHave = this.promotions.length
          this.loaded = true
        }, (err) => {
          console.log(err)
          this.loaded = true
        })
      },
      //跳转到促销详情页面
      toPromotionInfo(item){
        console.log(item.id)
        this.$router.push({
          name: 'promotion-info',
          meta: {
            title: '促销详情',
            auth: true
          },
          params: {
            id: item.id,
            linkName: 'sales-promotion'
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #sales-promotion {
    background-color: rgb(239, 239, 244) !important;
    .couponNone {
      text-align: center;
      padding-top: 30%;
      img {
        width: 40%;
      }
    }
    .promotion-list {
      width: 90%;
      margin-left: 5%;
      padding-top: 2rem;
      .promotion-item {
        width: 100%;
        overflow: hidden;
        border-radius: 0.7rem;
        margin-bottom: 2rem;
        background-color: #fff;
        .item-img {
          min-width: 320px;
          height: 15rem;
          overflow: hidden;
          padding-top: 55%;
          background-size: cover;
          /*img {*/
          /*width: 100%;*/
          /*line-height: 15rem;*/
          /*}*/
        }
        .item-text {
          position: relative;
          padding: 1.5rem 1rem 1rem;
          div {
            color: #000;
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
          }
          P {
            font-size: 1.4rem;
            color: #929292;
            line-height: 2.5rem;
            width: 80%;
            overflow: hidden;
          }
          span {
            position: absolute;
            right: 2rem;
            top: 5rem;
            color: #ffac30;
          }
          span.state {
            color: #929292;
          }
        }
      }
    }
  }

</style>
