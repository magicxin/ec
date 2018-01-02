<template>
  <div id="pay_order">
    <mu-bottom-sheet :open="isShow" @close="payment">
        <mu-list @itemClick="payment">
          <mu-sub-header class="text-center">
            支付详情 
            <!--<mu-icon value="clear" v-tap="{methods: close}"></mu-icon>-->
          </mu-sub-header>
          <payment  :callback="payment" :value="value" :sum="value.amountPaid"></payment>
        </mu-list>
      </mu-bottom-sheet>
  </div>
</template>

<script>
  import payment from '../pages/payment/p_payment'

  export default {
    name: 'payOrderla',
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      },
      isShow: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    methods: {
      payment (params) {
        this.$emit('closePayOrder', params)
      },
      close () {
        this.$emit('closePayOrder')
      }
    },
    data () {
      return {
        queryData: {
        }
      }
    },
    components: {
      payment
    }
  }
</script>
<style>
  .clear{
    float: right;
    display: inline-block;
    margin-top: 10px;
    /*margin-right: 10px;*/
  }
</style>