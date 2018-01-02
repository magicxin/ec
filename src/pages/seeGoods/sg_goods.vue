<style>

</style>
<template>
  <div id="sg_goods">
    <goodsDetail :product="product" 
                 :shop="shop" 
                 :evalData="evalData" 
                 :evalDataSome="evalDataSome" 
                 :evalArray="evalArray" 
                 :favorId="favorId" 
                 :isCollect="isCollect" 
                 :promotionsData="promotions"
                 :collectState="collectState">
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
      evalDataSome: {}, // 列表默认展示 三条评价
      evalArray: [], // 评价数组
      isCollect: true, // 是否收藏
      favorId: '', // 收藏id
      collectState: '收藏',
      promotions:[] //促销
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([

      // 查看商品接口
      Vue.prototype.$.get({
        methodName: 'QueryProductInfo',
        productId: to.params.id
      }),

      // 商品评价列表接口
      Vue.prototype.$.get({
        methodName: 'QueryProductReview',
        type: '0',
        index: '0',
        count: '10',
        productId: to.params.id
      })
    ])
    .then(result => next(vm => {
      vm.product = result[0].data.product
      console.log('vm.product: ',vm.product)
      vm.promotions = result[0].data.promotions
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
    goodsDetail
  }
}
</script>
