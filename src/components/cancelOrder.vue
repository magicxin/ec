<template>
  <mu-bottom-sheet :open="isShow" @close="close">
    <mu-list @itemClick="close" id="cancel_order">
      <mu-sub-header class="text-center">
        取消订单
      </mu-sub-header>
      <h4>取消订单后, 本订单享有的优惠将一并取消, 是否继续</h4>
      <p>请选择取消订单的原因(必选)</p>
      <cells>
        <cell :link="false">
          <mu-radio slot="label" label="我不想买了" nativeValue="我不想买了" name="reason" v-model="queryData.reason" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
        <cell :link="false">
          <mu-radio slot="label" label="信息填写有误, 重新拍" nativeValue="信息填写有误, 重新拍" name="reason" v-model="queryData.reason"  uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
        <cell :link="false">
          <mu-radio slot="label" label="卖家缺货" name="reason" v-model="queryData.reason"  nativeValue="卖家缺货" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
        <cell :link="false">
          <mu-radio slot="label" label="忘记使用优惠券,V豆" nativeValue="忘记使用优惠券,V豆" name="reason" v-model="queryData.reason"  uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
        <cell :link="false">
          <mu-radio slot="label" label="重复下单,误下单" nativeValue="重复下单,误下单" name="reason" v-model="queryData.reason"  uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
        <cell :link="false">
          <mu-radio slot="label" label="支付方式有误,无法支付" nativeValue="支付方式有误,无法支付" name="reason" v-model="queryData.reason"  uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        </cell>
      </cells>
      <mu-flat-button label="确定" class="flat-button" backgroundColor="#f98700" v-tap="{methods: close, ifSure: true}" color="#FFF"/>
    </mu-list>
  </mu-bottom-sheet>
</template>
<script>
  import cells from 'components/cells'
  import cell from 'components/cell'
  export default {
    name: 'cancelOrder',
    data () {
      return {
        // bottomSheet: false,
        queryData: {
          reason: 'default'
        }
      }
    },
    props: {
      isShow: {
        type: Boolean
      }
    },
    methods: {
      close (params) {
        this.$emit('submitCancalOrder', typeof (params) === 'object' ? this.queryData.reason : '')
      }
    },
    components: {
      cells,
      cell
    }
  }
</script>

<style>
  #cancel_order h4{
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 1.1rem;
  }

  #cancel_order .mu-radio-label{
    font-size: 1.1rem;
  }
  #cancel_order p {
    margin-bottom: 10px;
    font-size: 1.1rem;
    padding-left: 10px;
  }
  #cancel_order .mu-radio-label{
    font-size: 1.1rem;
    color: #949494;
  }

  #cancel_order #cell{
    height: 30px;
    min-height: 18px;
    line-height: 18px;
  }

  #cancel_order .flat-button{
    width: 100%;
    margin-bottom: -8px;
  }

  #cancel_order .mu-radio-icon-uncheck{
    color: #9F9F9F;
  }

  #cancel_order .mu-radio-icon-checked{
    color: #f98700;
  }

  #cancel_order #cell:after{
    transform: scale(0)
  }
</style>