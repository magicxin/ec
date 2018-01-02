// import uris from './uris'
import Vue from 'vue'
import fuckingErrorMessage from 'services/fucking-error-message'
export default function(params, success, fail) {
    var getUserMessaage = JSON.parse(localStorage.getItem("user"));
    Vue.prototype.$.get(uris.oneKeyHelp.refuse({
      "refuse" : {
        resuceId : "",
        /** 提供救援者id */
        workerId : "",
        /** 原因 */
        reason : "",
        /** 备注 */
        remarks : ""
      },
       "methodName" : 'CreateMemberServiceRefuse',
       "shopId" : getUserMessaage.shop.Id,
       "userId" : getUserMessaage.userId,
       // "clientType" : 3
    })).then((response)=>{
    	console.log(response);
    	let data = response.data;
		  if (data.resultCode == 100) {
            success && success(response)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
}