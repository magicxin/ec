<template>
  <div class="mall background-gray">
    <big-header>
      <img :src="picKind07" slot="main-img" class="header">
      <p slot="right-text">积分规范</p>
    </big-header>

    <order-header>
      <h4 class="label" slot="label">会员商城<span>(银牌会员专享)</span></h4>
    </order-header>

    <panel>
      <origin slot="desc"></origin>
      <price slot="price"></price>
      <router-link slot="number" to="sg_goods" class="_button">换购</router-link>
    </panel>
  </div>
</template>

<script>
  import panel from 'components/panel'
  import orderHeader from 'components/order-header.vue'
  import origin from 'components/origin'
  import price from 'components/price'
  import icarButton from 'components/order-button'
  import bigHeader from 'components/big-header'
  import orderTitle from 'components/order-tittle'
  import picKind07 from 'assets/pic_kind_07.png'
  
  export default {
    name: 'integralMall',
    data () {
      return {
        picKind07
      }
    },
    components: {
      panel,
      orderHeader,
      origin,
      price,
      icarButton,
      bigHeader,
      orderTitle
    }
  }
</script>

<style scoped>
  .mall h4.label{
    padding-bottom: 4px;
    padding-top: 4px;
    font-size: 0.9rem;
  }

  .mall #original{
    margin-top: 5px;
  }

  .mall .header{
    border-radius: 50%;
    height: 60px;
    width: 60px;
    overflow: hidden;
    margin-top: 12px;
  }

  .mall h4.label::before{
    content: "丨";
    color: #C60007;
    width: 20px;
    font-weight: 600;
  }
  
  .mall ._button{
    display: inline-block;
    width: 50px;
    height: 30px;
    border: 1px solid #F33838;
    color: #F33838;
    border-radius: 4px;
    line-height: 29px;
    text-align: center;
    margin-right: 10px;
  }

</style>