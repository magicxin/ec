import calcMethod from 'utilities/calc-method'
import terminalDataFlowCancel from 'native/services/terminal-data-flow-cancel'
import responseHandler from './response-handler'

export default function(params,success,fail){
	let getData=calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native:terminalDataFlowCancel, 
	    browser(params){
	    	console.log('data flow cancel')
			return Promise.resolve({
					data:{
						resultCode:100,
						isTestData:true
					}
			})
	    }
	})

	getData(params).then(responseHandler.success(success,fail),responseHandler.error(fail))
}



// export default function(params,success,fail){
// 	console.log('data flow cancel')
// 	success && success()
// } 