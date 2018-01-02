// import uris from 'services/uris'
import Vue from 'vue'
export default function(params, success, fail) {
  console.log(params)
  params['methodName'] = 'DrivingStatisticsRequest'
  Vue.prototype.$.get(params).then((response)=>{
    console.log(response.data)
    let data = response.data  
                if (data.resultCode == 100) {
                    success && success(data)
                } else {
                    fail && fail(data.resultCode)
                }
  },(response)=>{
  	fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
