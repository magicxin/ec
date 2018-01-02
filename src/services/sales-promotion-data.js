/**
 * Created by lenovo on 2017/7/14.
 */

// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default{
  getSalesPromotion(params, success, fail){
    function makeData (originalData) {
      console.log(originalData)
      return {
        promotions: originalData.promotions
      }
    }
    params['methodName'] = 'ListPromotion'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
