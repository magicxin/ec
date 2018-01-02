// import uris from 'services/uris'
import Vue from 'vue'
export default function(params, success, fail) {
  //console.log(params)
  params['methodName'] = 'CarMeter'
  Vue.prototype.$.get(params).then((response)=>{
    let data = response.data  
                if (data.resultCode == 100) {
                    success && success(data.carMeterData)
                } else {
                    fail && fail(data.resultCode)
                }
  },(response)=>{
  	fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
