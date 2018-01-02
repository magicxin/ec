<template>
  <div id="payment" class="background-gray">
    <div class="divide_no_bod"></div>

    <cells class="type" v-for="(item,index) in queryData.paymentTypes" :key="index" v-if="type ==='buy'">
      <cell :link="false">
        <h4 slot="label" :class="{'moneyIsEnough': item.type==='2' && disabled}">
          <div class="mork" v-if="item.type==='2' && disabled"></div>
          <img :src="addPath(item.icon)" alt="">
          {{item.name}}
          <span v-if="item.type==='2' && disabled" class="balance">(余额不足)</span>
        </h4>
        <mu-radio slot="value" :disabled="item.type==='2' && disabled" name="payway" v-model="payway"
                  :nativeValue="item.type" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
      </cell>
    </cells>
    <cells class="type" v-for="(item,index) in queryData.paymentTypes" :key="index" v-if="type !=='buy'">
      <cell :link="false" v-if="item.type !== '2'">
          <h4 slot="label">
            <img :src="alipay" alt="">
            {{item.name}}
          </h4>
          <mu-radio slot="value" name="payway" v-model="payway" :nativeValue="item.type" uncheckIcon="panorama_fish_eye"
                    checkedIcon="check_circle"/>
      </cell>
      <h4 class="noPayway" v-if="queryData.paymentTypes.length == 0 || (queryData.paymentTypes.length == 1 && queryData.paymentTypes[0].type == '2')">
        暂时没有合适的支付方式
      </h4>
    </cells>
    <!-- <cells class="type" v-if="type !== 'buy'">
      <cell :link="false">
        <h4 slot="label">
          <img :src="alipay" alt="">
          支付宝
        </h4>
        <mu-radio slot="value" name="payway" v-model="payway" nativeValue="0" uncheckIcon="panorama_fish_eye"
                  checkedIcon="check_circle"/>
      </cell>
    </cells> -->
    <!-- <cells class="type" v-if="type !== 'buy'">
      <cell :link="false">
        <h4 slot="label">
          <img :src="weixinpay" alt="">
          微信支付
        </h4>
        <mu-radio  slot="value" name="payway" v-model="payway" nativeValue="1" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
      </cell>
    </cells> -->

    <cells>
      <cell :link="false" :value="'¥' + sum">
        <h4 slot="label">实际支付</h4>
      </cell>
    </cells>

    <div class="button">
      <mu-flat-button label="确定" class="demo-flat-button" backgroundColor="#F98700" v-tap="{methods: pay}"
                      color="#FFF"/>
    </div>
  </div>
</template>

<script>
  // import icarHeader from 'components/my-header'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import alipay from 'assets/icon_alipay.png'
  import weixinpay from 'assets/icon_weixinpay.png'
  // import icarCheckbox from 'components/icar-checkbox'
  import money from 'assets/money.png'



  // import { Indicator } from 'mint-ui'

  import Order from 'tools/order.service.js'
  let order = Order.getInstance()
  let debouncePay

  export default {
    name: 'payment',

    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      },
      callback: {
        type: Function
      },
      sum: {
        type: [String, Number]
      },
      type: {
        //  支付可以分为两种 充值和 购买
        type: String,
        default () {
          return 'recharge'
        }
      },
      selectedPaymentMethodId: {
        type: String
      },
      orderId: {
        type: String
      }
    },
    watch: {
      payway (val) {
        this.value.paymentMethodId = val
      }
    },
    components: {
      // icarHeader,
      cells,
      cell,
      // icarCheckbox
    },
    computed: {
      disabled () {
        console.log(this.queryData.balance, this.sum)
        return Number(this.queryData.balance) < Number(this.sum)
      }
    },
    mounted () {
      // 监听路由发生变化
//      if (this.value.paymentMethodId) {
//        this.payway = this.value.paymentMethodId
//      }
      window.addEventListener('hashchange', () => {
        this.callback()
      })

      debouncePay = this.$.debounce(this._payment, this)
    },
    // 获取支付方式
    created () {
      this.$.get({
        paymentMethodId: this.selectedPaymentMethodId,
        orderId: this.orderId,
        methodName: 'ListPaymentType'
      }).then(resp => {
        this.queryData = resp.data
        order.userBalancePay(this.queryData)
      })
    },
    methods: {
      _payment () {
        if (!this.payway) {
          this.$.toast('选择支付方式')
          return
        }
        this.value.methodName = 'CreateOrder'
        // 执行回调
        this.callback('true', this.payway)
      },
      pay () {
        debouncePay()
      },
      logistics (params) {
        this.$router.push({
          name: 'l_logistics',
          query: {
            orderId: params.id
          }
        })
      }
    },
    data () {
      return {
        alipay,
        weixinpay,
        payway: '',
        money,
        queryData: []
      }
    }
  }
</script>

<style lang="scss">
  #payment h4 {
    color: #787878;
    font-weight: 200;
  }

  #payment h4 img {
    height: 30px;
    vertical-align: middle;
  }

  .moneyIsEnough {
    color: #ccc !important;
  }

  #payment .balance {
    color: #ccc;
  }

  .mork {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: #ccc;
    opacity: 0.3;
    left: 0px;
    width: 100%;
  }

  #payment button {
    width: 100%;
    margin-top: 50px;
    margin-bottom: -7px;
  }

  #payment #is_toast {
    position: absolute;
  }

  #payment {
    font-size: 1.2rem;
    color: #F13939;
  }

  #payment .mini_f {
    font-size: 1.3rem;
    color: #F13939;
  }

  #payment .panorama_fish_eye {
    color: #939393;
    font-size: 40px;
  }

  #payment {
    .mu-radio-icon-uncheck {
      color: #939393;
    }
    .mu-radio-icon-checked {
      color: #F98700;
    }
    .mu-radio {
      margin-top: 14px;
    }
  }

  #payment .check_circle {
    color: #F98700;
  }

  #payment i {
    font-size: 25px !important;
  }
  #payment .noPayway{
    text-align: center;
    line-height: 26px
  }
</style>
