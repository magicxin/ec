
<template>
  <div>
    <my-header main-text="红红火火抢红包" bg-color="#fff" text-color="#000">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header>
    <div>
      <div class="bg_img" v-if="chooseBg == 'stratBg'">
        <img src="../../assets/robIndex.png" width="100%">
        <h1>开门抢红包！</h1>
        <h4>拼手气的时候到了</h4>
        <span v-on:click="robPacket" class="rob">抢红包</span>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robVBg'">
        <img src="../../assets/robV.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css">
            100V豆
        </span>
        <span class="notes_css">
          (消费满600元可用)
        </span>
        <button class="watch_css">
          查看明细
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robMoneyBg'">
        <img src="../../assets/robMoney.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css">
            100元
        </span>
        <span class="notes_css">
          (消费满600元可用)
        </span>
        <button class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robCouponBg'">
        <img src="../../assets/robCoupon.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="coupon_css">
            ￥10优惠券
        </span>
        <button class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robTimesBg'">
        <img src="../../assets/robMoney.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css time1_css">
            获得
        </span>
        <span class="amount_css time2_css">
            3次抽奖机会
        </span>
        <button class="watch_css" v-go="'eve_luckyDraw'">
          前往抽奖
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'noRobBg'">
        <img src="../../assets/noRob.png" width="100%">
        <h1>很遗憾</h1>
        <h4>红包与你擦肩而过</h4>
      </div>
      <div class="event_rule">
          <h3>活动规则</h3>
          <ul>
            <li>1、参与抢红包活动既有机会获得现金、V豆、优惠券以及抽奖机会；</li>
            <li>2、红包奖品随即，全凭手气哦；</li>
            <li>3、每个用户限领一次；</li>
            <li>4、红包领取后，自动存入你的账号；</li>
            <li>5、红包数量有限，领完为止；</li>
            <li>6、如有问题，欢迎咨询<br>卡欧科技客服热线：4009681123</li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script>
import myHeader from 'components/my-header'
export default {
  data () {
    return {
      chooseBg: 'stratBg'
    }
  },
  components: {
    myHeader
  },
  methods: {
    robPacket: function () {
      let random = Math.floor(Math.random() * 5)
      // switch (random) {
      //   case '0':
      //     console.log(random)
      //     this.chooseBg = 'robVBg'
      //     break
      //   case '1':
      //     console.log(random)
      //     this.chooseBg = 'robMoneyBg'
      //     break
      //   case '2':
      //     console.log(random)
      //     this.chooseBg = 'robCouponBg'
      //     break
      //   case '3':
      //     console.log(random)
      //     this.chooseBg = 'robMoneyBg'
      //     break
      //   case '4':
      //     console.log(random)
      //     this.chooseBg = 'noRobBg'
      //     break
      // }
      if (random === 0) {
        this.chooseBg = 'robVBg'
      } else if (random === 1) {
        this.chooseBg = 'robMoneyBg'
      } else if (random === 2) {
        this.chooseBg = 'robCouponBg'
      } else if (random === 3) {
        this.chooseBg = 'robTimesBg'
      } else if (random === 4) {
        this.chooseBg = 'noRobBg'
      } else {
        this.chooseBg = 'stratBg'
      }
    }
  }
}
</script>
<style>
 .bg_img {
    position: relative;
      color: #624326;
 }
 .bg_img h1 {
  position: absolute;
  top: 7%;
  font-size: 26px;
  font-weight: 800;
  left: 50%;
  transform: translate(-50%, -50%);
 }
 .bg_img h4 {
  position: absolute;
  top: 17%;
  font-size: 16px;
  left: 50%;
  transform: translate(-50%, -50%);
 }
 .bg_img .rob {
  position: absolute;
  bottom: 13.4%;
  margin: 0 auto;
  color: #df0055;
  font-size: 14px;
  left: calc(50% - 2.5em);
 }
.event_rule {
  color: #5f3400;
  background-color: #f9f1cd;
  border-top: 1px solid #f9f1cd;
  padding: 20px 20px;
}
.event_rule h3 {
  font-weight: 800;
  margin-bottom: 10px;
  font-size: 15px;
}
.event_rule ul li {
  padding-bottom: 5px;
  font-size: 14px;
  line-height: 20px;
}
.amount_css {
  position: absolute;
  color: #fac30e;
  font-size: 22px;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 30%;
}
.notes_css {
  position: absolute;
  color: #c72b15;
  font-size: 14px;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 24%;
}
.coupon_css {
  position: absolute;
  color: #c72b15;
  font-size: 14px;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 28%;
}
.watch_css {
  position: absolute;
  background-color: #fff965;
  font-size: 14px;
  color: #ca2a1c;
  padding: 8px 12px;
  left: 50%;
  transform: translate(-50%, 50%);
  bottom: 16%;
  border-radius: 10px;
  outline-style: none;
  border-style: none;
}
.time1_css {
  bottom: 30%;
}
.time2_css {
  bottom: 22%
}
</style>