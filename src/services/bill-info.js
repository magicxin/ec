import Vue from 'vue'
import responseHandler from './response-handler'
export default function(params, success, fail) {
        params.carId = this.$.carId
       if(params.carId!=''&&params.carId!=null&&params.carId!=null&&params.carId!=undefined){
         params['methodName'] = 'QueryCarCostStatistics'
         Vue.prototype.$.get(params)
           .then((response) => {
             success && success(response.data)
           }, (response) => {
             fail && fail(response.errorMessage || '错误：' + response.resultCode)
           })
      }else{
        this.$.toast('您尚未绑定车辆')
      }   
}
