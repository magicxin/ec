
<template>
  <div id="sg_goods">
    <goodsDetail :product="product"
                 :shop="shop"
                 :activity="activity"
                 :evalData="evalData"
                 :evalArray="evalArray"
                 :evalDataSome="evalDataSome"
                 :favorId="favorId"
                 :isCollect="isCollect"
                 :isActivity="isActivity"
                 :collectState="collectState">
      <div slot="robBuy_actived_one">
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
          <mu-linear-progress mode="determinate" color="#F98700" :value="Number(activity.attendCount)" class="mu-linear-progress" :max="Number(activity.total)" />
        </div>
        <layout justify="center" class="sm_f col_gay text-center m-top_10 m-bot_15">
          <flex>
              {{ activity.isAttend | isAttend}}
          </flex>
        </layout>
      </div>
      <div slot="robBuy_actived_two">
        <cell value="" v-tap="{methods: goAnnounce }">
          <p slot="label" class="options-label"  >往期结果</p>
        </cell>
        <cell :value="beginDate" v-tap="{methods: goRecord }">
          <p slot="label" class="options-label" >用户参与记录</p>
        </cell>
      </div>
    </goodsDetail>
  </div>
</template>
<script>
import Vue from 'vue'
import goodsDetail from 'components/goods/goodsDetail'

import cells from 'components/cells'
import cell from 'components/cell'


export default {
  data () {
    return {
      product: {}, // 产品参数对象
      shop: {}, // 商家信息参数对象
      evalData: {}, // 评价参数对象
      evalDataSome: {}, // 列表默认展示 三条评价
      evalArray: [], // 评价数组
      isCollect: true, // 是否收藏
      favorId: '', // 收藏id
      collectState: '收藏',
      beginDate: '', // 用户参与记录开始时间
      activity: {}, // 活动对象参数
      isActivity:true //判断是否是活动
    }
  },
  methods: {

    // 往期结果
    goAnnounce () {
      this.$router.push({name: 'eve_toAnnounce', params: {activityId: this.$route.params.activityId, id: this.product.id}})
    },

     // 用户参与记录
    goRecord () {
      this.$router.push({name: 'eve_userRecord', params: {activityId: this.$route.params.activityId}})
    }
  },
  filters: {

    // 判断是否参与抢购
    isAttend: function (value) {
      if (value === '0') {
        return '您本期还未抢购'
      } else {
        return '您本期已抢购'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([

      // 查看商品接口
      Vue.prototype.$.get({
        methodName: 'QueryActivityProduct',
        productId: to.params.id,
        activityId: to.params.activityId,
        type: '1'
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
    }))
  },
  components: {
    goodsDetail,
    cells,
    cell
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