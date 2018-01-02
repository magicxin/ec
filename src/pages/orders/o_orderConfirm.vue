
<template>
<!-- 我发誓 下周一定重新写这个页面 by Hoog 2017/12/27 -->
  <div class="confirm background-gray" id="confirm">
    <model :isShow="isShow" v-on:closeIsModel="openModel" title="请选择配送方式">
      <slideChose v-if="options" :value="options && options.shippingMethods" @chose="chose"></slideChose>
      <a v-tap="{methods: openModel}" flex slot="work">取消</a>
    </model>

    <model :isShow="isPaymentShow" v-on:closeIsModel="openPaymentModel" title="请选择支付方式">
      <slideChose v-show="options" :value="options && options.paymentMethods" @chose="chosePayment"></slideChose>
      <a v-tap="{methods: openPaymentModel}" flex slot="work">取消</a>
    </model>

    <icar-header main-text="订单确认" mainText="我的订单" textColor="#474747" bgColor="#F7F7F7">
      <img :src="left" alt="">
    </icar-header>
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
    <scroll :bottom="true" marginBottom="40">
      <location v-tap="{methods: fillinAddress}" :value="receive" v-if="receive"></location>
      <cells v-else>
        <cell v-tap="{methods: fillinAddress}">
          <h4 slot="label">请输入收货地址</h4>
        </cell>
      </cells>
      <div class="goods">
        <panel v-for="(item,index) in queryData.cartItems" :value="item.product" :key="index">
          <div slot="desc" class='desc'>
            {{item.desc}}
          </div>
          <div slot="desc" class='desc'>
            {{item.desc}}
          </div>
          <!--<price slot="price" :value="$route.query.activity ? activity.price :-->
          <!--(item.product.isSubscription === '1'&&!isFromShoppingCart) ? item.product.subscription : item.product.price"></price>-->
          <price slot="price" :value="$route.query.activity ? amount : item.product.price"></price>
          <div slot="number" class="number text-right">
            X{{item.quantity}}
          </div>
        </panel>
      </div>

      <div class="options">
        <cells>
          <cell :value="paymentMethodsForUse.name" v-tap="{methods: openPaymentModel}">
            <p slot="label" class="options-label">支付方式</p>
          </cell>
          <cell :value="shippingForUse.name" v-tap="{methods: openModel}"
                v-if="queryData.cartItems[0].product.categoryType !== '0' && isShowDelivery">
            <p slot="label" class="options-label">配送方式</p>
          </cell>
          <div class="preview">
            <preview v-if="isSubscription == 1">
              <preview-money :label="sectionOne.text" :money="sectionOne.money" :value="sectionOne.value"
                             :state="sectionOne.state"></preview-money>
              <preview-money :label="sectionTwo.text" :money="sumSub-sectionOne.money" :value="sectionTwo.value"
                             :state="sectionTwo.state"></preview-money>
            </preview>
          </div>
          
          <cell
            :value="(couponForUse && couponForUse.name) || ((options && options.couponGroups && options.couponGroups.length === 0) && '暂无可用') || '请选择优惠券'"
            v-if="!activity.id" v-tap="{methods: goCoupon}">
            <p slot="label" class="options-label">优惠券</p>
            <img :src="closePng" slot="value" height="20" class="cancel" v-tap="{methods: cancelUseCoupon}"
                 v-if="couponForUse && couponForUse.name">
          </cell>
          <cell
            :value="couponData.name || ''"
            v-if="activity.id">
            <p slot="label" class="options-label">优惠券</p>
            <img :src="closePng" slot="value" height="20" class="cancel"
                 v-if="couponForUse && couponForUse.name">
          </cell>
          <cell :value="invoiceForUse && invoiceForUse.invoiceTitle" v-tap="{methods: goInvoice}" v-if="!activity.id">
            <p slot="label" class="options-label">发票信息</p>
            <img :src="closePng" slot="value" height="20" class="cancel" v-tap="{methods: cancelUseInvoice}"
                 v-if="invoiceForUse && invoiceForUse.id">
          </cell>
          <cell :link="false" v-if="options && options.bean > 0 && !activity.id">
            <p slot="label" class="options-label">{{VBean}}</p>
            <mu-checkbox slot="value" v-model="ifUseVBean" :nativeValue="VBean" class="checkbox"
                         uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
          </cell>
        </cells>
      </div>
      <div class="preview">
        <preview>
          <preview-item label="产品总额" 
                        :icon="true" 
                        :value="amountData.amount" 
                        color="#E13D13"></preview-item>
          <preview-item label="邮费" 
                        :icon="true" 
                        v-show="isShowDelivery" 
                        :value="amountData.freight"
                        :add="freight != '0' ? true : false"
                        v-if="amountData.freight>0"></preview-item>
          <preview-item label="优惠" 
                        :icon="true" 
                        v-if="amountData.discount>0"
                        :value="amountData.discount"
                        :minus="amountData.discount != '0' ? true : false"
                        ></preview-item>
          <preview-item label="V豆" 
                        :icon="true" 
                        :value="beanValue" 
                        :minus="beanValue != '0' ? true : false"
                        v-if="beanValue > 0 "></preview-item>
          <preview-item label="合计" 
                        :icon="true" 
                        :value="amountData.amountPaid" 
                        color="#E13D13"></preview-item>
        </preview>
      </div>
      <div style="height:100px;width:100%;">

      </div>
    </scroll>
    <foot class="_foot">
      <h4>实付款:<span>¥{{sum}}</span></h4>
      <a v-tap="{methods: open}" class="primary-button">提交订单</a>
    </foot>

    <mu-bottom-sheet :open="bottomSheet" v-if="paymentMethodsForUse.id&&paymentMethodsForUse.method=='0'"
                     @close="close">
      <mu-list @itemClick="close">
        <mu-sub-header class="text-center">
          支付详情
        </mu-sub-header>
        <payment :value="queryData" 
                 :selectedPaymentMethodId="paymentMethodsForUse.id" 
                 :callback="createOrder"
                 :sum="sum" type="buy"></payment>
      </mu-list>
    </mu-bottom-sheet>
        <user-coupon :bottomSheet="couponBottomSheet" :isStatic="true" :couponPromotions="options&&options.couponGroups"
            @close="couponClose" v-if="options&&options.couponGroups"></user-coupon>
  </div>
</template>

<script>
  /* eslint-disable */
  import modelLayer from 'components/model-layer'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import panel from 'components/panel'
  import preview from 'components/preview'
  import previewItem from 'components/preview-item'
  import foot from 'components/foot'
  import icarHeader from 'components/my-header'
  import previewMoney from 'components/preview-money'
  import location from 'components/location.vue'
  import price from 'components/price'
  import model from 'components/model'
  import origin from 'assets/RMB-origin.svg'
  import left from 'assets/left-gray.svg'
  import alipay from 'assets/icon_alipay.png'
  import weixinpay from 'assets/icon_weixinpay.png'
  import payment from '../payment/p_payment.vue'
  import Order from 'tools/order.service.js'
  import slideChose from 'components/slide-chose.vue'
  import isModel from 'components/model/model.vue'
  import closePng from 'assets/close.png'
  import password from 'components/password/password.vue'
  import userCoupon from "../payment/p_userCoupon.vue"
  import vue from 'vue'

  import { Indicator } from 'mint-ui'
  import scroll from 'components/scroll'
  let cache
  let order = Order.getInstance()

  let cancelCoupon = false
  function getMostV (precent) {
    // 算出可以参与优惠的价格 总价-优惠卷*precent
    let sum = 100
    // 判断V豆 数量是否够
  }
  export default {
    name: 'orderConfirm',
    components: {
      cells,
      cell,
      panel,
      preview,
      foot,
      location,
      icarHeader,
      previewItem,
      price,
      payment,
      model,
      modelLayer,
      slideChose,
      isModel,
      password,
      scroll,
      previewMoney,
      userCoupon
    },  
    data () {
      return {
        isModelData: {
          isShow: false,
          data: ''
        },
        activity: {
          id: '',
          type: '',
          price: ''
        },
        ifUseVBean: '',
        alipay,
        weixinpay,
        origin,
        left,
        promptIsShow: false,
        queryData: {
          cartItems: [{
            product: {}
          }]
        },
        finish: false,
        bottomSheet: false,
        topPopup: false,
        receive: null,
        isShow: false,
        isPaymentShow: false,
        options: null,
        shippingMethods: {
          name: ''
        },
        paymentMethods: {
          name: ''
        },
        couponForUse: null,
        shippingForUse: {
          name: ''
        },
        paymentMethodsForUse: {
          name: ''
        },
        invoiceForUse: null,
        amount: '',
        orderType: '',
        closePng,
        isShowDelivery: true,
        isActivity: false,
        isFromShoppingCart: false,
        isSubscription:false,
        sectionOne: {
          money: 0,
          text: '阶段1：订金 ￥',
          value: '',
          state: true
        },
        sectionTwo: {
          money: 0,
          text: '阶段2：尾款 ￥',
          value: '',
          state: false
        },
        //判断是否支付订金
        isSubscription: '0',
        subscriptionAmount: '',
        // 使用V都数量
        userVBeanNum: null,
        isUserVBean: false,  //是否使用V豆
        allPriceByCar: 0,
        // 活动带来的优惠券
        couponData:{},
        activityAmount:0,
        couponBottomSheet:false,
        sum : 0,
        amountData:{},
        couponGroupsIndex:'',
        couponIdList:[]
      }
    },
    watch: {
      paymentMethodsForUse: {
        deep: true,
        immediate: true,
        handler: function (newValue, oldValue) {
          if (newValue) {
            if (newValue.method == '0' || newValue.method == '1') {
              this.isShowDelivery = true
              // alert(this.isShowDelivery)
            } else {
              this.isShowDelivery = false
            }
          }
        }
      },
      shippingForUse:{
        handler:function(newValue, oldValue){
          this.CalculateOrder()
        }
      },
      isUserVBean:{
        handler:function(newValue, oldValue){
          this.CalculateOrder()
        }
      },
      couponForUse:{
        handler:function(newValue, oldValue){
          this.CalculateOrder()
        }
      },
    },
    computed: {
      freight () {
        let _freight = Number(this.shippingForUse.firstPrice) || 0
        return Math.round(_freight).toString()
      },
      coupon () {
        let _coupon = this.couponForUse || {
            amount: '0',
            name: ''
          }
        return _coupon.amount
      },
     beanValue () {
        console.log('this.ifUseVBean: ' + this.ifUseVBean)
        if (this.ifUseVBean) {
          this.isUserVBean = true
          let bean = this.VBean
          let result = bean.split('¥')[1]
          return result
        }
        this.isUserVBean = false
        return 0
      },
      sectionSum(){
        try {
          console.log(this.sumSub())
          return this.sumSub() - this.subscriptionAmount
        } catch (e) {
          return '0'
        }
      },
     sumSub(){
        try {
          let _sum = Number(this.subscriptionAmount) + Number(this.isActivity ? this.activity.freight : this.freight) - Number(this.coupon) - this.beanValue
          return _sum.toFixed(2) >= 0 ? _sum.toFixed(2).toString() : '0'
        } catch (e) {
          return '0'
        }
      },
      // sum () {
      //      console.log('3333333333')
      //     // let _sum = this.CalculateOrder()
      //     return 
      //   // try{
      //   //  
      //   // } catch(e){
      //   //   return '0'
      //   // }
      //   // this.CalculateOrder()
      //   // if (this.isFromShoppingCart) {
      //   //   try {
      //   //     let __sum = Number(this.allPriceByCar) + Number(this.isActivity ? this.activity.freight : this.freight) - Number(this.coupon) - this.beanValue
      //   //     return __sum.toFixed(2) >= 0 ? __sum.toFixed(2).toString() : '0'
      //   //   } catch (e) {
      //   //     return this.allPriceByCar
      //   //   }
      //   // }
      //   // if (this.isSubscription == 1) {
      //   //   return this.sectionOne.money
      //   // }
      //   // if(this.isActivity){
      //   //   try {
      //   //     let _sum = Number(this.activity.price) + Number(this.freight)
      //   //     return _sum.toFixed(2) >= 0 ? _sum.toFixed(2).toString() : '0'
      //   //   } catch (e) {
      //   //     return '0'
      //   //   }
      //   // }
      //   // try {
      //   //   let _sum = Number(this.amount) + Number(this.freight) - Number(this.coupon) - this.beanValue
      //   //   return _sum.toFixed(2) >= 0 ? _sum.toFixed(2).toString() : '0'
      //   // } catch (e) {
      //   //   return '0'
      //   // }
      // },
      VBean () {
        let maxRate = this.options && this.options.maxOffsetBean
        // 自己有的V豆数量
        let bean = this.options && this.options.bean

        // V豆可以抵扣的比例
        let beanRate = this.options && this.options.beanRate

        if (Number(maxRate) <= Number(bean)) {
          this.userVBean = Number(maxRate)
          return '可使用' + maxRate + 'V豆抵¥' + this.mul(maxRate, beanRate)
        } else {
          this.userVBean = Number(bean)
          return '可使用' + bean + 'V豆抵¥' + this.mul(bean, beanRate)
        }
        
      }
    },
    methods: {
      //订单类型过滤器
//      orderTypeFilter () {
//        let _type
//        if (this.queryData.cartItems[0].id) {
//          _type = '0'
//        }
//        if  (this.queryData.cartItems[0].product.categoryType === '0') {
//          _type = '2'
//        }
//        return _type
//      },
      mul (a, b){
        let c = 0,
          d = a + '',
          e = b + '';
        try {
          c += d.split(".")[1].length;
        } catch (f) {}
        try {
          c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
      },
      // 取消使用优惠券
      cancelUseCoupon (event) {
        this.couponForUse = null
        cancelCoupon = true
        order.clearCoupon()
      },
      // 取消使用发票
      cancelUseInvoice () {
        this.invoiceForUse = null
        order.clearInvoice()
      },
      // 选择快递方式
      chose (params) {
        this.shippingMethods = params
        this.openModel('true')
      },
      // 选择支付方式
      chosePayment (params) {
        this.paymentMethods = params
        this.openPaymentModel('true')
      },
      setPassword () {
        // 跳转到重置/设置密码操作 需要原生提供接口
        this.routeToBalanceSet()
      },
      // 余额支付
      payByBalance () {
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
          this.$.get({
            methodName: 'BalancePayment',
            password: this.isModelData.data,
            orderId: cache.data.id
          }).then(resp => {
            // 支付成功跳到订单详情页面
            if (resp.data.resultCode === '100') {
              this.activityPay()
              this.$router.replace({
                name: 'orderDetail',
                params: {
                  orderId: cache.data.id
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
              setTimeout(function(){
                this.routeToBalanceSet()
              },500)
              
            }
            // 支付密码错误, 弹出框, 可以重置密码
            if (resp.data.resultCode === '380') {
              this.isModelData.isShow = true
            }
          })
        }, () => {
          // 点击取消按钮
          this.$router.replace({
            name: 'orderDetail',
            params: {
              orderId: cache.data.id
            }
          })
        })
      },
      routeToBalanceSet () {
        this.$.push('router_setPayPassword', null, () => {
          console.log('页面成功跳转')
        })
      },
      fillinAddress () {
        this.$router.push({
          name: 'o_transport',
          query: {
            address: JSON.stringify(this.options.receivers)
          }
        })
      },
      createOrder (params, payway) {
        if (!params) {
          this.bottomSheet = false
          return
        }
        if (payway === '2') {
          // 选择密码支付
          this.bottomSheet = false
          this.payByBalance()
          return
        }
        this.$.push('router_pay', {
          orderId: cache.data.id,
          payType: payway
        }, (response) => {
          this.bottomSheet = false
          if (response === '0') {
            this.activityPay()
            this.$router.replace({
              name: 'orderDetail',
              params: {
                orderId: cache.data.id
              }
            })
          }
          if (response === '1') {
            this.$.toast('支付失败')
          }
          if (response === '2') {
            this.$.toast('支付取消')

          }
          if (response === '3') {
            this.$.toast('请先安装微信')
          }
          this.$router.replace({
            name: 'orderDetail',
            params: {
              orderId: cache.data.id
            }
          })
        })
      },
      close () {
        this.bottomSheet = false
      },
      activityPay() {
        if (this.activity.id) {
          this.$router.push({
            name: 'payResult',
            query: {
              type: this.activity.type,
              id: this.activity.id
            }
          })
        }
      },
      open () {
        let _couponForUse = order.useCouponNew() || {}
        if (this.finish) {
          if (this.paymentMethodsForUse.method == '0') {
            this.bottomSheet = true
          } else {
            this.$router.replace({
              name: 'orderDetail',
              params: {
                orderId: cache.data.id
              }
            })
          }
          return
        }
        if (!this.paymentMethodsForUse.id) {
          this.$.toast('请选择支付方式')
          return
        } else if ((this.paymentMethodsForUse.method === '0' || this.paymentMethodsForUse.method === '1') && this.queryData.cartItems[0].product.categoryType === '1' && !this.shippingForUse.id) {
          this.$.toast('请选择配送方式')
          return
        } else if (!this.receive || !this.receive.id) {
          this.$.toast('请填写收货地址')
          return
        }
        let vm = this

        function getCouponId (id) {
          let cacheId
          vm.options.couponGroups.some(val => {
            if (val.coupon.id === id) {
              cacheId = val.id
            }
          })
          return cacheId
        }

        function data2Use () {
          let dataForUse = {
            cartItems: []
          }
          vm.queryData.cartItems.forEach(val => {
            dataForUse.cartItems.push({
              amount: val.amount,
              id: val.id,
              cartId: val.cartId,
              quantity: val.quantity,
              product: {
                id: val.product.id,
//                price: vm.activity.id ? vm.activity.price : val.product.price
//                price: val.product.isSubscription === '0' ? val.amount : val.product.subscription,
                price: vm.$route.query.activity ? vm.activity.price : (val.product.isSubscription === '1'&&!vm.isFromShoppingCart) ? val.product.subscription : val.product.price
              }
            })
          })
          return dataForUse
        }

        let _dataForUse = data2Use()
        Object.assign(_dataForUse, {
          invoiceId: this.invoiceForUse && this.invoiceForUse.id,
          amount: this.amount,
          bean: this.isUserVBean ? this.userVBean : 0,
          freight: this.freight,
          amountPaid: this.sum,
          receiverId: this.receive.id,
          shippingMethodId: this.shippingForUse.id,
          paymentMethodId: this.paymentMethodsForUse.id,
          couponIds: _couponForUse && this.couponIdList[_couponForUse.index],
          methodName: 'CreateOrder',
          orderType: this.orderType,
          isSubscription: this.isSubscription
        })
        // console.log(this.$route.query.activity)
        if (this.$route.query.activity) {
          if(!this.couponData.id){
            this.$.toast('活动商品不可重复购买')
            return
          }
          _dataForUse.couponIds = [this.couponData.id]
        };
        this.$.get(_dataForUse).then(resp => {
          if (resp.data.resultCode === '100') {
            order.clear()
            cache = resp
            if (this.paymentMethodsForUse.method == '0') {
              this.bottomSheet = true
              this.finish = true
            } else {
              this.$router.replace({
                name: 'orderDetail',
                params: {
                  orderId: cache.data.id
                }
              })
            }
          }else{
            vm.$.toast(resp.data.errorMessage)
          }
        })
      },
      // 计算订单金额
      CalculateOrder(){
        let _couponForUse = order.useCouponNew() || {}
        let vm = this
        function getCouponId (id) {
          let cacheId
          vm.options.couponGroups.some(val => {
            if (val.coupon.id === id) {
              cacheId = val.id
            }
          })
          return cacheId
        }

        function data2Use () {
          let dataForUse = {
            cartItems: []
          }
          vm.queryData.cartItems.forEach(val => {
            dataForUse.cartItems.push({
              amount: val.amount,
              id: val.id,
              cartId: val.cartId,
              quantity: val.quantity,
              product: {
                id: val.product.id,
//                price: vm.activity.id ? vm.activity.price : val.product.price
//                price: val.product.isSubscription === '0' ? val.amount : val.product.subscription,
                price: vm.$route.query.activity ? vm.activity.price : (val.product.isSubscription === '1'&&!vm.isFromShoppingCart) ? val.product.subscription : val.product.price
              }
            })
          })
          return dataForUse
        }
        let _dataForUse = data2Use()
        Object.assign(_dataForUse, {
          invoiceId: this.invoiceForUse && this.invoiceForUse.id,
          amount: this.amount,
          bean: this.isUserVBean ? this.userVBean : 0,
          receiverId: this.receive.id,
          shippingMethodId: this.shippingForUse.id,
          paymentMethodId: this.paymentMethodsForUse.id,
          couponIds:this.isActivity?[this.couponData.id] : this.couponForUse && this.couponIdList[_couponForUse.index],
          methodName: 'CalculateOrder',
          orderType: this.orderType,
          isSubscription: this.isSubscription,
          loading:'false'
        })
        
        this.$.get(_dataForUse).then(resp => {
          if (resp.data.resultCode === '100') {
            vm.sum = resp.data.amountPaid
            vm.amountData = resp.data
          }else{
            vm.$.toast(resp.data.errorMessage)
          }
        })
      },
      openPopup () {
        this.topPopup = true
      },
      openModel (value) {
        this.isShow = !this.isShow
        if (value === 'true') {
          order.useShipping(this.shippingMethods)
          this.shippingForUse = this.shippingMethods
        } else {
          this.shippingMethods = {
            name: ''
          }
        }
      },
      openPaymentModel (value) {
        console.log(value)
        this.isPaymentShow = !this.isPaymentShow
        if (value === 'true') {
          order.usePaymentMethods(this.paymentMethods)
          this.paymentMethodsForUse = this.paymentMethods
        } else {
          this.paymentMethods = {
            name: ''
          }
        }
      },
      goCoupon () {
        if (this.options.couponGroups.length === 0) {
          return
        }
        if(this.couponForUse !== null){
          return
        }
        if(!!this.activity.id){
          return
        }
        console.log('333333333333')
        // console.log(this.options.couponGroups)
        this.couponBottomSheet = true
        // let couponList = JSON.stringify(this.options.couponGroups)
        // this.$router.push({
        //   name: 'o_coupon',
        //   query: {
        //     couponList,
        //     price: this.amount
        //   }
        // })
      },
      couponClose(index,name){
          console.log(name)
        if(name != null){
          console.log('3333333')
          this.couponForUse = {}
          this.couponForUse['name'] = name
          this.couponGroupsIndex = index
        }
        this.couponBottomSheet = false
      },
      // 是否需要发票
      goInvoice () {
        this.$router.push({
          name: 'o_invoiceList',
          query: {
            isChose: 'true'
          }
        })
      },
      getOrder(){
        let _cache = JSON.parse(this.$route.query.cartItems)
        let activity = this.$route.query.activity && JSON.parse(this.$route.query.activity) || {}
        let isActivity = this.$route.query.activity ? true : false
        let couponData = this.$route.query.couponData && JSON.parse(this.$route.query.couponData) || {}
        let cartItems
        let categoryType = ""
        let isSubscription = _cache.isSubscription
        if (!Array.isArray(_cache)) {
          cartItems = [{
            amount: _cache.price,
            product: _cache,
            quantity: _cache.quantity
          }]
          categoryType = _cache.categoryType;
        } else {
          cartItems = _cache
          categoryType = cartItems[0].product.categoryType
        }
        let orderType = '';
        // 商品类别  0:整车;1:车品 2:服务
        if (categoryType === '0') {
          // 整车预定
          orderType = '2'
        } else if (categoryType === '1') {
          // 购物消费（车品类商品）
          orderType = '0'
        } else if (categoryType === '2') {
          // TODO 3预约维修 4预约保养
          orderType = '3'
        }
        let couponForUse = order.useCouponNew() || null
        console.log('couponForUse: ',couponForUse)
        let invoiceForUse = order.useInvoice()
        let cartItemsPara = [];
        cartItems.map((item) => {
          let cartItemPara = {};
          cartItemPara.amount = item.amount
          cartItemPara.quantity = item.quantity
          let productPara = {}
          productPara.id = item.product.id
          productPara.price = item.product.price
          cartItemPara.product = productPara
          cartItemsPara.push(cartItemPara)
        });
        let vm = this
         vue.prototype.$.get({
          cartItems: cartItemsPara,
          methodName: 'FillInOrder',
          shopId: (() => {
            if (_cache instanceof Array) {
              return _cache[0].product.shopId
            } else {
              return _cache.shopId
            }
          })()
        }).then(resp =>{
          if (vm.isFromShoppingCart) {
            let _allPrice = 0
            _cache.forEach((value) => {
              _allPrice += value.quantity * value.product.price
            })
            vm.allPriceByCar = _allPrice
            vm.amount = _allPrice
          }
          vm.isSubscription = isSubscription
          vm.couponData = couponData
          vm.finish = false
          vm.couponForUse = couponForUse
          // vm.shippingForUse = shippingForUse
          vm.invoiceForUse = invoiceForUse && invoiceForUse
          vm.isActivity = isActivity
          
          let price = 0
          cartItems.forEach(val => {
            // 判断是否是活动商品
            // 算出订单价格
            // 判断是否是整车
            if (activity.currentPrice) {
              price += Number(val.quantity) * activity.currentPrice
              console.log(price)
              return
            }
            // 从购物车进入的不走显示定金
            if (val.product.isSubscription === '1' && !vm.isFromShoppingCart) {
              vm.sectionOne.money = Number(val.quantity) * val.product.subscription
//              vm.sectionOne.text += vm.sectionOne.money
              price = price + Number(val.quantity) * Number(val.product.subscription)
//              vm.sectionTwo.text += val.product.price - val.product.subscription
              vm.sectionTwo.money = val.product.price - val.product.subscription
              vm.subscriptionAmount = val.product.price
//              console.log(vm.amount)
            } else {
              // 不是整车的情况
              if (val.id) {
                price = price + Number(val.amount)
              } else {
                price = price + Number(val.quantity) * Number(val.amount)
              }
            }
            delete val.product.notice
          })
          // 算出订单价格 这样就不用计算属性在算一次了
          // 这里要根据是不是活动来决定商品的价格
          vm.amount = price
          vm.queryData.cartItems = cartItems
          vm.orderType = orderType
          vm.shippingForUse = order.useShipping() || {}
          vm.paymentMethodsForUse = order.usePaymentMethods() || {}
          vm.options = resp.data

          if (order.useTransport()) {
            vm.receive = order.useTransport()
          }
          if (!order.useTransport() && Array.isArray(vm.options.receivers)) {
            vm.options.receivers.forEach(val => {
              if (val.isDefault === '1') {
                vm.receive = val
              }
            })
          }
          if (activity.currentPrice) {
            vm.amount = vm.queryData.cartItems[0].product.price
            vm.activity.type = activity.type
            vm.activity.id = activity.activityId
            vm.activity.price = activity.currentPrice
            vm.activity.freight = activity.freight || '0'
            return
          }
          // 判断订单的总价与优惠券的价格做对比, 满足条件的话添加到优惠券列表里面
          let couponGroups = [],
             _couponIdList = []
          vm.options.couponGroups.forEach(val => {
              couponGroups.push(val)
              let id = []
              val.couponList.forEach(item =>{
                id.push(item.id)
              })
              _couponIdList.push(id)
          })
          vm.options.couponGroups = couponGroups
          vm.couponIdList = _couponIdList
        })
      }
    },
    created(){
      this.getOrder()
    },
    beforeRouteEnter (to, from, next) {
      // 判断是不是从购物车进的
      let isFromShoppingCart = false
      if(from.name === 'asc_shoppingCart') {
        isFromShoppingCart = true
      }
      next(vm => {
        vm.isFromShoppingCart = isFromShoppingCart
      })
    }
  }
</script>

<style>

  #confirm .options-label {
    font-size: 1.2rem;
    color: #343434;
  }

  #confirm .preview {
    margin-top: 7px;
    background-color: #fff;
  }

  #confirm .mu-checkbox-icon-uncheck {
    color: #939393;
  }

  #confirm .options {
    background-color: #fff;
  }

  .transport {
    width: 80%;
    top: 50%;
  }

  .transport .mu-radio {
    top: 4px;
  }

  #confirm .goods {
    margin-top: 7px;
    margin-bottom: 7px;
  }

  #confirm .desc {
    color: #B0B0B0;
    margin-top: 5px;
  }

  #confirm #cell {
    height: 40px;
    line-height: 40px;
    min-height: 40px;
  }

  #confirm #cell .link {
    color: #8D8D8D !important;
  }

  #confirm .text-right {
    margin-right: 20px;
    color: #A2A2A2;
  }

  #confirm ._foot {
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    padding-left: 10px;
    padding-top: 1px;
  }

  #confirm ._foot span {
    color: #E24A25;
    font-size: 1.5rem;
  }

  #confirm .cancel {
    /*border: 1px solid #F3F3F3;*/
    font-size: 1rem;
    color: #4C4C4C;
    display: inline-block;
    vertical-align: middle;
  }

  #confirm .primary-button {
    height: 42px;
    line-height: 42px;
    float: right;
    margin-right: 2px;
    background-color: #F98700;
    height: 32px;
    line-height: 32px;
    margin-top: 6px;
    margin-bottom: 6px;
    margin-right: 1%;
    font-size: 14px;
  }

  #confirm ._foot h4 {
    display: inline-block;
    font-weight: normal;
    margin-bottom: 4px;
  }

  #confirm #cell h4 {
    text-align: left;
    font-weight: normal;
  }

  #confirm #cell label {
    margin-top: 15px;

  }

  #confirm .panorama_fish_eye {
    color: #937F7B;
  }

  #confirm .check_circle {
    color: #F98700;
  }

</style>
