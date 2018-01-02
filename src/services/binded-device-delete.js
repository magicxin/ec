// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default function(params,success,fail){
	params['methodName'] = 'CarTerminalUnbinding'
	Vue.prototype.$.get(params)
	.then(responseHandler.success(success,fail),responseHandler.error(fail))
}