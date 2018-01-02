// import uris from 'services/uris'
import Vue from 'vue'
// import calcMethod from 'utilities/calc-method'
// import nativeCarInfo from 'native/services/car-info'
// import carBill from 'native/services/car-bill'
export default function(params, success, fail) {
  /*
  calcMethod({
      // native:nativeCarInfo, 
      browser(){
        return Promise.resolve({data:{carId:767}})
      }
  })
  */
  Vue.prototype.$.push('data_carInfo',{data:{carId:767}})
  .then((data)=>{
      console.log(data)
      //alert(data.data.carId)
      params.carId = data.data.carId
      params['methodName'] = 'QueryCarInfo'
      Vue.prototype.$.get(params).then((response)=>{
        success && success(JSON.parse(response.data))
      },(response)=>{
        fail && fail(response.errorMessage || '错误：'+response.resultCode)
      })
    })    
}
