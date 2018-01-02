// import uris from 'services/uris'
import Vue from 'vue'
export default function(params, success, fail) {
  params['methodName'] = 'QueryCarCost'
  Vue.prototype.$.get(params).then((response)=>{
      success && success(response.data)
    },(response)=>{
      fail && fail(response.errorMessage || '错误：'+response.resultCode)
    })  
}
