/**
 * Created by lenovo on 2017/7/17.
 */
// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default {
  //获取优惠券详情
  getPromotionInfo(params, success, fail){
    function makeData (originalData) {
      console.log(originalData)
      return {
        promotion: originalData.Promotion
      }
    }
    params['methodName'] = 'QueryPromotion'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
