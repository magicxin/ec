// import uris from './uris'
import Vue from 'vue'
export default function(params, success, fail) {
  function makeData(originalData){
    function fillCarInfo(drivingRecord){
      if (drivingRecord.type == '0') {
        return {id:drivingRecord.id,beginTime:drivingRecord.beginTime,beginAddress:drivingRecord.beginAddress,picture:drivingRecord.picture,type:drivingRecord.type,timeLength:drivingRecord.timeLength}
      } else {
        return {id:drivingRecord.id,beginTime:drivingRecord.beginTime,beginAddress:drivingRecord.beginAddress,cover:drivingRecord.cover,file:drivingRecord.file,type:drivingRecord.type,timeLength:drivingRecord.timeLength}
      }
    }
    if( typeof originalData.drivingRecords =='undefined' || originalData.drivingRecords == null){
      return []
    }
    return {
      listDrivingRecord:originalData.drivingRecords.map((drivingRecord)=>{
        return fillCarInfo(drivingRecord)
      })
    }
  }
  Vue.prototype.$.get({
    carId: params.carId,
    beginTime: params.beginTime,
    count: params.count,
    methodName: 'ListDrivingRecord'
  }).then((response)=>{
    success && success(makeData(response.data))
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
