/**
 * Created by lenovo on 2017/7/7.
 */

// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default {
  //在首页进入的时候获取优惠券列表
  getGetCouponInfo(params, success, fail){
    function makeData (originalData) {
      // console.log(originalData)
      return {
        touterCouponList: originalData.promotions || []
      }
    }
    params['methodName'] = 'ListPromotion'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  },
  //点击领取优惠券
  receiveConpon(params, success, fail){
    function makeData (originalData) {
      console.log(originalData)
      return {}
    }
    params['methodName'] = 'CreateCouponCode'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  },
  //在我的页面进入的时候获取优惠券列表
  getListCoupon(params, success, fail){
    function makeData (originalData) {
      // console.log(originalData)
      return {
        touterCouponList: originalData.coupons || []
      }
    }
    params['methodName'] = 'ListCoupon'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
