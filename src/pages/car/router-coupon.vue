<template>
  <section id="router-coupon">
    <!-- <appbar link="my-pages"/> -->
    <magic-header titleName="优惠券"></magic-header>
    <!-- <content-with-loading :loaded="loaded"> -->
      <section class="couponNone" v-if="!couponIsHave">
        <img :src="imgUri" alt="">
        <p>当前没有可用的优惠券!</p>
      </section>
      <ul class="couponHave" v-if="couponIsHave">
        <li>这里面有一些优惠券</li>
      </ul>
    <!-- </content-with-loading> -->

  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import routerCouponIcon from 'assets/router-coupon-icon.png'
  import routerCouponData from 'services/router-coupon-data'
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
        couponInfo: []
      }
    },
    created(){
      this.getCouponInfo()
    },
    methods: {
      getCouponInfo(couponType){
        routerCouponData.getRouterCouponInfo.bind(this)({
          type: couponType
        }, (data) => {
          couponType++
          this.couponInfo = data.touterCouponList
        }, (err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss">
  /*当前页面的CSS样式写在这里，其中的scoped表示这个里面写的css代码只会在这个页面生效，不会去影响到其他
  组件页面*/
  #router-coupon {
    background-color: #ebebeb;
    .couponNone {
      text-align: center;
      padding-top: 30%;
      img {
        width: 40%;
      }
    }
    .couponHave {

    }
  }

</style>
