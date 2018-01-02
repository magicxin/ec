<template>
  <div>
    <my-header main-text="卡豆规则" bg-color="#f7f7f7" text-color="#030303" line-color="#030303">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>

    <div class="content" v-for="(item, index) in ruleText" :key="index">
      <h2 class="title">
        {{ item.title }}
      </h2>
      <ul class="main-text">
        <li v-for="(value, index) in item.content" :key="index">
          <layout align="flex-start" justify="flex-start">
            <flex basis="25px" shrink="0" grow="0">
              {{ value.title }} 
            </flex>
            <flex>
              {{ value.text }}
            </flex>
          </layout>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  export default {
    data () {
      return {
        ruleText: [
          {
            title: '领卡豆',
            content: [
              {title: '1.', text: '每天最多可签到一次，签到后获得相应奖励。'},
              {title: '2.', text: '连续签到7天可获得额外的卡豆奖励，每周重新累计。'},
              {title: '3.', text: '卡豆可用于支付商城订单抵扣相应金额。'}
            ]
          }, {
            title: '什么是卡豆？',
            content: [
              {title: '1.', text: '卡豆是卡猫爱车用户在卡猫爱车平台购物、评价、晒单等相关活动情况给予的奖励，卡豆仅可在卡猫爱车平台使用，如用户账号停止使用，则将取消该用户账号内卡豆相关使用权益。'},
              {title: '2.', text: '卡豆直接用于支付卡猫爱车平台订单，购物结算时卡豆直接抵现，1卡豆=1分钱。'},
              {title: '3.', text: '消费送豆，购物时直接按订单金额送豆，1元=1卡豆。'},
              {title: '4.', text: '卡豆也可用来抽奖。'}
            ]
          }
        ]
      }
    },
    name: 'vb_integralRule',
    components: {
      myHeader
    }
  }
</script>

<style scoped>
  .content {
    padding: 20px;
    padding-left: 30px;
  }

  .title {
    color: #c60005;
    position: relative;
    font-size: 18px;
  }

  .title::before {
    content: '';
    width: 2px;
    height: 14px;
    background-color: #c60005;
    position: absolute;
    left: -10px;
    top: 2px;
  }

  .main-text {
    font-size: 16px;
    line-height: 1.7;
    margin-top: 6px;
  }
</style>
