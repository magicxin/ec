// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'

export default {
	add:function(params,success,fail){
		Vue.prototype.$.get({applyId:params.id,methodName: 'AgreeCarApply',})
		.then(responseHandler.success(success,fail),responseHandler.error(fail))
	},
	delete:function(params,success,fail){
		Vue.prototype.$.get({applyId:params.id,methodName: 'RejectCarApply',})
		.then(responseHandler.success(success,fail),responseHandler.error(fail))
	}
}