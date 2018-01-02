
<template>
  <div>
    <goodsDetail :product="product"
                 :endTime="endTime"
                 :activity="activity"
                 :shop="shop"
                 :evalData="evalData"
                 :evalArray="evalArray"
                 :evalDataSome="evalDataSome"
                 :favorId="favorId"
                 :isActivity="true"
                 :couponData = "coupon"
                 :isCollect="isCollect"
                 :collectState="collectState"
                 :timeSpikeDetails="timeSpikeDetails">
      <div slot="eve_timeSpikeDetails">
        <layout justify="flex-start" class="top_style">
          <flex><span class="title mid_f text-overflow">{{ product.name }}</span></flex>
        </layout>
        <layout justify="space-between" class="bottom_style" align="flex-start">
          <flex class="span_css">
            <layout direction="column" align="flex-start">
              <flex><span>已售{{ activity.soldProd || 0 }}件/余{{ activity.maxProduct -activity.soldProd }}件</span></flex>
              <flex></flex>
              <flex><span>快递：{{ product.freight || 0 }}</span></flex>
            </layout>
          </flex>
          <flex class="span_style text-right">
            <span v-tap="{methods: submit_collection}" v-bind:class="{collection: isCollect, collected: !isCollect}">{{ collectState }}</span>
          <span class="share" v-on:click="shareFun()">分享</span>
          </flex>
        </layout>
      </div>
    </goodsDetail>
  </div>
</template>
<script>
import Vue from 'vue'
import goodsDetail from 'components/goods/goodsDetail'

import collection from 'assets/collection.svg'



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
      activity: {}, // 活动对象参数
      endTime: 1,
      timeSpikeDetails: true,
      collection,
      coupon:null
    }
  },
  methods: {

    // 收藏
    submit_collection () {
      if (!this.isCollect) {
        this.$.get({
          ids: [this.favorId],
          methodName: 'DeleteFavorite'
        }).then(resp => {
          console.log(resp.data)
        })
        this.isCollect = !this.isCollect
        this.collectState = '收藏'
      } else {
        this.$.get({
          productId: this.$route.params.id,
          type: '1',
          methodName: 'AddFavorite'
        }).then(resp => {
          console.log(resp.data)
        })
        this.isCollect = !this.isCollect
        this.collectState = '已收藏'
        // 获取收藏id
        this.$.get({
          productId: this.$route.params.id,
          methodName: 'QueryProductInfo'
        }).then(resp => {
          this.favorId = resp.data.product.favorId
        })
      }
    },

    // 分享
    shareFun () {
      let shareThumImage = this.product.image || '/upload/image/default_user_icon.png'
      this.$.push('route_share', {
        shareTitle: this.product.fullName,
        shareContent: '我在V服发现了一个不错的商品，过来看看吧',
        shareThumImage: shareThumImage,
        shareType: '12',
        shareId: this.product.id
      }, (resp) => {
        window.alert(resp)
      })
    } 
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([

      // 查看商品接口
      Vue.prototype.$.get({
        methodName: 'QueryActivityProduct',
        productId: to.params.id,
        activityId: to.params.activityId,
        type: '2'
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
      vm.shop = result[0].data.shop
      vm.favorId = result[0].data.product.favorId
      vm.endTime = new Date(vm.activity.endDate.replace(/-/g, '/')).getTime()
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
  mounted () {

  },
  components: {
    goodsDetail
  }
}
</script>
<style scoped>
.top_style {
    padding-top: 10px;
    margin-left: 14px;
}
.title {
    color: #000;
    margin-right: 13px;
    display: inline-block;
    line-height: 22px;
}
.bottom_style {
    margin-top: 4px;
    margin-left: 14px;
}
.bottom_style .span_css {
  color: #666666;
  padding-top: 10px;
  margin-bottom: 10px;
}
.span_style span {
  padding-top:30px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
  margin-left: -10px
}
.collection {
  border-right: 1px solid #dadada;
  background: url(../../assets/icon_shop_fav_emp.png) no-repeat center top 2px;
  text-align: center;
  background-size: 21px;
  width: 55px;
  padding-top:30px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
}
.collected {
  border-right: 1px solid #dadada;
  background: url(../../assets/icon_shop_fav_full.png) no-repeat center top 2px;
  text-align: center;
  width: 55px;
  background-size: 21px;
  padding-top:30px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
}
.share {
  background: url(../../assets/share.png) no-repeat center top 5px;
  text-align: center;
  width: 55px;
  background-size: 21px;
  padding-top:30px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
}
.bottom_style .span_css {
  color: #666666;
  padding-top: 10px;
  margin-bottom: 10px;
}
</style>