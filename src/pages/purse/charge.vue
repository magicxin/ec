<template>
  <div id="charge">
    <is-header mainText="充值" bgColor="#F7F7F7" textColor="#474747">
      <img :src="left">
    </is-header>
    <is-text class="input" placeholder="请输入金额" :model="chargeData.req.amountPaid" v-model = "chargeData.req.amountPaid">

    </is-text>

    <mu-flat-button label="下一步" class="button" v-tap="{methods: charge}" backgroundColor="#F98700" color="#FFF"/>
    <pay-order :isShow="chargeData.showChagreOrNot" :value="chargeData.req" @closePayOrder="submitPay"></pay-order>
  </div>
</template>
<script>
  import isText from 'components/text-filed'

  import isHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import payOrder from 'components/pay-Order'

  export default {
    name: 'charge',
    data () {
      return {
        left,
        chargeData: {
          req: {},
          showChagreOrNot: false
        }
      }
    },
    methods: {
      charge () {
        if (this.chargeData.req.amountPaid) {
          this.chargeData.showChagreOrNot = true
        }
      },
      submitPay (params) {
        if (params === 'true') {
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
      isText,
      isHeader,
      payOrder
    }
  }
</script>
<style>
  #charge .input{
    margin-top: 5px;
  }

  #charge .button {
    width: 90%;
    margin-top: 40px;
    margin-left: 5%;
  }
</style>
