/**
 * Created by lenovo on 2017/7/10.
 */
// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default {
  //获取优惠券详情
  getCouponInfo(params, success, fail){
    function makeData (originalData) {
      console.log(originalData)
      return {
        coupon: originalData.Promotion.coupon || {}
      }
    }
    params['methodName'] = 'QueryPromotion'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
