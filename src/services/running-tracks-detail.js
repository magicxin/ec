// import uris from 'services/uris'
import Vue from 'vue'
import gpsConvertor from 'utilities/gps-convertor'
function makeData(originalData){
return new Promise((resolve,reject)=>{
  let originalPoints=originalData.map((point)=>{
    return {
      lat:parseFloat(point.latitude),
      lng:parseFloat(point.longitude)
    }
  })

  gpsConvertor({
      points:originalPoints               
  }).then((makedPoints)=>{
      originalData.forEach((originalPoint,index)=>{
        originalPoint.latitude=makedPoints[index].lat
        originalPoint.longitude=makedPoints[index].lng
      })
        resolve(originalData)      
  },(err)=>{
        reject(err)
      //errorHandler(err)
  })       
})

}
function successHandler(data){

}
export default function(params, success, fail) {
  params['methodName'] = 'QueryCarTrack'
  Vue.prototype.$.get(params).then((response)=>{
    let data = response.data
               makeData(data.parkings) 
               makeData(data.drivingActions) 
                if (data.resultCode == 100) {
                    success && success(data)
                } else {
                    fail && fail(data.resultCode)
                }
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
