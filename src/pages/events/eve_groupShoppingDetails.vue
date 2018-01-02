
<template>
  <div id="sg_goods">
    <goodsDetail :product="product"
                 :shop="shop"
                 :evalData="evalData"
                 :evalArray="evalArray"
                 :activity="activity"
                 :evalDataSome="evalDataSome"
                 :favorId="favorId"
                 :isCollect="isCollect"
                 :couponData = "coupon"
                 :isActivity="isActivity"
                 :collectState="collectState">
      <!-- <div slot="robBuy_actived_one">
        <layout justify="space-between" class="border mini_f">
          <layout justify="flex-start">
            <flex><span class="pad_rig">第{{ activity.activityIndex }}期</span><span>已参与{{ activity.attendCount }}人</span>
            </flex>
          </layout>
          <layout justify="flex-end">
            <flex>还差<span class="col_yellow">{{ activity.total - activity.attendCount }}</span>人</flex>
          </layout>
        </layout>
        <div class="progress">
          <mu-linear-progress mode="determinate" color="#F98700" :value="Number(activity.attendCount)"
                              class="mu-linear-progress" :max="Number(activity.total)"/>
        </div>
        <layout justify="center" class="sm_f col_gay text-center m-top_10 m-bot_15">
          <flex :style="{color: activeColor}">
            {{ activity.isAttend | isAttend }} 
          </flex>
        </layout>
      </div> -->
    </goodsDetail>
  </div>
</template>
<script>
	import Vue from 'vue'
  import goodsDetail from 'components/goods/goodsDetail'



  export default {
    data () {
      return {
        product: {}, // 产品参数对象
        shop: {}, // 商家信息参数对象
        evalData: {}, // 评价参数对象
        evalArray: [], // 评价数组
        evalDataSome: {}, // 列表默认展示 三条评价
        isCollect: true, // 是否收藏
        favorId: '', // 收藏id
        collectState: '收藏',
        activeColor: '#929292',
        beginDate: '', // 用户参与记录开始时间
        activity: {}, // 活动对象参数
        isActivity: true, // 判断是否是活动
        coupon:{}  // 团购活秒杀进入之后会产生的优惠券
      }
    },
    methods: {},
    filters: {

      // 判断是否参与抢购
      isAttend: function (value) {
        if (value === '0') {
          return '您本期还未参团'
        } else {
          return '您本期已参团'
        }
      }
    },
    beforeRouteEnter (to, from, next) {
    	//微信分享不进入V商
    	if(Vue.prototype.$.isWechat){
    		location.href="/index.html"
    	}else{
      Promise.all([

        // 查看商品接口
        Vue.prototype.$.get({
          methodName: 'QueryActivityProduct',
          productId: to.params.id || '',
          activityId: to.params.activityId,
          type: '3'
        }),

        // 商品评价列表接口
        Vue.prototype.$.get({
          methodName: 'QueryProductReview',
          type: '0',
          index: '0',
          productId: to.params.id
        })
      ])
        .then(result => next(vm => {
          vm.coupon = to.params.coupon
          vm.product = result[0].data.product
          vm.activity = result[0].data.activity
          vm.beginDate = result[0].data.activity.beginDate.split(' ')[0]
          vm.shop = result[0].data.shop
          vm.favorId = result[0].data.product.favorId
          vm.evalData = result[1].data
          vm.evalDataSome = result[1].data
          vm.evalDataSome.reviews = vm.evalDataSome.reviews.slice(0, 2)
          vm.evalArray = [
            {text: '全部', num: vm.evalData.all, active: true, type: 0},
            {text: '好评', num: vm.evalData.positive, active: false, type: 1},
            {text: '中评', num: vm.evalData.moderate, active: false, type: 2},
            {text: '差评', num: vm.evalData.negative, active: false, type: 3},
            {text: '有图', num: vm.evalData.imageCount, active: false, type: 4}
          ]
          if (vm.product.isFavor === '1') {
            vm.isCollect = false
            vm.collectState = '已收藏'
          } else {
            vm.isCollect = true
            vm.collectState = '收藏'
          }
          if (vm.activity.isAttend === '0') {
            vm.activeColor = '#929292'
          } else {
            vm.activeColor = '#f98700'
          }
        }))
      }
    },
    components: {
      goodsDetail
    }
  }
</script>
<style scoped>
  .border {
    margin-left: 14px;
    padding-top: 10px;
    margin-right: 14px;
    color: #929292;
    border-top: 1px dotted;
  }

  .pad_rig {
    padding-right: 10px;
  }

  .progress {
    margin-left: 14px;
    margin-right: 14px;
    margin-top: 16px;
  }

</style>