<template>
  <!--<div style="position:relative">-->
  <div class="background-gray" id="order_list">
    <icar-header bgColor="#F7F7F7" mainText="我的订单" textColor="#474747" :isBridge="true">
      <img :src="left">
    </icar-header>
    <model :isShow="isShow" title=" " v-on:closeIsModel="confirmate">
      请确认是否已经收到货物
    </model>
    <!--<model :isShow="isShowDelete" title=" " v-on:closeIsModel="deleteOrder">-->
    <model :isShow="isShowDelete" title=" ">
      请确认是否要删除该订单
    </model>
    <model :isShow="isShowReturn" title=" " v-on:closeIsModel="cancelReturn">
      请确认是否撤销申请
    </model>
    <isModel ref="passwordModel" title="请输入支付密码">
      <password v-model="isModelData.data"></password>
    </isModel>
    <isModel modelType="prompt" title="" :isShow="isModelData.isShow">
      <h4 slot>支付密码输入错误, 请重试</h4>
      <div slot="work" layout="row" layout-align="space-between center" flex>
        <a flex v-tap="{methods: payByBalance}">重试</a>
        <a flex v-tap="{methods: setPassword}">找回密码</a>
      </div>
    </isModel>
    <div></div>
    <scroll ref="scroll" :bottom="true">
      <form v-show="activeTab === 'tab1'" class="search" onsubmit="return false">
        <input type="search" id="searchGood" v-model="searchValue" placeholder="商品名, 订单号" autocomplete="off">
      </form>
      <div class="orderList-header" :class="{ 'active': activeTab === 'tab1' }">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="test">
          <mu-tab value="tab1" title="全部"/>
          <mu-tab value="tab2" title="待付款"/>
          <mu-tab value="tab3" title="待使用"/>
          <mu-tab value="tab4" title="待评价"/>
          <mu-tab value="tab5" title="退货/退款"/>
        </mu-tabs>
      </div>

      <div class="orderList-body" :class="{ 'active': activeTab === 'tab1' }">
        <div v-if="activeTab === 'tab1'">
          <empty v-if="queryData.length === 0" message="暂时没有订单">

          </empty>
          <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
            <router-link :to="{name: 'orderDetail', params: {orderId: item.id}}" class="one-order"
                         v-for="(item,index) in queryData" :key="index">
              <order-title :value="orderType[item.type]" :label="'订单编号:' + item.sn"></order-title>
              <panel v-for="(product,index) in item.orderItems" :key="index" :value="product.product">
                <div slot="desc" class='desc'>
                  {{product.desc}}
                </div>
                <!--<price slot="price" :value="product.price"></price>-->
                <price slot="price"
                       :value="product.product.categoryType === '0' ? product.product.subscription : product.amount"></price>
                <span slot="number" class="number">X{{product.quantity}}</span>
              </panel>
              <div layout="column">
                <div layout="row" layout-align="flex-end center" class="order-sum text-right" flex>
                  <h4 flex>
                    合计: <span>¥{{item.amount || '0'}}</span>
                    共{{item.count || '0'}}件 <span>(含运费: ¥{{item.freight}})</span>
                  </h4>
                </div>
                <mu-divider shallowInset/>
                <div class="text-right" flex>
                  <order-button color="#8C8C8C" border="#8C8C8C"
                                v-if="(item.type === '1'||item.type === '11')||((item.method === '1'||item.method === '2')&&item.type === '5')"
                                v-tap="{methods: submitCancalOrder, item: item}">
                    取消订单
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payMoment, item: item}"
                                v-if="item.type === '1'&&item.method === '0'">
                    立即支付
                  </order-button>
                  <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: item}"
                                v-if="(item.type === '2' || item.type === '3' || item.type === '6')&&(item.method === '0'||item.method === '1')&&(item.orderType !== '4'&&item.orderType !== '5')">
                    物流跟踪
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: item}"
                                v-if="item.type === '3'">
                    立即评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: item}"
                                v-if="item.isReviewed === '1'">
                    查看评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: confirmate, item: item}"
                                v-if="item.type === '2'">
                    确认收货
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: buyAngin, item: item}"
                                v-if="item.type === '7' || item.type === '8' || item.type === '10' || item.type === '12'">
                    重新购买
                  </order-button>
                </div>
              </div>
            </router-link>
          </load-more>
        </div>
        <div v-if="activeTab === 'tab2'">
          <empty v-if="queryData.length === 0" message="暂时没有订单">

          </empty>
          <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
            <router-link :to="{name: 'orderDetail', params: {orderId: item.id}}" class="one-order"
                         v-for="(item,index) in queryData" :key="index">
              <order-title :value="orderType[item.type]" :label="'订单编号:' + item.sn"></order-title>
              <panel v-for="(product,index) in item.orderItems" :key="index" :value="product.product">
                <div slot="desc" class='desc'>
                  {{product.desc}}
                </div>
                <!--<price slot="price" :value="product.price"></price>-->
                <price slot="price"
                         :value="product.product.categoryType === '0' ? product.product.subscription : product.product.price"></price>
                <span slot="number" class="number">X{{product.quantity}}</span>
              </panel>
              <div layout="column">
                <div layout="row" layout-align="flex-end center" class="order-sum text-right" flex>
                  <h4 flex>
                    合计: <span>¥{{item.amount || '0'}}</span>
                    共{{item.count || '0'}}件 <span>(含运费: ¥{{item.freight}})</span>
                  </h4>
                </div>
                <mu-divider shallowInset/>
                <div class="text-right" flex>
                  <order-button color="#8C8C8C" border="#8C8C8C"
                                v-if="(item.type === '1'||item.type === '11')||((item.method === '1'||item.method === '2')&&item.type === '5')"
                                v-tap="{methods: submitCancalOrder, item: item}">
                    取消订单
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payMoment, item: item}"
                                v-if="item.type === '1'&&item.method === '0'">
                    立即支付
                  </order-button>
                  <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: item}"
                                v-if="(item.type === '2' || item.type === '3' || item.type === '6')&&(item.method === '0'||item.method === '1')&&(item.orderType !== '4'&&item.orderType !== '5')">
                    物流跟踪
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: item}"
                                v-if="item.type === '3'">
                    立即评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: item}"
                                v-if="item.isReviewed === '1'">
                    查看评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: confirmate, item: item}"
                                v-if="item.type === '2'">
                    确认收货
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: buyAngin, item: item}"
                                v-if="item.type === '7' || item.type === '8' || item.type === '10' || item.type === '12'">
                    重新购买
                  </order-button>
                </div>
              </div>
            </router-link>
          </load-more>
        </div>
        <div v-if="activeTab === 'tab3'">
          <empty v-if="queryData.length === 0" message="暂时没有订单">

          </empty>
          <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
            <router-link :to="{name: 'orderDetail', params: {orderId: item.id}}" class="one-order"
                         v-for="(item,index) in queryData" :key="index">
              <order-title :value="orderType[item.type]" :label="'订单编号:' + item.sn"></order-title>
              <panel v-for="(product,index) in item.orderItems" :key="index" :value="product.product">
                <div slot="desc" class='desc'>
                  {{product.desc}}
                </div>
                <!--<price slot="price" :value="product.price"></price>-->
                <price slot="price"
                       :value="product.product.categoryType === '0' ? product.product.price : product.amount"></price>
                <span slot="number" class="number">X{{product.quantity}}</span>
              </panel>
              <div layout="column">
                <div layout="row" layout-align="flex-end center" class="order-sum text-right" flex>
                  <h4 flex>
                    合计: <span>¥{{item.amount || '0'}}</span>
                    共{{item.count || '0'}}件 <span>(含运费: ¥{{item.freight}})</span>
                  </h4>
                </div>
                <mu-divider shallowInset/>
                <div class="text-right" flex>
                  <order-button color="#8C8C8C" border="#8C8C8C"
                                v-if="(item.type === '1'||item.type === '11')||((item.method === '1'||item.method === '2')&&item.type === '5')"
                                v-tap="{methods: submitCancalOrder, item: item}">
                    取消订单
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payMoment, item: item}"
                                v-if="item.type === '1'&&item.method === '0'">
                    立即支付
                  </order-button>
                  <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: item}"
                                v-if="(item.type === '2' || item.type === '3' || item.type === '6')&&(item.method === '0'||item.method === '1')&&(item.orderType !== '4'&&item.orderType !== '5')">
                    物流跟踪
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: item}"
                                v-if="item.type === '3'">
                    立即评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: item}"
                                v-if="item.isReviewed === '1'">
                    查看评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: confirmate, item: item}"
                                v-if="item.type === '2'">
                    确认收货
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: buyAngin, item: item}"
                                v-if="item.type === '7' || item.type === '8' || item.type === '10' || item.type === '12'">
                    重新购买
                  </order-button>
                </div>
              </div>
            </router-link>
          </load-more>
        </div>
        <div v-if="activeTab === 'tab4'">
          <empty v-if="queryData.length === 0" message="暂时没有订单">

          </empty>
          <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
            <router-link :to="{name: 'orderDetail', params: {orderId: item.id}}" class="one-order"
                         v-for="(item,index) in queryData" :key="index">
              <order-title :value="orderType[item.type]" :label="'订单编号:' + item.sn"></order-title>
              <panel v-for="(product,index) in item.orderItems" :key="index" :value="product.product">
                <div slot="desc" class='desc'>
                  {{product.desc}}
                </div>
                <!--<price slot="price" :value="product.price"></price>-->
                <price slot="price"
                       :value="product.product.categoryType === '0' ? product.product.subscription : product.amount"></price>
                <span slot="number" class="number">X{{product.quantity}}</span>
              </panel>
              <div layout="column">
                <div layout="row" layout-align="flex-end center" class="order-sum text-right" flex>
                  <h4 flex>
                    合计: <span>¥{{item.amount || '0'}}</span>
                    共{{item.count || '0'}}件 <span>(含运费: ¥{{item.freight}})</span>
                  </h4>
                </div>
                <mu-divider shallowInset/>
                <div class="text-right" flex>
                  <order-button color="#8C8C8C" border="#8C8C8C"
                                v-if="(item.type === '1'||item.type === '11')||((item.method === '1'||item.method === '2')&&item.type === '5')"
                                v-tap="{methods: submitCancalOrder, item: item}">
                    取消订单
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payMoment, item: item}"
                                v-if="item.type === '1'&&item.method === '0'">
                    立即支付
                  </order-button>
                  <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: item}"
                                v-if="(item.type === '2' || item.type === '3' || item.type === '6')&&(item.method === '0'||item.method === '1')&&(item.orderType !== '4'&&item.orderType !== '5')">
                    物流跟踪
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: item}"
                                v-if="item.type === '3'">
                    立即评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: item}"
                                v-if="item.isReviewed === '1'">
                    查看评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: confirmate, item: item}"
                                v-if="item.type === '2'">
                    确认收货
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: buyAngin, item: item}"
                                v-if="item.type === '7' || item.type === '8' || item.type === '10' || item.type === '12'">
                    重新购买
                  </order-button>
                </div>
              </div>
            </router-link>
          </load-more>
        </div>
        <div v-if="activeTab === 'tab5'">
          <empty v-if="queryData.length === 0" message="暂时没有订单">

          </empty>
          <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
            <router-link :to="{name: 'orderDetail', params: {orderId: item.id}}" class="one-order"
                         v-for="(item,index) in queryData" :key="index">
              <order-title :value="orderType[item.type]" :label="'订单编号:' + item.sn"></order-title>
              <panel v-for="(product,index) in item.orderItems" :key="index" :value="product.product">
                <div slot="desc" class='desc'>
                  {{product.desc}}
                </div>
                <!--<price slot="price" :value="product.price"></price>-->
                <price slot="price"
                       :value="product.product.categoryType === '0' ? product.product.subscription : product.amount"></price>
                <span slot="number" class="number">X{{product.quantity}}</span>
              </panel>
              <div layout="column">
                <div layout="row" layout-align="flex-end center" class="order-sum text-right" flex>
                  <h4 flex>
                    合计: <span>¥{{item.amount || '0'}}</span>
                    共{{item.count || '0'}}件 <span>(含运费: ¥{{item.freight}})</span>
                  </h4>
                </div>
                <mu-divider shallowInset/>
                <div class="text-right" flex>
                  <order-button color="#8C8C8C" border="#8C8C8C"
                                v-if="(item.type === '1'||item.type === '11')||((item.method === '1'||item.method === '2')&&item.type === '5')"
                                v-tap="{methods: submitCancalOrder, item: item}">
                    取消订单
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payMoment, item: item}"
                                v-if="item.type === '1'&&item.method === '0'">
                    立即支付
                  </order-button>
                  <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: item}"
                                v-if="(item.type === '2' || item.type === '3' || item.type === '6')&&(item.method === '0'||item.method === '1')&&(item.orderType !== '4'&&item.orderType !== '5')">
                    物流跟踪
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: item}"
                                v-if="item.type === '3'">
                    立即评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: item}"
                                v-if="item.isReviewed === '1'">
                    查看评价
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: confirmate, item: item}"
                                v-if="item.type === '2'">
                    确认收货
                  </order-button>
                  <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: buyAngin, item: item}"
                                v-if="item.type === '7' || item.type === '8' || item.type === '10' || item.type === '12'">
                    重新购买
                  </order-button>
                </div>
              </div>
            </router-link>
          </load-more>
        </div>
      </div>
    </scroll>

    <cancel-order :isShow="cancelOrderIfShow" @submitCancalOrder="submitCancalOrder"></cancel-order>
    <!--<pay-order :isShow="paymentObj.payOrderIfShow" :value="paymentObj.value" @closePayOrder="payMoment"></pay-order>-->
    <mu-bottom-sheet :open="paymentObj.payOrderIfShow" @close="close">
      <mu-list @itemClick="close">
        <mu-sub-header class="text-center">
          支付详情
        </mu-sub-header>
        <payment :value="paymentObj.value" :selectedPaymentMethodId="paymentObj.value.paymentMethodId"
                 :orderId="paymentObj.value.orderId" :callback="payMoment" v-if="paymentObj.value"
                 :sum="paymentObj.value.amount" type="buy"></payment>
      </mu-list>
    </mu-bottom-sheet>
  </div>
  <!--</div>-->
</template>

<script>
	import Vue from 'vue'
  import panel from 'components/panel'
  import orderTitle from 'components/order-tittle'
  import orderButton from 'components/order-button'
  import icarHeader from 'components/my-header'
  import orderHeader from 'components/order-header'
  import price from 'components/price'
  import cancelOrder from 'components/cancelOrder'
  import payOrder from 'components/pay-Order'
  import model from 'components/model'
  import left from 'assets/left-gray.svg'

  // import nativeBridge from 'lm-na-bridge'
  import Loadmore from 'components/loadmore'
  import defaultEmpty from 'assets/default_empty_icon.png'
  import payment from '../payment/p_payment.vue'
  import empty from 'components/empty-page.vue'
  import isModel from 'components/model/model.vue'
  import password from 'components/password/password.vue'
  import scroll from 'components/scroll'
  // import { Indicator } from 'mint-ui'

  //返回路由
  // let orderType = ['全部', '代付款', ]

  let query = {
    index: 0,
    count: 3
  }
  let cacheOrder
  let isLoading
  function getOrder (vm, status, type, search) {
    // 如果切换标签后 就将页数变为 0
    if (isLoading) {
      return
    }
    isLoading = true
    if (!type) {
      query.index = 0
      vm.allLoaded = false
      vm.queryData = []
    }
    return Vue.prototype.$.get({
      methodName: 'ListOrder',
      index: query.index.toString(),
      count: query.count.toString(),
      type: status,
      searchValue: search
    }).then(resp => {
      let _scroll = vm.$refs.scroll
      isLoading = false
      query.index = query.index + query.count
      resp.data.orders.forEach(val => {
        let desc
        val.orderItems.length > 0 &&
        val.orderItems.forEach(order => {
          desc = ''
          if (!order.product) {
            order.product = {}
            order.product.specificationValues = []
          }
          let child = order.product.specificationValues
          child.length > 0 &&
          child.forEach(type => {
            desc = desc + type.specificationData.name + ':' + type.name + ' '
          })
          order.desc = desc
        })
      })
      if (resp.data.orders.length > 0) {
        vm.queryData = vm.queryData.concat(resp.data.orders)
        console.log(vm.queryData)
      }
      if (resp.data.orders.length < query.count) {
        vm.allLoaded = true
      }
      _scroll.customGetMaxDistance()
    })
  }
  export default {
    name: 'orderList',
    data () {
      return {
        isModelData: {
          isShow: false,
          data: ''
        },
        defaultEmpty,
        activeTab: '',
        left,
        isShow: false,
        queryData: [],
        allLoaded: false,
        // status: '待付款',
        chosed: {},
        cancelOrderIfShow: false,
        isShowReturn: false,
        paymentObj: {
          payOrderIfShow: false
        },
        searchValue: '',
        loading: false,
        isShowDelete: false,
        orderType: ['全部', '待付款', '已执行', '待评价', '退货/款', '待执行', '已完成', '已取消', '订单过期', '退款退货中', '退款退货完成', '待商家确认', '商家已确认']
      }
    },
    methods: {
      close () {
        this.paymentObj.payOrderIfShow = false
      },
      goBack (num1, num2, num3, num4, num5) {
        // this.$router.replace({
        //   name: 'orderManage'
        // })
        // history.length ? window.history.go(-1) : this.$.push('router_back')
        this.$.push({
          name: 'router_crossWebView',
          query: {
            project: 'vs',
            routeAndParams: '#my-pages'
          },
          params: {
            list: [
              num1, num2, num3, num4, num5
            ]
          }
        })
      },
      // 删除订单
//      deleteOrder(params)
//      {
//        if (!params) {
//          this.isShowDelete = false
//        }
//        if (params === 'true') {
//          let ids = []
//          ids.push(this.chosed.id)
//          Vue.prototype.$.get({
//            methodName: 'DeleteOrder',
//            ids: ids
//          }).then(resp => {
//            getOrder(this, Number(this.activeTab.split('tab')[1]) - 1)
//            this.isShowDelete = false
//          })
//        }
//        if (params && params.item) {
//          this.chosed = params.item
//          this.isShowDelete = true
//        }
//      }
//      ,
      // 取消订单
      submitCancalOrder(params)
      {
        if (!params) {
          this.cancelOrderIfShow = false
          return
        }
        if (params && params.item) {
          cacheOrder = params.item
          this.cancelOrderIfShow = !this.cancelOrderIfShow
        }
        if (params && !params.item) {
          if (params === 'default') {
            this.$.toast('请选择原因')
            return
          } else {
            Vue.prototype.$.get({
              methodName: 'UpdateOrder',
              type: '0',
              orderId: cacheOrder.id,
              content: params
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                getOrder(this, Number(this.activeTab.split('tab')[1]) - 1)
              }
            })
          }
          this.cancelOrderIfShow = false
        }
      }
      ,
      // tab 页切换
      handleTabChange(val)
      {
        this.activeTab = val
        this.$router.replace({
          name: 'orderlist',
          params: {
            status: val.split('tab')[1] - 1
          }
        })
      }
      ,
      // 下来刷新
      loadBottom()
      {
        getOrder(this, Number(this.activeTab.split('tab')[1]) - 1, 'loadmore')
      }
      ,
      // 获取订单状态
      getStatus(val)
      {
        let status
        if (val.paymentStatus === 0) {
          status = '待付款'
          return status
        }
        if (val.paymentStatus === 1) {
          console.log(11)
        }
      }
      ,
      payByBalance()
      {
        this.isModelData.isShow = false
        let passwordModel = this.$refs.passwordModel
        let _close = passwordModel.close
        let vm = this
        let _name = _close.name
        if (_name !== 'customClose') {
          passwordModel.close = function customClose () {
            let args = arguments
            if (args && !args[0].confirm) {
              _close.bind(passwordModel)()
              return
            }
            if (vm.isModelData.data.length < 6) {
              this.$.toast('请输入合理密码')
              return
            }
            _close.bind(passwordModel)({confirm: true})
          }
        }
        passwordModel.show().then(() => {
          //  点击确定按钮
          if (this.isModelData.data.length < 6) {
            this.$.toast('请输入合理密码')
          }
          Vue.prototype.$.get({
            methodName: 'BalancePayment',
            password: this.isModelData.data,
            orderId: this.paymentObj.value.id
          }).then(resp => {
            // 支付成功跳到订单详情页面
            if (resp.data.resultCode === '100') {
              this.$router.replace({
                name: 'orderDetail',
                params: {
                  orderId: this.paymentObj.value.id
                }
              })
            }
            // 会员卡余额不足
            if (resp.data.resultCode === '376') {
              this.$.toast('余额不足')
            }
            // 支付密码未设定, 跳到设置密码页面
            if (resp.data.resultCode === '378') {
              this.$.toast('支付密码未设定')
              this.routeToBalanceSet()
            }
            // 支付密码错误, 弹出框, 可以重置密码
            if (resp.data.resultCode === '380') {
              this.isModelData.isShow = true
            }
          })
        }, () => {
          // 点击取消按钮
          this.$.toast('支付取消')
          // this.$router.replace({
          //   name: 'orderDetail',
          //   params: {
          //     orderId: this.paymentObj.value.id
          //   }
          // })
        })
      }
      ,
      // 跳到设置支付密码页面
      routeToBalanceSet()
      {
        this.$.push('router_setPayPassword', null, () => {
          console.log('页面成功跳转')
        })
      }
      ,
      setPassword()
      {
        // 跳转到重置/设置密码操作 需要原生提供接口
        this.routeToBalanceSet()
      }
      ,
      // 立即支付
      payMoment(params, payway)
      {
        if (!params) {
          this.paymentObj.payOrderIfShow = false
          return
        }
        // 立即支付
        if (params === 'true') {
          if (payway === '2') {
            this.paymentObj.payOrderIfShow = false
            this.payByBalance()
            return
          }
          this.$.push('router_pay', {
            orderId: this.paymentObj.value.id,
            payType: payway
          }, (res) => {
            this.paymentObj.payOrderIfShow = false
            if (res === '0') {
              this.$.toast('支付成功')
              getOrder(this, Number(this.activeTab.split('tab')[1]) - 1)
            }
            if (res === '1') {
              this.$.toast('支付失败')
            }
            if (res === '2') {
              this.$.toast('支付取消')
            }
          })
        }
        if (params && params.item) {
          this.paymentObj.payOrderIfShow = true
          this.paymentObj.value = params.item
//          this.paymentObj.value.paymentMethodId = params.item.paymentMethodName ? params.item.paymentMethodName === '支付宝支付' ? '0' : '1' : ''
          // bug 8318 和接口协调多传个orderId
          this.paymentObj.value.orderId = params.item.id
        }
      }
      ,
      // 物流跟踪
      logistics(params)
      {
          console.log(params.item.shippings[0].sn)
        console.log(params.item.expressSn)
        this.$router.push({
          name: 'l_logistics',
          params: {
            shippingSn: params.item.shippings[0].sn
          }
        })
      }
      ,
      // 评价
      evaluation(params)
      {
        this.$router.push({
          name: 'el_selfEvaluation',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      }
      ,
      // 查看评价
      evaluationView(params)
      {
        this.$router.push({
          name: 'el_selfEvaluation_view',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      }
      ,
      // 确认收货
      confirmate(params)
      {
        if (params && params.item) {
          this.chosed = params.item
          this.isShow = true
        }
        if (params === 'true') {
          Vue.prototype.$.get({
            methodName: 'UpdateOrder',
            orderId: this.chosed.id,
            type: '1'
          }).then(resp => {
            this.isShow = false
            if (resp.data.resultCode === '100') {
              this.$router.push({
                name: 'orderDetail',
                params: {
                  orderId: this.chosed.id
                }
              })
            } else {
              this.$.toast('订单已过期')
              let status = Number(this.activeTab.split('tab')[1]) - 1
              getOrder(this, status)
            }
          })
        }
        if (!params) {
          this.isShow = false
        }
      }
      ,
      // 退货填写物流信息的
      returnGoods(params)
      {
        this.$router.push({
          name: 'o_fillInTransport',
          query: {
            carItem: JSON.stringify(params.item)
          }
        })
      }
      ,
      // 申请退款
      returnMoney(params)
      {
        this.$router.push({
          name: 'o_return',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      }
      ,
      // 重新购买
      buyAngin(params)
      {
        let req = {
          methodName: 'AddCartItem',
          quantity: '1'
        }
        let promises = []
        params.item.orderItems && params.item.orderItems.forEach(val => {
          if (val.product.categoryType === '1') {
            // 如果不是整车
            req.productId = val.product.id
            promises.push(Vue.prototype.$.get(req))
          } else {
            // 如果是整车
            // delete val.product.specificationGroups
            // delete val.product.specificationValues
            val.product.quantity = '1'
            this.$router.push({
              name: 'o_orderConfirm',
              query: {
                cartItems: JSON.stringify(val.product)
              }
            })
            return
          }
        })
        promises.length > 0 && Promise.all(promises).then(() => {
          this.$router.push({
            name: 'asc_shoppingCart'
          })
        })
      }
      ,
      // 撤销申请
      cancelReturn(params)
      {
        if (params && params.item) {
          this.chosed = params.item
          this.isShowReturn = true
        }
        if (!params) {
          this.isShowReturn = false
        }
        if (params === 'true') {
          let req = {
            methodName: 'DeleteRefunds',
            orderId: this.chosed.id,
            orderItemIds: []
          }
          this.chosed.orderItems.forEach(val => {
            req.orderItemIds.push(val.id)
          })
          Vue.prototype.$.get(req).then(resp => {
            this.isShowReturn = false
            let status = Number(this.activeTab.split('tab')[1]) - 1
            getOrder(this, status)
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.activeTab = 'tab' + (Number(to.params.status) + 1)
        // vm.activeTab = vm.activeTab ? vm.activeTab : 'tab' + (Number(to.params.status) + 1)
        // let status = to.params.status.toString()
        // getOrder(vm, status)
      })
    },
    mounted () {
      let el = document.querySelector('#searchGood')
      el && el.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
          document.getElementById('searchGood').blur()
          getOrder(this, '0', '', this.searchValue)
        }
      })
      // let status = this.$route.params.status && this.$route.params.status.toString() || '0'
      // getOrder(this, status)
    },
    watch: {
      activeTab (val) {
        let status = (Number(val.split('tab')[1]) - 1).toString()
        getOrder(this, status)
      }
    },
    components: {
      empty,
      payment,
      panel,
      orderTitle,
      orderButton,
      icarHeader,
      orderHeader,
      price,
      loadMore: Loadmore,
      cancelOrder,
      payOrder,
      model,
      isModel,
      password,
      scroll
    }
  }
</script>

<style lang="scss">
  #order_list {
    .scroll-box {
      bottom: 0;
    }
    .orderList-body {
      margin-top: 67px;
    }
    .orderList-body.active {
      margin-top: 109px;
    }
    .number {
      font-size: 1rem;
    }

    .result_empty {
      height: 100%;
      text-align: center;
    }

    .result_empty img {
      width: 50%;
    }

    .result_empty p {
      /*float: right*/
      font-weight: bold;
    }

    .order-button {
      margin-right: 5px;
      padding: 2px 12px;
    }

    .orderList-header {
      width: 100%;
      background-color: #fff;
      position: fixed;
      z-index: 101;
    }
    .orderList-header.active {
      top: 91px;
    }
    .orderList-header > .mu-tabs {

      background: #fff;
    }
    .one-order {
      margin-bottom: 10px;
      background-color: #fff;
      display: block;
      height: auto;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    .text-right {
      margin-right: 10px;
    }

    .desc {
      margin-top: 5px;
      color: #B4B4B4;
    }

    .mu-tab-link {
      font-weight: bold;
      color: #414141;
    }

    .mu-tab-active {
      color: #F9981C;
    }

    .order-sum {
      height: 30px;
      line-height: 30px;
    }

    h4 {
      color: #898989;
      font-weight: normal;
    }
    /*.order-sum::after{

    }*/

    /*.order-sum h4{
      color: #666666;
      font-size: 1rem;
      font-weight: 200;
    }

    .order-sum {
      padding-right: 0;
    }

    .order-sum h4 span{
      color: #DF2F00;
      margin-left: 4px;
    }

    .order-sum p{
      color: #6B6B6B;
      font-size: 12px;
      margin-top: 5px;
    }

    .order-sum{
      width: 120px;
      padding: 5px;
    }*/

    .value, .number {
      font-size: 1.1rem;
    }

    .number {
      text-align: right;
      margin-right: 15px;
      color: #B4B4B4;
    }
  }

  #order_status_title {
    height: 30px;
    line-height: 30px;
    padding-top: 0 !important;
  }

  #order_list {
    /*position: relative;*/
  }

  #order_list .search {
    width: 100%;
    background-color: #C9C9CE;
    padding: 6px 10px;
    position: fixed;
    z-index: 100;
  }

  #order_list .search input {
    width: 100%;
    display: block;
    /*border-radius: 5px;*/
    height: 30px;
    line-height: 30px;
    outline: none;
    text-align: center;
    border: none;
    border-radius: 10px;
    background: url(../../assets/search.svg) no-repeat 15px;
    background-color: #fff;
  }
</style>
