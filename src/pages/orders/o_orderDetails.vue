<template>
  <div class="background-gray" id="orderDeatil">
    <!--<icar-header bgColor="#F7F7F7" mainText="我的订单" textColor="#474747" :isBridge="isBridge">
      <img :src="left" alt="">
    </icar-header>-->
    <magic-header titleName="我的订单" :returnNative="native"></magic-header>

    <model :isShow="ifModelShow" title=" " @closeIsModel="makeSure">
      请确认是否已经收到货物
    </model>
    <model :isShow="ifCancelShow" title=" " @closeIsModel="cancelReturn">
      请确认是否取消申请!
    </model>
    <!--
        <model :isShow="ifDeleteShow" title=" " @closeIsModel="deleteOrder">
          请确认是否删除该订单!
        </model>
    -->
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
    <scroll>
      <location :value="queryData" v-if="queryData" :link="false"></location>

      <order-title :label="'订单编号:' + queryData.sn" v-if="queryData"></order-title>
      <div class="goods" v-for="item in queryData.orderItems" >
        <div class="order-trace" layout="row" layout-align="space-between center"
             v-tap="{methods: orderTrace, item: queryData}">
          <p>订单追踪</p>
          <p class="order-status text-right" flex="noshrink">{{orderType[queryData.type]}}</p>
          <i class="mu-icon material-icons">keyboard_arrow_right</i>
        </div>
        <panel :value="item.product">
          <div slot="desc" class='desc'>
            {{item.desc}}
          </div>
          <price slot="price" :value="item.price"></price>
          <div slot="number" class="number">
            <span>{{refuseType[item.refundsState]}}</span> X{{item.quantity}}
          </div>
        </panel>
        <mu-divider shallowInset/>
        <div class="text-right text-right-1" flex>
          <!--订单未完成-->
          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnMoney, item: item}"
                        v-if="!item.refundsState && (queryData.type === '5' || queryData.type === '2')">
            申请退款
          </order-button>
          <!--<order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnGood, item: item}" v-if="queryData.type === '2' && !item.refundsState">
            申请退货
          </order-button>-->
          <!--订单完成-->
          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnGood, item: item}"
                        v-if="!item.refundsState && (queryData.type === '3' || queryData.type === '6')">
            申请售后
          </order-button>


          <!--取消申请退款-->

          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: update, item: item}"
                        v-if="item.refundsState === '0' || item.refundsState === '2'">
            修改申请
          </order-button>
          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnGoodDetail, item: item}"
                        v-if="item.refundsState === '0' || item.refundsState === '2'">
            退款详情
          </order-button>
          <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: cancelReturn, item: item}"
                        v-if="item.refundsState === '0' || item.refundsState === '2' || item.refundsState === '3'">
            取消申请
          </order-button>
          <!--<order-button color="#888888" border="#BEBEBE" v-tap="{methods: fillInTransport, item: item}" v-if="item.refundsState === '2'">
            填写物流信息
          </order-button>-->
          <!--取消申请退货-->
          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnGood, item: item, update: true}"
                        v-if="item.refundsState === '3'">
            修改申请
          </order-button>

          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnGoodDetail, item: item}"
                        v-if="item.refundsState === '3'">
            退货详情
          </order-button>

          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: buyAngin, item: item}"
                        v-if="item.refundsState === '5'">
            重新购买
          </order-button>

          <order-button color="#888888" border="#BEBEBE" v-tap="{methods: returnMoney, item: item}"
                        v-if="item.refundsState === '1' || item.refundsState === '4' || item.refundsState === '6'">
            重新申请
          </order-button>

        </div>
      </div>
      <div class="preview" v-if="isSubscription == '1'">
        <preview>
          <preview-money :label="sectionOne.text" :money="sectionOne.money" :value="sectionOne.value"
                         :state="sectionOne.state"></preview-money>
          <preview-money :label="sectionTwo.text" :money="sectionTwo.money" :value="sectionTwo.value"
                         :state='sectionTwo.state'></preview-money>
        </preview>
      </div>
      <mu-divider v-if="isSubscription == '1'" shallowInset/>
      <div class="preview">
        <preview>
          <preview-item label="产品总额" :value="queryData.price" :icon="true"></preview-item>
          <preview-item label="邮费" :value="queryData.freight" :icon="true" :add="true"></preview-item>
          <preview-item label="优惠券" :value="queryData.couponDiscount || '0'" :icon="true" :minus="true"></preview-item>
          <preview-item label="V豆" :value="queryData.beanDiscount || '0'" :icon="true" :minus="true"
                        v-if="queryData.beanDiscount"></preview-item>
          <preview-item label="实付款" :value="queryData.amountPaid" :icon="true" color="#E76E53"
                        v-if="isSubscription !== '1'&&queryData.paymentStatus !== '0'"></preview-item>
          <preview-item label="需付款" :value="queryData.amount" :icon="true" color="#E76E53"
                        v-if="isSubscription !== '1'&&queryData.paymentStatus === '0'"></preview-item>
          <preview-item label="总计" :value="queryData.amount" :icon="true" color="#E76E53"
                        v-if="isSubscription === '1'"></preview-item>
        </preview>
      </div>
      <mu-divider shallowInset/>
      <div>
        <preview :left="true">
          <preview-item label="支付方式 : " :value="queryData.paymentMethodName"></preview-item>
          <preview-item v-if="(queryData.method === '0'||queryData.method === '1')&&queryData.shippingMethodName"
                        label="配送方式 : " :value="queryData.shippingMethodName"></preview-item>
          <preview-item label="下单时间 : " :value="queryData.orderTime"></preview-item>
          <preview-item label="付款时间 : " :value="queryData.paymentTime" v-if="queryData.paymentTime"></preview-item>
          <preview-item label="发货时间 : " :value="queryData.deliveryTime" v-if="queryData.deliveryTime"></preview-item>
        </preview>
      </div>
      <mu-divider shallowInset/>
      <businessInfo :value="queryData.shop?queryData.shop.mobile:''" :position="queryData.shop"
                    :shopId="queryData.shop?queryData.shop.id:''" class="detail">
        <span slot="name">{{ queryData.shop ? queryData.shop.name : '' }}</span>
        <span slot="address">{{ queryData.shop ? queryData.shop.address : '' }}</span>
      </businessInfo>
    </scroll>

    <!--<div class="online" layout="row">
      <a class="button" flex v-tap="{methods: customer}">在线客服</a>
    </div>-->

    <foot class="text-right">
      <!--
            <order-button color="#888888" border="#BEBEBE" v-tap="{methods: deleteOrder, item: queryData}" v-if="queryData.type === '3' || queryData.type === '6' || queryData.type === '7' || queryData.type === '8' || queryData.type === '10'">
              删除订单
            </order-button>
      -->
      <order-button color="#888888" border="#BEBEBE" v-tap="{methods: customer}"
                    v-if="queryData.type !== '7' && queryData.type !== '8'">
        客服咨询
      </order-button>
      <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluation, item: queryData}"
                    v-if="queryData.type === '3'">
        立即评价
      </order-button>
      <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: evaluationView, item: queryData}"
                    v-if="queryData.isReviewed === '1'">
        查看评价
      </order-button>
      <order-button color="#888888" border="#BEBEBE" v-tap="{methods: logistics, item: queryData}"
                    v-if="(queryData.type === '2' || queryData.type === '6')&&(queryData.method === '0'||queryData.method === '1')&&(queryData.orderType !== '4'&&queryData.orderType !== '5')">
        物流跟踪
      </order-button>
      <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: makeSure, item: queryData}"
                    v-if="queryData.type === '2'">
        确认收货
      </order-button>
      <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: payment, item: queryData}"
                    v-if="queryData.type === '1'&&queryData.method === '0'">
        立即支付
      </order-button>
      <order-button color="#FBAD59" border="#FBAD59" v-tap="{methods: submitCancalOrder, item: queryData}"
                    v-if="(queryData.type === '1'||queryData.type === '11')||((queryData.method === '1'||queryData.method === '2')&&queryData.type === '5')">
        取消订单
      </order-button>
      <!--<order-button color="#EAA525" border="#EAA525" v-tap="{methods: confirmate}">确认收货</order-button>-->
    </foot>

    <cancel-order :isShow="cancelOrderIfShow" @submitCancalOrder="submitCancalOrder"></cancel-order>
    <mu-bottom-sheet :open="bottomSheet" v-if="queryData.paymentMethodId&&queryData.method=='0'" @close="close">
      <mu-list @itemClick="close">
        <mu-sub-header class="text-center">
          支付详情
        </mu-sub-header>
        <payment :value="queryData" :selectedPaymentMethodId="queryData.paymentMethodId" :orderId="queryData.id"
                 :callback="createOrder" 
                 :sum="isSubscription === '1' ?queryData.paymentStatus ==='1'?(queryData.amount - sectionOne.money): sectionOne.money: queryData.amount"
                 type="buy"></payment>
      </mu-list>
    </mu-bottom-sheet>
  </div>

</template>

<script>
  import location from 'components/location.vue'
  import panel from 'components/panel'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import model from 'components/model'
  import preview from 'components/preview'
  import previewItem from 'components/preview-item'
  import previewMoney from 'components/preview-money'
  import orderTitle from 'components/order-tittle'
  import foot from 'components/foot'
  import price from 'components/price'
  import orderButton from 'components/order-button'
  import magicHeader from 'components/magicHeader'
  //import icarHeader from 'components/my-header.vue'
  import origin from 'assets/RMB-origin.svg'
  import left from 'assets/left-gray.svg'



  import password from 'components/password/password.vue'
  import payment from '../payment/p_payment.vue'
  import isModel from 'components/model/model.vue'

  import scroll from 'components/scroll'
  import businessInfo from 'components/detail_businessInfo'
  import cancelOrder from 'components/cancelOrder'
  import Vue from 'vue'
  let cacheOrder

  function getOrderData(id, vm) {
    vm.$.get({
      methodName: 'QueryOrderDetail',
      orderId: id
    }).then(resp => {
      let desc = ''
      if (resp.data) {
        vm.isSubscription = resp.data.order.isSubscription
        vm.sectionOne.money = resp.data.order.amountPrepay
        vm.sectionTwo.money = resp.data.order.amountFinalpay
        console.log('resp.data.order.paymentStatus: ' + resp.data.order.paymentStatus)
        if (resp.data.order.paymentStatus === '1') {
          vm.sectionOne.value = '已支付'
          vm.sectionTwo.state = true
          vm.sectionOne.state = false
        } else if (resp.data.order.paymentStatus === '2') {
          vm.sectionOne.value = '已支付'
          vm.sectionTwo.value = '已支付'
          vm.sectionTwo.state = false
          vm.sectionOne.state = false
        } else {
          vm.sectionOne.state = true
        }
        console.log(vm.sectionOne.money)
        resp.data.order.orderItems.forEach(val => {

          let child = []
          if (val.product && val.product.specificationValues) {
            child = val.product.specificationValues
              child.length > 0 &&
              child.forEach(type => {
               desc = desc + type.specificationData.name + ':' + type.name + ' '
             })
          }else if(val.name){
            desc=val.name;
          }
          val.desc = desc
        })
        vm.queryData = resp.data.order
        console.log(vm.queryData)
      }
    })
  }

  export default {
    name: 'orderDetail',
    data () {
      return {
      	native:false,
        origin,
        left,
        sectionOne: {
          money: 0,
          text: '阶段1：订金 ￥',
          value: '未支付',
          state: false
        },
        sectionTwo: {
          money: 0,
          text: '阶段2：尾款 ￥',
          value: '未支付',
          state: false
        },
        isSubscription: '0',
        native: false,
        origin,
        left,
        bottomSheet: false,
        queryData: {},
        receive: null,
        ifModelShow: false,
        chose: {},
        isModelData: {
          data: '',
          isShow: false
        },
        ifCancelShow: false,
        ifDeleteShow: false,
        cancelOrderIfShow: false,
        orderType: ['全部', '待付款', '已执行', '待评价', '退货/款', '待执行', '已完成', '已取消', '订单过期', '退款退货中', '退款退货完成', '待商家确认', '商家已确认'],
        refuseType: ['商家处理中', '商家已拒绝,请处理', '商家已同意,请退货', '商家处理中', '商家已拒绝, 请处理', '退款成功', '退款关闭']
      }
    },
    computed: {
      needToPay () {
      }
    },
    created(){
      this.native = this.$route.params.native
    },
    components: {
      scroll,
      isModel,
      location,
      panel,
      cells,
      cell,
      preview,
      foot,
      orderButton,
//    icarHeader,
      magicHeader,
      previewItem,
      orderTitle,
      price,
      model,
      password,
      payment,
      cancelOrder,
      businessInfo,
      previewMoney
    },
    methods: {
      setPassword () {
        // 跳转到重置/设置密码操作 需要原生提供接口
        this.routeToBalanceSet()
      },
      // 跳到设置支付密码页面
      routeToBalanceSet () {
        this.$.push('router_setPayPassword', null, () => {
          console.log('页面成功跳转')
        })
      },
      // 余额支付
      payByBalance () {
        this.isModelData.isShow = false
        let passwordModel = this.$refs.passwordModel
        let _close = passwordModel.close
        let vm = this
        let _name = _close.name
        if (_name !== 'customClose') {
          passwordModel.close = function customClose() {
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
            orderId: this.queryData.id
          }).then(resp => {
            // 支付成功跳到订单详情页面
            if (resp.data.resultCode === '100') {
              getOrderData(this.queryData.id, this)
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
          // this.$router.replace({
          //   name: 'orderDetail',
          //   params: {
          //     orderId: this.paymentObj.value.id
          //   }
          // })
          this.$.toast('取消支付')
        })
      },
      // 立即支付
      payment () {
        this.bottomSheet = true
      },
      close () {
        this.bottomSheet = false
      },
      // 支付订单
      createOrder (params) {
        if (!params) {
          this.bottomSheet = false
          return
        }
        if (this.queryData.paymentMethodId === '2') {
          this.bottomSheet = false
          this.payByBalance()
          return
        }
        this.$.push('router_pay', {
          orderId: this.queryData.id,
          payType: this.queryData.paymentMethodId
        }, (response) => {
          this.bottomSheet = false
          if (response === '0') {
            getOrderData(this.queryData.id, this)
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
        })
      },
      // 评价
      evaluation (params) {
        this.$router.push({
          name: 'el_selfEvaluation',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      evaluationView (params) {
        this.$router.push({
          name: 'el_selfEvaluation_view',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      orderTrace (params) {
        this.$router.push({
          name: 'o_trace',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      // 重新购买
      buyAngin (params) {
        let req = {
          methodName: 'AddCartItem',
          quantity: '1',
          productId: params.item.product.id
        }
        this.$.get(req).then(resp => {
          this.$router.push({
            name: 'asc_shoppingCart'
          })
        })
      },
      // 填写物流信息
      fillInTransport (params) {
        this.$router.push({
          name: 'o_fillInTransport',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      // 修改申请
      update (params) {
        params.item.update = true
        this.$router.push({
          name: 'o_return',
          query: {
            orderItem: JSON.stringify(params.item),
            amount: params.item.amount
          }
        })
      },
      // 退款
      returnMoney (params) {
        this.$router.push({
          name: 'o_return',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      // 删除订单
//      deleteOrder (params) {
//        console.log(params)
//        if (!params) {
//          this.ifDeleteShow = false
//        }
//        if (params && params.item) {
//          this.chose = params.item
//          this.ifDeleteShow = true
//        }
//        if (params === 'true') {
//          this.$.get({
//            methodName: 'DeleteOrder',
//            ids: [this.chose.id]
//          }).then(resp => {
//            if (resp.data.resultCode === '100') {
//              this.$router.go(-1)
//              // this.$router.replace({
//              //   name: 'orderlist',
//              //   params: {
//              //     status: '0'
//              //   }
//              // })
//            }
//          })
//        }
//      },
      // 取消订单
      submitCancalOrder (params) {
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
            this.$.get({
              methodName: 'UpdateOrder',
              type: '0',
              orderId: cacheOrder.id,
              content: params
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                this.$router.go(-1)
              }
            })
          }
          this.cancelOrderIfShow = false
        }
      },
      // 取消申请
      cancelReturn (params) {
        if (!params) {
          this.ifCancelShow = false
        }
        if (params && params.item) {
          this.chose = params.item
          this.ifCancelShow = true
        }
        if (params === 'true') {
          this.$.get({
            methodName: 'DeleteRefunds',
            id: this.chose.orderId,
            orderItemId: this.chose.id
          }).then(resp => {
            this.ifCancelShow = false
            if (resp.data.resultCode === '100') {
              let id = this.$route.params.orderId
              this.$.get({
                methodName: 'QueryOrderDetail',
                orderId: id
              }).then(resp => {
                let desc = ''
                resp.data.order.orderItems.forEach(val => {
                  let child = val.product.specificationValues
                  child.length > 0 &&
                  child.forEach(type => {
                    desc = desc + type.specificationData.name + ':' + type.name + ' '
                  })
                  val.desc = desc
                })
                this.queryData = resp.data.order
              })
            }
          })
        }
      },
      // 客服咨询
      customer () {
        this.$.push('router_callCustomerService', {
          customerServiceId: '1',
          clentId: this.$.userId
        }, () => {
          window.alert('进入在线客服页面')
        })
      },
      payMoment () {

      },
      // 退货详情
      returnGoodDetail (params) {
        this.$router.push({
          name: 'o_returnDetail',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      // 申请退货/ 修改退货
      returnGood (params) {
        // this.chose = params.item
        if (params.update) {
          params.item.update = true
        }
        this.$router.push({
          name: 'o_return',
          query: {
            orderItem: JSON.stringify(params.item)
          }
        })
      },
      makeSure (params) {
        this.$.get({
          methodName: 'UpdateOrder',
          orderId: params.item.id,
          type: '1'
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.$router.push({
              name: 'result',
              query: {
                carItem: JSON.stringify(params.item)
              }
            })
          } else {
            this.this.$.toast.isShow = true
            this.this.$.toast.content = '确认收货失败'
            setTimeout(() => {
              this.this.$.toast.isShow = false
            }, 2000)
          }
        })
      },
      logistics () {
        this.$router.push({
          name: 'l_logistics',
          params: {
            shippingSn: this.queryData.shippings[0].sn
          }
        })
      },
      confirmate () {
        this.$.get({
          methodName: 'UpdateOrder',
          orderId: this.queryData.id,
          type: '1'
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.ifModelShow = true
            // console.log(resp)
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      let id = to.params.orderId
      next(vm => {
        getOrderData(id, vm)
      })
      // this.$.get({
      //   methodName: 'QueryOrderDetail',
      //   orderId: id
      // }).then(resp => {
      //   next(vm => {
      //     let desc = ''
      //     resp.data.order.orderItems.forEach(val => {
      //       let child = val.product.specificationValues
      //       child.length > 0 &&
      //       child.forEach(type => {
      //         desc = desc + type.specificationData.name + ':' + type.name + ' '
      //       })
      //       val.desc = desc
      //     })
      //     vm.queryData = resp.data.order
      //   })
      // })
    }
  }
</script>

<style>
  #orderDeatil {
    /*height: 100%;*/
    /*overflow: auto;*/
  }

  #orderDeatil .goods {
    margin-top: 7px;
  }

  #orderDeatil .goods .order-trace {
    margin-left: 15px;
    font-weight: normal;
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  #orderDeatil .desc {
    color: #B0B0B0;
    margin-top: 5px;
  }

  #orderDeatil .number {
    text-align: right;
    margin-right: 20px;
    color: #B0B0B0;
  }

  #orderDeatil .online {
    margin-top: 12px;
    padding: 10px;
    margin-bottom: 50px;
  }

  #orderDeatil .button {
    background-color: #fff;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #89AFDF;
  }

  #orderDeatil .button a {
    color: #89AFDF;
  }

  #orderDeatil .order-button {
    margin-right: 2px;
  }

  #orderDeatil .text-right-1 {
    background-color: #fff;
    margin-bottom: 5px;
  }

  #orderDeatil .detail {
    margin-bottom: 60px;
  }

  #orderDeatil .order-status {
    /*width: 60px;*/
    color: #FA992E;
    font-size: 1.2em;
    /*margin-right: 10px;*/
  }

</style>
