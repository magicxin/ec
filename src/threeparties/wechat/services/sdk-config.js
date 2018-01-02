import Vue from 'vue'
import loginStatus from 'threeparties/wechat/services/login-status'
import fuckingErrorMessage from 'services/fucking-error-message'
import uris from 'threeparties/wechat/services/uris'
import calcUriParams from 'utilities/calc-uri-params'

export default function(success,fail){

	// let userInfo=loginStatus.userInfo()

	Vue.http.get(uris.sdkConfig({
		urlInfo:location.href.split('#')[0],
		// shopId:userInfo && userInfo.shop ? userInfo.shop.id : '',
		wechatOpenId:calcUriParams.getUriQuery().state
	})).then((response)=>{
		let data=JSON.parse(response.data)
		if(data.resultCode==100){
			success && success(data)
		}else{
			fail && fail(fuckingErrorMessage[data.resultCode])
		}
	},(response)=>{
		fail && fail()
	})
}
