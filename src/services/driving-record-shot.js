// import uris from './uris'
import Vue from 'vue'
export default function(params, success, fail) {
  Vue.prototype.$.get({
    carId: params.carId,
    type: params.type,
    channelType: params.channelType,
    methodName: 'DrivingRecordShot'
  }).then((response)=>{
    success && success(JSON.parse(response.data))
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
