// import uris from './uris'
import Vue from 'vue'
import fuckingErrorMessage from 'services/fucking-error-message'
export default function(params, success, fail) {
    var getUserMessaage = JSON.parse(localStorage.getItem("user"));
    //一键救援的请求，获取救援机构的列表
    Vue.prototype.$.get(uris.oneKeyHelp.review({
    	methodName : "OneKeyRescue",
    	clientType : 3,
    	shopId : getUserMessaage.shop.id,
       	provinceName : "吉林省",
       	userId : getUserMessaage.userId
    })).then((response)=>{
    	console.log(response);
    	let data = JSON.parse(response.data);
		  if (data.resultCode == 100) {
            success && success(response.data)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
}