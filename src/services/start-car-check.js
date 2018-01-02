// import uris from './uris'
import Vue from 'vue'
export default function(params, success, fail) {
  function makeData(originalData) {

    var originalData=typeof originalData=='object' ? originalData : JSON.parse(originalData)

    return {
      resultCode:originalData.resultCode
    }
  }
  Vue.prototype.$.get({
    carId: params.carId,
    type: params.type,
    methodName: 'StartCarCheck'
  }).then((response)=>{

    success && success(makeData(JSON.parse(response.data)))
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
