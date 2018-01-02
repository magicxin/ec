
<template>
  <div id="robRedPacket" class="eve_two">
    <!-- <my-header main-text="红红火火抢红包" bg-color="#fff" text-color="#000" :shop="shop">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->

      <magic-header :isEve="true" :titleName="LotteryInitInfo.activity && LotteryInitInfo.activity.title ? LotteryInitInfo.activity.title : '红红火火抢红包'" :returnNative="$route.params.native"></magic-header>
    <div>
      <div class="bg_img" v-if="chooseBg == 'stratBg'">
        <img src="../../assets/robIndex.png" width="100%">
        <h1>开门抢红包！</h1>
        <h4>你还有&nbsp;{{ LotteryInitInfo.leaveTimes }}&nbsp;次机会</h4>
        <span v-on:click="robPacket" class="rob">抢红包</span>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robVBg'">
        <img src="../../assets/robV.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>V豆已经放进你的账号</h4>
        <span class="amount_css">
            {{ redPacket.lotteryInfo }}
        </span>
        <!--<span class="notes_css">
          ({{ redPacket.description }})
        </span>-->
        <button class="watch_css">
          查看明细
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robMoneyBg'">
        <img src="../../assets/robMoney.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css">
            {{ redPacket.lotteryInfo }}
        </span>
        <!--<span class="notes_css">
          ({{ redPacket.description }})
        </span>-->
        <button v-if="!isWxPublic" v-tap="{methods: go}" class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robProductBg'">
        <img src="../../assets/robProduct.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css">
            {{ redPacket.lotteryInfo }}
        </span>
        <!--<span class="notes_css">
          ({{ redPacket.description }})
        </span>-->
        <button v-if="!isWxPublic" v-tap="{methods: go}" class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robCouponBg'">
        <img src="../../assets/robCoupon.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>优惠券已经放进你的账号</h4>
        <span class="coupon_css">
            {{ redPacket.lotteryInfo }}
        </span>
        <!--<span class="notes_css">
          ({{ redPacket.description }})
        </span>-->
        <button v-if="!isWxPublic" v-tap="{methods: go}" class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robMaterialBg'">
        <img src="../../assets/robMaterial.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>礼品已经放进你的账号</h4>
        <span class="coupon_css">
            {{ redPacket.lotteryInfo }}
        </span>
        <!--<span class="notes_css">
          ({{ redPacket.description }})
        </span>-->
        <button v-if="!isWxPublic" v-tap="{methods: go}" class="watch_css">
          立即使用
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'robTimesBg'">
        <img src="../../assets/robMoney.png" width="100%">
        <h1>恭喜您！</h1>
        <h4>红包已经放进你的账号</h4>
        <span class="amount_css time1_css">
            获得{{ redPacket.lotteryInfo }}
        </span>
        <button class="watch_css" v-on:click="robPacket">
          再来一次
        </button>
      </div>
      <div class="bg_img" v-if="chooseBg == 'noRobBg'">
        <img src="../../assets/noRob.png" width="100%">
        <h1>很遗憾</h1>
        <h4>红包与你擦肩而过</h4>
      </div>
      <layout justify="space-around" class="rob_btn_style">
        <flex>
          <mu-raised-button label="继续抢" class="demo-raised-button" backgroundColor="#fdb71b" v-tap="{methods: goOn}"/>
        </flex>
        <flex>
          <mu-raised-button label="我的奖品" class="demo-raised-button" backgroundColor="#fdb71b" v-tap="{methods: goPrize}"/>
        </flex>
      </layout>
      <div class="event_rule">
          <h3>活动规则</h3>
          <div v-for="(item,index) in LotteryInitInfo.rule" :key="index">{{item}}</div>
      </div>
      <shopDetail v-if="!isWxPublic" :value="shop.mobile" :position="shop" :shopId="shop.id">
          <span slot="name">{{ shop.name }}</span>
          <span slot="address">{{ shop.address }}</span>
      </shopDetail>
      <div v-if="isWxPublic" class="footer">
        	<div class="left">
        		<div class="info-top">{{ shop.name }}</div>
        		<div class="info-bottom">{{ shop.address }}</div>
        	</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import magicHeader from 'components/magicHeader'
import shopDetail from 'components/shop-detail'
export default {
  data () {
    return {
      chooseBg: 'stratBg',
      redPacket: {},
      activityId: this.$route.params.activityId,
      LotteryInitInfo: {},
      shop: {},
      isWxPublic:false,
      activity: {}
    }
  },
  created(){
    // this.$.isScanQRCode('1')
    if(this.$.env==="wxPublic"){
      this.isWxPublic = true
    }
  },
  components: {
    magicHeader,
    shopDetail
  },
  methods: {
    robPacket () {
      let vm = this
      if(this.$.userId){
        this.$.isScanQRCode(this.LotteryInitInfo.activity.isScan,function(scanId){
          scanId = scanId || ''
          alert(scanId)
          if (vm.LotteryInitInfo.state === '1') {
            if (vm.LotteryInitInfo.leaveTimes > 0) {
              vm.LotteryInitInfo.leaveTimes--
              vm.$.get({
                methodName: 'AttendLottery',
                category: '0',
                id: vm.activityId,
                shopId:scanId,
                loading:'false'
              }).then(res => {
                console.log(res)
                if (res.data.resultCode === '100') {
                  scanId = ''
                  vm.redPacket = res.data.prize
                  if (vm.redPacket.name.indexOf('一次') > 0) {
                    vm.LotteryInitInfo.leaveTimes++
                  }
                  let random = res.data.prize.type
                  if (random === 0) {
                    vm.chooseBg = 'robVBg'
                  } else if (random === 1) {
                    vm.chooseBg = 'robProductBg'
                  } else if (random === 2) {
                    vm.chooseBg = 'robCouponBg'
                  } else if (random === 3) {
                    vm.chooseBg = 'robTimesBg'
                  } else if (random === 4) {
                    vm.chooseBg = 'noRobBg'
                  } else if (random === 5) {
                    vm.chooseBg = 'robMaterialBg'
                  } else {
                    vm.chooseBg = 'robMoneyBg'
                  }
                } else {
                  this.$.toast(res.data.errorMessage)
                  vm.LotteryInitInfo.leaveTimes++
                }
              })
            } else {
              vm.$.toast('抽奖次数用完啦~')
            }
          } else if (vm.LotteryInitInfo.state === '2') {
            vm.$.toast('本次活动已结束~')
          } else {
            vm.$.toast('稍等片刻，活动即将开始~')
          }
        })
      }else{
        vm.$.goLogin({
          query: {
            shopId: vm.shop.id
          }
        })
      }
    },
    go () {
      this.$router.push({name: 'sg_goodsList'})
    },
    goPrize () {
      if(this.$.userId){
        this.$router.push({name: 'eve_myPrize', params: {id: this.activityId}})
      }else{
        this.$.goLogin({
          query: {
            shopId: this.shop.id
          }
        })
      }
    },
    goOn () {
      this.chooseBg = 'stratBg'
    }
  },
  beforeRouteEnter (to, from, next) {
    Vue.prototype.$.get({
      methodName: 'LotteryInitInfo',
      category: '0',
      id: to.params.activityId
    }).then(res => {
      next(vm => {
        vm.LotteryInitInfo = res.data
        if(vm.LotteryInitInfo.rule){
        	 vm.LotteryInitInfo.rule = vm.LotteryInitInfo.rule.split('；')
        }
        vm.shop = res.data.shop
        if (vm.LotteryInitInfo.leaveTimes < 0) {
          vm.LotteryInitInfo.leaveTimes = 0
        }
      })
    })
  },
  mounted () {
    let clientHeight = document.documentElement.clientHeight
    console.log(document)
    setTimeout(() => {
      let imgHeight = document.querySelectorAll('.bg_img')[0]
      let style = window.getComputedStyle ? window.getComputedStyle(imgHeight, null) : null || imgHeight.currentStyle
      let obj = document.querySelector('.event_rule')
      obj.style.minHeight = 100 + 'px'
      console.log(clientHeight)
      console.log(style.height.slice(0, style.height.length - 2))
      console.log(obj.style.minHeight)
    })
  }
}
</script>
<style>
 .bg_img {
    position: relative;
      color: #624326;
      background-color: #f9f1cd;
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
  margin-top: -7px;
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
#robRedPacket .rob_btn_style {
  text-align: center;
  background-color: #f9f1cd;
  padding-top: 30px;
  padding-bottom: 10px;
}
#robRedPacket .rob_btn_style button {
  font-size: 16px;
}
.eve_two .footer .left{
  	padding:8px;
    color: #fff;
    background-color: #bc3833;
    height: 80px;
    line-height: 30px;
  }
  .eve_two .footer .left .info-top{
    text-align: left;
    padding-left: 10px
  }
  .eve_two .footer .left .info-bottom{
    text-align: left;
    padding-left: 10px
  }
</style>
