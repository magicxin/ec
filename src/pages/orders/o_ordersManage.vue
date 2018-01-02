<template>
  <!-- 会员中心 -->
  <div class="background-gray" id="order_manage">
    <icar-header main-text="会员中心" bgColor="#F7F7F7" textColor="#242424" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods:goBack}">
    </icar-header>
    <scroll marginBottom="0" :bottom="true">
      <!--<cells>-->
      <!--<cell v-go=" 'orderlist({status: 0})' ">-->
      <!--<div slot="label">我的订单</div>-->
      <!--</cell>-->
      <!--</cells>-->
      <!--<grids class="status">-->
      <!--<grid width="25%" v-for="(item, key) in status" v-tap="{methods: go, key: key}">-->
      <!--<div lauout="column">-->
      <!--<badge :value="Number(item.value)" flex>-->
      <!--<img :src="item.icon" alt="">-->
      <!--</badge>-->
      <!--<p flex>{{item.title}}</p>-->
      <!--</div>-->
      <!--</grid>-->
      <!--</grids>-->

      <div class="divide"></div>
      <grids class="menu">
        <grid width="50%" align="left" v-for="(item,index) in queryData" :key="index" :link="item.go" class="menu_box"
              v-on:selfClick="selfClick(item)">
          <div layout="row">
            <img :src="item.icon" flex="nogrow">
            <div flex layout="column">
              <h4 flex>{{item.title}}</h4>
              <p flex v-html="item.label"></p>
            </div>
          </div>
        </grid>
      </grids>
    </scroll>

  </div>

</template>

<script>
	import Vue from 'vue'
  import grids from 'components/grids'
  import grid from 'components/grid'
  import badge from 'components/badge'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import icarHeader from 'components/my-header'
  import trolley from 'assets/icon_trolley.png'
  import fav from 'assets/icon_fav.png'
  // import card from 'assets/icon_card.png'
  import savemoney from 'assets/icon_savemoney.png'
  import account from 'assets/icon_account.png'
  import ID from 'assets/icon_ID.png'
  import service from 'assets/icon_service.png'
  import notpay from 'assets/icon_notpay.png'
  import pay from 'assets/icon_pay.png'
  import left from 'assets/left-gray.svg'

  import discuss from 'assets/icon_discuss.png'
  import returned from 'assets/icon_returned.png'
  import changegoods from 'assets/icon_changegoods.png'
  import invoice from 'assets/invoic.png'
  import scroll from 'components/scroll'

  function getAuthOptions (type) {
    let _result = {}
    switch (type) {
      case '0':
        _result.title = '请进行实名认证'
        _result.go = '/realName?type=0'
        break
      case '1':
        _result.title = '审核中'
        _result.go = '/realNameHas?type=1'
        break
      case '2':
        _result.title = '重新认证'
        _result.go = '/realNameHas?type=2'
        break
      case '3':
        _result.title = '您已是认证会员'
        _result.go = '/realNameHas?type=3'
        break
    }

    return _result
  }


  let data = {}
  export default {
    name: 'manage',
    data () {
      return {
        left,
        key: undefined,
        data: 'number',
        queryOrder: null,
        queryData: [{
          icon: trolley,
          title: '购物车',
          go: 'asc_shoppingCart',
          label: `您已挑选了<span style="color: #FAA850">${data.cartItem}</span>件商品`
        }, {
          icon: fav,
          title: '收藏',
          go: '/collection',
          label: `您收藏了<span style="color: #FAA850">${data.favourite}</span>件商品`
        }, {
          icon: savemoney,
          title: '卡券',
          go: '/cb_card',
          label: `可用卡券<span style="color: #FAA850">${data.coupon}</span>张`
        }, {
          icon: changegoods,
          title: 'V豆商城',
          go: '/vb_integralMall',
          label: `您的V豆为<span style="color: #FAA850">${Math.floor(data.bean)}</span>个`
        }/*, {
         icon: account,
         title: '账单',
         //          go: '/cb_billDiagram',
         isToVs: true,
         label: `本月花费<span style="color: #FAA850">¥${Number(data.monthAmount).toFixed(2)}</span>`
         }*/, {
          icon: invoice,
          title: '发票信息',
          go: '/o_invoiceList',
          label: `完善您的发票信息`
        }, {
          icon: ID,
          title: '实名认证',
          go: getAuthOptions(data.isAuthentication).go,
          label: getAuthOptions(data.isAuthentication).title
        }, {
          icon: service,
          title: '爱车顾问',
          label: `您的专属爱车顾问`
        }]
//        ,
//        status: [{
//          icon: notpay,
//          title: '待付款',
//          value: data.unPay
//        }, {
//          icon: pay,
//          title: '待使用',
//          value: data.unReceive
//        }, {
//          icon: discuss,
//          title: '待评价',
//          value: data.unComment
//        }, {
//          icon: returned,
//          title: '退货/退款',
//          value: data.refund
//        }]
      }
    },
    components: {
      grid,
      grids,
      badge,
      cells,
      cell,
      icarHeader,
      scroll
    },
    methods: {
//      go (params) {
//        this.$router.push({
//          name: 'orderlist',
//          params: {
//            status: encodeURIComponent(params.key + 1)
//          }
//        })
//      },
      webViewHistoryGoBack(){
        history.go(-1)
      },
      goBack (params) {
        this.$.push('router_back', null, (resp) => {
          console.log('调用成功')
        })
      },
      selfClick (item) {
//        判断是否是要跳转到vs的页面
        this.$.push('router_callCustomerService', {
          customerServiceId: '123', // it is not sure
          clentId: this.$.userId
        }, (response) => {
          console.log(response)
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'ManageOrder'
      }).then(resp => {
        data = resp.data.resultCode === '100' ? resp.data : {
          unPay: '0',
          unReceive: '0',
          unComment: '0',
          refund: '0',
          cartItem: '0',
          favourite: '0',
          balance: '0',
          bean: '0',
          coupon: '0',
          monthAmount: '0',
          isAuthentication: '0',
          adviserID: '0',
          resultCode: 100
        }
        next(vm => {
          vm.queryOrder = resp.data.resultCode === '100' ? resp.data : {
            unPay: '0',
            unReceive: '0',
            unComment: '0',
            refund: '0',
            cartItem: '0',
            favourite: '0',
            balance: '0',
            bean: '0',
            coupon: '0',
            monthAmount: '0',
            isAuthentication: '0',
            adviserID: '0',
            resultCode: 100
          }
        })
      })
    }
  }
</script>

<style>
  #order_manage {
    color: black;
  }

  #order_manage .divide {
    border: none;
  }

  #order_manage .badge {
    right: 18px;
    top: 4px;
    background-color: #F02B2B;
  }

  #order_manage .status img {
    width: 25px;
  }

  #order_manage .menu img {
    width: 20px;
    height: 20px
  }

  #order_manage .status p {
    color: #4A4A4A;
  }

  #order_manage .menu_box {
    padding: 15px 10px;
    background-color: #fff;
    padding-right: 0px;
  }

  #order_manage .status {
    background-color: #fff;
    height: 60px;
    /*line-height: 50px;*/
  }

  #order_manage .status .grid {
    padding-top: 10px;
    height: 100%;
  }

  #order_manage .menu h4 {
    color: #393939;
    font-size: 1.2rem;
    font-weight: 220;
    font-weight: normal;
    padding-left: 5px;
  }

  #order_manage .menu p {
    margin-top: 5px;
    color: #B4B4B4;
    padding-left: 4px;
  }

  #order_manage .menu img {
    display: inline-block;
    margin-top: -1px;
  }

  #order_manage .status .grid::before {
    display: none;
  }

  #order_manage .menu .grid:nth-child(6) img {
    width: 13px;
    height: 13px;
    display: inline-block;
    margin-top: 2px;
    margin-left: 4px;
  }

  #order_manage .menu .grid:nth-child(6) h4 {
    padding-left: 6px;
  }

  #order_manage .menu .grid:nth-child(6) p {
    padding-left: 6px;
  }
</style>
