<template>
  <div id="recharge">
    <icar-header main-text="充值" bgColor="#F7F7F7" textColor="#242424" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods: goBack}">
    </icar-header>
    <!-- <is-input label="金额" placeholder="请输入金额" type="number" :recharge="true"  v-model="queryData.amount">

    </is-input> -->
    <!-- input 最多支持两位小数 -->
    <custom-input title="金额" v-model="queryData.amount" placeholder="请输入金额" :inputReg="rechargeRegExp"></custom-input>
    <div layout="row" layout-align="center center">
      <mu-flat-button label="充值" class="demo-flat-button"  backgroundColor="orange" v-tap="{methods: recharge}" color="#FFF"/>
    </div>
    <mu-bottom-sheet :open="bottomSheet" @close="close">
      <mu-list @itemClick="close">
        <mu-sub-header class="text-center">
          支付详情
        </mu-sub-header>
        <payment :value="dataForReq" 
                 :callback="callNativePay" 
                 :orderId="dataForReq.orderId"
                 :sum="queryData.amount + ''"></payment>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>
<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import isInput from 'components/is-input'
  import customInput from 'components/input/input'


  import payment from '../payment/p_payment.vue'

  // import { Indicator } from 'mint-ui'

  let cache = {}
  export default {
    name: 'recharge',
    components: {
      isInput,
      icarHeader,
      payment,
      customInput
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      close () {
        this.bottomSheet = false
      },
      callNativePay (params) {
        if (!params) {
          this.bottomSheet = false
          return
        }
        cache.payway = this.dataForReq.paymentMethodId
        console.log(this.dataForReq.orderId, this.dataForReq.paymentMethodId)
        // Indicator.close()
        this.$.push('router_pay', {
          orderId: this.dataForReq.orderId,
          payType: this.dataForReq.paymentMethodId
        }, (response) => {
          // let _res = JSON.parse(response)
          this.bottomSheet = false
          if (response === '0') {
            this.$.toast('充值成功') 
          }
          if (response !== '0') {
            this.$.toast('充值失败')
          }
        })
      },
      recharge () {
        if (!this.queryData.amount) {
          this.$.toast('请输入金额')
          return
        }
        if (this.queryData.amount > 10000) {
          this.$.toast('支付金额超限')
          return
        }
        if (this.queryData.amount <= 0) {
          this.$.toast('请输入合法金额')
          return
        }
        let els = document.querySelectorAll('input')
        this.$.handToblur(els)
        this.$.get({
          memberCardId: this.$route.query.id,
          orderType: '1',
          amount: this.queryData.amount,
          methodName: 'CreateOrder'
        }).then(resp => {
          console.log(resp)
          if (resp.data.resultCode === '100') {
            this.bottomSheet = true
            cache.orderId = this.dataForReq.orderId = resp.data.id
          }
        })
      }
    },
    data () {
      return {
        left,
        bottomSheet: false,
        queryData: {
          amount: ''
        },
        dataForReq: {},
        rechargeRegExp: new RegExp(/^\d*(?:\.\d{0,2})?$/)
      }
    },
    beforeRouteEnter: (to, from, next) => {
      if (cache.orderId) {
        Vue.prototype.$.get({
          methodName: 'QueryPaymentState',
          type: cache.payway,
          orderId: cache.orderId
        }).then(resp => {
          next(vm => {
            if (resp.data.resultStatus === '0') {
              vm.bottomSheet = false
            }
          })
        })
      } else {
        next()
      }
    }
  }
</script>
<style>
  #recharge .demo-flat-button{
    margin-top: 40px;
    width: 80%;
  }
</style>
