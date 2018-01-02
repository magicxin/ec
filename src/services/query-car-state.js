// import uris from './uris'
import Vue from 'vue'
// import apiHost from 'settings/api-host'
export default function(params, success, fail) {
  function makeData(originalData){
    return {
      carId: originalData.carId,
      plateNumber: originalData.plateNumber,
      vin: originalData.vin,
      happenDate: originalData.happenDate,
      speed: originalData.speed,
      direction: originalData.direction,
      latitude: originalData.latitude,
      longitude: originalData.longitude,
      driverName: originalData.driverName,
      driverTEL: originalData.driverTEL,
      runningStatus: originalData.runningStatus,
      address: originalData.address,
      rotatedSpeed: originalData.rotatedSpeed,
      latBaidu: originalData.latBaidu,
      lngBaidu: originalData.lngBaidu,
      creatorId: originalData.creatorId,
      creatorName: originalData.creatorName,
      deviceStatus: originalData.deviceStatus,
      drivingState: originalData.drivingState,
      // brandLogo: apiHost.dynamicHost.get()+originalData.brandLogo
      brandLogo: this.addPath(originalData.brandLogo)
    }
  }
  Vue.prototype.$.get({
    carId: params.carId,
    methodName: 'QueryCarState'
  }).then((response)=>{
    let responseData = response.data
    // console.log(responseData)
    if (responseData.resultCode != '100') {
      fail && fail(response.errorMessage || '错误：'+response.resultCode)
    } else {
      success && success(makeData(responseData))
    }
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
