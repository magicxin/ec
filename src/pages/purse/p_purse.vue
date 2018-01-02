<template>
  <div id="p_purse">
    <my-header main-text="会员卡" bg-color="#f7f7f7" text-color="#030303" line-color="#030303">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>

    <div class="purse-img">
      <img :src="purseImg.purseTop" width="90%" height="90%">
      <img :src="purseImg.purseBody" width="90%" height="90%">
      <img :src="purseImg.purseSide" width="90%" height="90%">
      <img :src="purseImg.purseFoot" width="90%" height="90%">
      <span class="img-top-text">VIP会员卡</span>
      <span class="img-body-text">余额：<span class="img-momey-text">¥{{queryData.balance}}</span></span>
      <!--<a class="img-foot-text" v-tap="{methods: charge}">会员卡充值</a>-->
      <router-link to="charge" class="img-foot-text">会员卡充值</router-link>
    </div>

    <div class="total-content" layout="column">
      <div flex layout="row" class="total-header">
        <div flex class="total-header-item">
          <span class="total-top">收入(元)</span>
          <br/>
          <span class="total-bottom">¥ {{queryData.income}}</span>
        </div>
        <div flex class="total-header-item">
          <span class="total-top">支出(元)</span>
          <br/>
          <span class="total-bottom">¥ {{queryData.disburse}}</span>
        </div>
      </div>
      <div flex layout="row" class="total-foot" layout-align="space-between center">
        <div flex>
          收支明细
        </div>
        <div flex="nogrow" class="text-right">
          <mu-select-field :autoWidth="true" v-model="type">
            <mu-menu-item value="0" title="全部"/>
            <mu-menu-item value="1" title="收入"/>
            <mu-menu-item value="2" title="支出"/>
          </mu-select-field>
        </div>
      </div>
    </div>

    <mu-divider style="background-color: #c4c4c4;"/>

    <load-more :bottom-method="loadBottom">
      <div class="purse-content">
        <div class="content-year">2016年</div>
        <div layout="row" layout-align="space-between center" class="content-main" v-for="item in queryData.details">
          <div class="main-left" flex="nogrow">
            <span class="main-name">{{item.name}}</span>
            <span class="main-time">{{item.happenDate}}</span>
          </div>
          <div class="main-price">
            <span v-if="item.type === '0'">-</span>
            <span v-else>+</span>
            ¥ {{item.amount}}元
          </div>
        </div>
      </div>
    </load-more>

    <pay-order :isShow="chargeData.showChagreOrNot" :value="chargeData.req" @closePayOrder="submitPay"></pay-order>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'

  import payOrder from 'components/pay-Order'
  import purseTop from 'assets/purse-top.png'
  import purseBody from 'assets/purse-body.png'
  import purseSide from 'assets/purse-side.png'
  import purseFoot from 'assets/purse-foot.png'
  import Loadmore from 'vue-loadmore'
  let query = {
    index: 0,
    count: 1
  }

  function getPurpse (vm, type) {
    return this.$.get({
      methodName: 'QueryWallet',
      type: type,
      index: query.index.toString(),
      count: query.count.toString()
    }).then(resp => {
      vm.queryData = resp.data
    })
  }


  export default {
    name: 'p_purse',
    data () {
      return {
        purseImg: {
          purseTop,
          purseBody,
          purseSide,
          purseFoot
        },
        queryData: {},
        type: '0',
        chargeData: {
          req: {
          },
          showChagreOrNot: false
        }
      }
    },
    methods: {
      loadBottom () {
        getPurpse(this, this.type)
      },
      charge () {
        this.chargeData.showChagreOrNot = true
      },
      submitPay (params) {
        if (params === 'true') {
          this.chargeData.req.amountPaid = '44'
          this.chargeData.req.orderType = '1'
          this.$.get(this.chargeData.req).then(resp => {
            if (resp.data.resultCode === '100') {
              this.chargeData.showChagreOrNot = false
            }
          })
        }
      }
    },
    components: {
      myHeader,
      loadMore: Loadmore,
      payOrder: payOrder
    },
    watch: {
      type (value) {
        getPurpse(this, value)
      }
    }
  }
</script>

<style>
  #p_purse .mu-text-field{
    width: 60px;
  }

  #p_purse .mu-dropDown-menu-text-overflow{
    width:37px;
  }

  #p_purse {
    background-color: #efeff4;
  }

  #p_purse .keyboard_arrow_down{
    vertical-align: middle;
  }

  #p_purse .purse-img {
    text-align: center;
    margin-top: 15px;
    position: relative;
    font-size: 1.0rem;
  }

  #p_purse .purse-img img{
    display: inline-block;
    border: none;
    margin-top: -4px;
  }

  @media screen and (min-width: 380px) and (max-width: 499px) {
    #p_purse .purse-img {
      font-size: 1.1rem;
    }
  }

  @media screen and (min-width: 500px) and (max-width: 699px) {
    #p_purse .purse-img {
      font-size: 1.2rem;
    }
  }

  @media screen and (min-width: 700px) {
    #p_purse .purse-img {
      font-size: 1.3rem;
    }
  }

  #p_purse .img-top-text {
    position: absolute;
    top: 3.5%;
    right: 16%;
    font-size: 1rem;
    font-weight: 300;
    color: #fff;
  }

  #p_purse .img-body-text {
    display: block;
    width: 46%;
    position: absolute;
    bottom: 33%;
    right: 20px;
    font-size: 1rem;
    font-weight: 300;
    /*color: #82aadb;*/
    color: #703c00;
  }

  #p_purse .img-momey-text {
    font-size: 1.2rem;
    font-weight: 300;
    color: #fff;
  }

  #p_purse .img-foot-text {
    width: 100%;
    position: absolute;
    bottom: 5%;
    left: 0;
    font-size: 1.2rem;
    text-align: center;
    color: #fff;
  }

  #p_purse .total-content {
    width: 100%;
    background-color: #fff;
    margin-top: 8px;
    padding: 15px 15px 2px 15px;
  }

  #p_purse .total-content>div {
    width: 100%;
  }

  #p_purse .total-header {
    width: 100%;
    background-color: #f7f7f7;
    border: 1px solid #c9c9c9;
    border-radius: 3px;
    position: relative;
  }

  #p_purse .total-header::before {
    content: '';
    width:1px;
    height: 70%;
    background-color: #c9c9c9;
    position: absolute;
    left: 50%;
    top: 15%;
  }

  #p_purse .total-header-item {
    text-align: center;
    padding-top: 5px;
  }

  #p_purse .total-top {
    font-size: 1.2rem;
    line-height: 1.87;
    color: #0b0b0b;
  }

  #p_purse .total-bottom {
    font-size: 1.4rem;;
    line-height: 1.87;
    font-weight: 500;
    color: #f01919;
  }

  #p_purse .total-foot-left {
    font-size: 1rem;
    color: #1b1b1b;
    padding-left: 10px;
    position: relative;
  }

  #p_purse .total-foot-left::before {
    content: '';
    width: 2px;
    height: 80%;
    position: absolute;
    left: 0;
    top: 10%;
    background-color: #f68500;
  }

  #p_purse .total-foot-right {
    font-size: 1rem;
    color: #1b1b1b;
  }

  #p_purse .total-foot-righ-img {
    width: 18px;
    height: 18px;
    vertical-align: text-bottom;
  }

  #p_purse .purse-content {
    background-color: #efeff4;
  }

  #p_purse .content-year {
    font-size: 16px;
    color: #858584;
    /*font-weight: 300;*/
    padding: 10px 0 8px 15px;
  }

  #p_purse .content-main {
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #bebebe;
    max-width: 100%;
  }

  #p_purse .content-main-noborder {
    border-bottom: none;
  }

  #p_purse .main-name {
    font-size: 1.1rem;
    display: block;
    color: #030303;
    line-height: 1.87;
  }

  #p_purse .main-time {
    font-size: 1.2rem;
    color: #858584;
  }

  #p_purse .main-price {
    font-size: 1.3rem;
    color: #f01919;
  }
</style>
