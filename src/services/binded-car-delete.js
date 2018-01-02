// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default function(params,success,fail){
	Vue.prototype.$.get({carId:params.id,methodName:'RemoveCar'})
	.then(responseHandler.success(success,fail),responseHandler.error(fail))
}