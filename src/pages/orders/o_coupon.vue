<template>
  <div id="coupon">
    <!--hello world-->
    <icar-header mainText="优惠券" bgColor="#F7F7F7" textColor="#242424">
      <img src="../../assets/left-gray.svg">
    </icar-header>
    <c-coupon :value="queryData" :limit="price"></c-coupon>
  </div>
</template>

<script>
  import icarHeader from 'components/my-header'
  import ticket from 'assets/pic_ticket_bg_y.png'
  // import Order from 'services/order.service'
  import cCoupon from 'components/coupon'

  // let order = Order.getInstance()
  export default {
    name: 'coupon',
    data () {
      return {
        ticket,
        queryData: [],
        price: ''
      }
    },
    methods: {
      use (params) {
        // order.useCoupon(params.item)
        this.$router.go(-1)
      }
    },
    components: {
      icarHeader,
      cCoupon
    },
    beforeRouteEnter (to, from, next) {
      let couponList = JSON.parse(to.query.couponList)
      next(vm => {
        couponList.forEach(val => {
          vm.queryData.push(val.coupon)
        })
        vm.price = to.query.price
        // vm.queryData = couponList
      })
    }
  }
</script>

<style>
  /*#coupon .primary-button {
    position: absolute;
    right: 10px;
    line-height: 25px;
    height: 25px;
    width: 50px;
    background-color: #F98700;
  }

  #coupon .one_coupon{
    margin: 10px;
    border-radius: 4px;
  }
  #coupon .coupon_panel img{
    position: absolute;
    right: -5px;
    height: 83px;
  }
  
  #coupon .coupon_panel{
    background-color: #fff;
    overflow: hidden;
    border-radius: 4px;
  }

  #coupon .coupon_img{
    background-color: #FFAC30;
    position: relative;
    height: auto;
    color: #fff;
    
  }

  #coupon .coupon_icon{
    font-size: 1.4rem;
  }

  #coupon .coupon_price{
    font-size: 2.4rem;
  }

  #coupon .coupon_detail{
    padding: 7px 5px 7px 20px;
    position: relative;
  }

  #coupon .coupon_desc{
    height: 25px;
    line-height: 25px;
  }

  #coupon h4{
    font-size: 1.2rem;
  }

  #coupon p {
    margin-top: 10px;
    color: #A7A7A7;
    font-size: .9rem;
  }

  #coupon p + p{
    margin-top: 4px;
  }*/
</style>