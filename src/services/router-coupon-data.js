/**
 * 优惠券页面获取数据
 * Created by hoog on 2017/7/3.
 */
// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default {
  getRouterCouponInfo(params, success, fail){
    function makeData (originalData) {
      // console.log(originalData)
      return {
        touterCouponList: originalData.coupons
      }
    }
    params['methodName'] = 'QueryPromotion'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
