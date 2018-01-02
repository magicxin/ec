<template>
  <div id="o_returnDetail">
    <is-header bgColor="#F7F7F7" mainText="我的订单" textColor="#474747">
      <img :src="left" alt="">
    </is-header>
    <div class="return_detail_panel">
      <h4>{{state[queryData.returns[0].type]}}</h4>
      <preview :left="true">
        <preview-item label="退款类型 : " :value="type" ></preview-item>
        <preview-item label="退款金额 : " :value="queryData.amount" ></preview-item>
        <preview-item label="退款原因 : " :value="queryData.reason" ></preview-item>
      </preview>
    </div>
    <div class="logistics-content">
      <div class="logistics-item" :class="{'first-item': index === 0}" layout="column" layout-align="center flex-start" v-for="(item, index) in queryData.returns">
        <p flex class="item-text" :class="{'first-text': index === 0}">{{state[item.type]}}</p>
        <p v-if="item.deliveryState && item.type === '3'">
          <span>物流状态:</span>
          {{item.deliveryState}}
        </p>
        <p v-if="item.deliveryCorp && item.type === '3'">
          <span>物流公司:</span>
          {{item.deliveryCorp}}
        </p>
        <p v-if="item.trackingNo && item.type === '3'">
          <span>物流单号:</span>
          {{item.trackingNo}}
        </p>
        <p v-if="item.expireData && item.type === '2'">
          <span>过期时间:</span>
          <!--{{item.expireData}}-->
          剩余
          <span class="orange">{{item.days}}</span>天
          <span  class="orange">{{item.hours}}</span>
          时逾期未退货申请将自动关闭
        </p>
        <p v-if="item.address && item.type === '2'">
          <span>退货地址:</span>
          {{item.address}}
        </p>
        <p v-if="item.consignee && item.type === '2'">
          <span>收件人:</span>
          {{item.consignee}}
        </p>
        <p v-if="item.amount && item.type === '5'">
          <span>退款金额:</span>
          {{item.amount}}
        </p>
        <p v-if="item.way && item.type === '5'">
          <span>退款方式:</span>
          {{item.way}}
        </p>
        <p v-if="item.remarks && item.type === '1' || item.type === '4'">
          <span>拒绝原因:</span>
          {{item.details}}
        </p>
        <p v-if="item.remarks && item.type === '1' || item.type === '4'">
          <span>备注:</span>
          {{item.remarks}}
        </p>
        <p class="time">{{item.happenDate}}</p>
        <span class="logistics-item-point" :class="{'first-point': index === 0}"></span>
        <mu-divider/>
      </div>
    </div>
    <foot class="text-right">
      <order-button color="#888888" border="#BEBEBE" v-tap="{methods: update}" v-if="orderItem.refundsState === '0' || orderItem.refundsState === '2'">
        修改申请
      </order-button>
      <order-button color="#888888" border="#BEBEBE" v-tap="{methods: customer}">
        客服咨询
      </order-button>
      <order-button color="#888888" border="#BEBEBE" v-tap="{methods: fillInTransport}"  v-if="orderItem.refundsState === '2'">
        填写物流
      </order-button>
      <order-button color="#888888" border="#BEBEBE"  v-if="orderItem.refundsState === '1' || orderItem.refundsState === '4' || orderItem.refundsState === '6'">
        重新申请
      </order-button>
    </foot>
  </div>
</template>
<script>
	import Vue from 'vue'
  import preview from 'components/preview'
  import previewItem from 'components/preview-item'
  import isHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import orderButton from 'components/order-button'
  import foot from 'components/foot'
  
  let _reasonForNoGoods = ['多拍/拍错/不想要', '快递无跟踪记录', '空包裹/少货', '未按约定时间发货', '快递一直未到', '其他']
  let _reasonForGoods = ['质量问题', '颜色/款式/图案与描述不符', '商家发错货', '商品少件/破损/污迹/生锈/等', '商品功能缺失或故障', '做工粗糙/有瑕疵', '尺寸不符', '尺码拍错/不喜欢/效果不好', '假冒品牌', '材质成分含量与描述不符', '其他']


  export default {
    name: 'o_returnDetail',
    components: {
      preview,
      previewItem,
      isHeader,
      orderButton,
      foot
    },
    computed: {
      type () {
        switch (this.queryData.type) {
          case '0':
            return '我要退款(无需退货)'
          case '1':
            return '我要退货'
          case '2':
            return '换货'
        }
      },
      reason () {
        switch (this.queryData.reason) {
          case '0':
            return '质量问题'
          case '1':
            return '颜色/款式/图案与描述不符'
          case '2':
            return '商家发错货'
          case '3':
            return '商品少件/破损/污迹/生锈/等'
          case '4':
            return '商品功能缺失或故障'
          case '5':
            return '做工粗糙/有瑕疵'
          case '6':
            return '尺寸不符'
          case '7':
            return '尺码拍错/不喜欢/效果不好'
          case '8':
            return '假冒品牌'
          case '9':
            return '材质成分含量与描述不符'
          case '10':
            return '其他'
        }
      }
    },
    methods: {
      // 填写物流信息
      fillInTransport () {
        this.$router.push({
          name: 'o_fillInTransport',
          query: {
            orderItem: JSON.stringify(this.orderItem),
            refundsId: this.queryData.id
          }
        })
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
      update () {
        this.orderItem.update = true
        this.$router.push({
          name: 'o_return',
          query: {
            orderItem: JSON.stringify(this.orderItem)
          }
        })
      }
    },
    data () {
      return {
        left,
        nowTime: '',
        activeStep: 0,
        queryData: {
          returns: [{}]
        },
        orderItem: {},
        state: ['提交退货申请', '卖家拒绝{退款退货}', '卖家同意买家{退货}', '买家发货', '卖家拒收货物', '卖家(收货并){退款}', '买家取消申请']
      }
    },
    /* eslint-disable */
    beforeRouteEnter (to, from, next) {
      let orderItem = JSON.parse(to.query.orderItem)
      Vue.prototype.$.get({
        methodName: 'QueryRefunds',
        orderId: orderItem.orderId,
        orderItemId: orderItem.id
      }).then(resp => {
        next(vm => {
          let nowTime = Date.now()
          vm.orderItem = orderItem
          vm.queryData = resp.data
          let _cacheReason = Number(resp.data.reason)
          if (_cacheReason || _cacheReason === 0) {
            if (resp.data.type == 0) {
              vm.queryData.reason = _reasonForNoGoods[_cacheReason]
            } else {
              vm.queryData.reason = _reasonForGoods[_cacheReason]
            }
          } else {
            vm.queryData.reason = resp.data.reason
          }
          if (Array.isArray(vm.queryData.returns)) {
            vm.queryData.returns.forEach(val => {
              if (!val.expireData) {
                return
              }
              val.expireData = val.expireData.replace(/-/g, '/')
              // let expireData = Date.parse(val.expireData)
              let expireData = new Date(val.expireData).getTime()
              let elapsed = nowTime - expireData
              let days = Math.floor(elapsed/(24*3600*1000))
              let leave1 = elapsed % (24*3600*1000)
              let hours = Math.floor(leave1/(3600*1000))
              val.days = Math.abs(days)
              val.hours = Math.abs(hours - 1)
            })
          }
        })
      })
    }
  }
</script>
<style>
  .return_detail_panel{
    background-color: #fff;
    padding: 10px;
  }

  .return_detail_panel h4{
    color: #FBA651;
    margin-left: 14px;
    font-size: 1.2rem;
  }

  .orange {
    color: #FBA651 !important;
  }

  .return_detail_panel .preview_label {
    color: #898989;
  }
  .return_detail_panel .preview_value{
    color: black;
  }

  .return_detail_timeLine {
    background-color: #fff;
    margin-top: 10px;
    padding-left: 10px;
    /*height: 20px;*/
  }

  .return_detail_timeLine .time{
    color: #ccc;
    margin-top: 10px;
  }

  #o_returnDetail .mu-stepper-vertical .mu-step-connector-line{
    min-height: 20px;
  }

  #o_returnDetail .mu-step-label.active .mu-step-label-circle,
  .mu-step-label.completed .mu-step-label-circle {
    background-color: #F98700 !important;
    /*color: #F98700 !important;*/
  }

  #o_returnDetail .order-button{
    margin-right: 5px;
  }

  #o_returnDetail .first-text {
    color:#FBAD59 !important;
  }

  #o_returnDetail .completed {
    color:#FBAD59;
  }

  .logistics-content .logistics-item:last-child::before{
    height: 0%;
  }

  .logistics-content {
    background-color: #fff;
    margin-top: 10px;
  }

  .logistics-item {
    padding-left: 50px;
    position: relative;
  }

  .logistics-item p {
    line-height: 16px;
    color: #AFAFAF;
  }

  .logistics-item p span {
    color: #727272;
  }

  .logistics-item::before {
    content: '';
    width: 1px;
    height: 100%;
    background-color: #b7b7b7;
    position: absolute;
    left: 28px;
    transform: scaleX(0.5);
  }

  .logistics-item.first-item::before {
    top: 22px;
  }

  .logistics-item-point {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #b7b7b7;
    position: absolute;
    left: 24px;
    top: 20px;
  }

  .first-item .logistics-item-point {
    width:11px;
    height: 11px;
    left: 23px;
    background-color: #FBAD59;
  }

  .first-item::after {
    content: '';
    width: 33px;
    height: 33px;
    border: 3px solid #FBAD59;
    border-radius: 50%;
    transform: scale(0.5);
    position: absolute;
    left: 12px;
    top:9px;
  }

  #o_returnDetail .item-text {
    font-size: 1rem;
    line-height: 1.87;
    color: #9D9D9D;
    padding-top: 13px;
  }

  .first-text {
    color: #c60007;
  }

  .item-time {
    font-size: 1.1rem;
    line-height: 1.87;
    color: #939393;
    padding: 5px;
    padding-left: 0;
  }

  .first-time {
    color: #363636;
  }

  .time {
    margin-top: 10px;
  }

</style>
