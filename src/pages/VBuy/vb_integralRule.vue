<template>
  <div>
    <my-header main-text="积分规则" bg-color="#f7f7f7" text-color="#030303" line-color="#030303">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>

    <div class="content" v-for="(item, index) in ruleText" :key="index">
      <h2 class="title">
        {{ item.title }}
      </h2>
      <ul class="main-text">
        <li>
          <layout align="flex-start" justify="flex-start">
            <flex>
              {{ item.content }}
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
            title: '会员成长介绍',
            content: '会员成长体系包含多个会员等级，会员等级由“成长值”决定，成长值越高，会员等级越高。'
          }, {
            title: '什么是成长值',
            content: '成长值是会员通过购物所获得的经验值，由累计金额计算获得，它标志着您在该平台累计的购物经验值，成长值越高会员等级越高，享受更多的会员服务哦！'
          }, {
            title: '成长值如何获得',
            content: '会员成长值=累计购物金额(已完成的订单)。'
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
