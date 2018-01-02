//  import uris from 'services/uris'
import Vue from 'vue'
import responseHandler from './response-handler'
export default function(params, success, fail) {
	 // this.$http.get(uris.carBill.deleteCarCost(params)).then((response)=>{     
	 //      console.log(JSON.parse(response.data))
	 //      success && success(JSON.parse(response.data))
	 //    },(response)=>{
	 //      fail && fail(response.errorMessage || '错误：'+response.resultCode)
	 // })
	 params['methodName'] = 'DeleteCarCost'
	 Vue.prototype.$.get(params).then(responseHandler.success(success,fail),responseHandler.error(fail))
}