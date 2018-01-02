import calcMethod from 'utilities/calc-method'
import terminalDataFlowUpload from 'native/services/terminal-data-flow-upload'
import responseHandler from './response-handler'

export default function(params,success,fail){
	let getData=calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native:terminalDataFlowUpload, 
	    browser(params){
			return Promise.resolve({
					data:{
						resultCode:100,
						isTestData:true
					}
			})
	    }
	})
	function makeData(originalData){
		if(originalData.isTestData){
			return originalData
		}else{
			return originalData
		}
	}

	getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
}


// export default function(params,success,fail){
// 	setTimeout(()=>{
// 		success && success()
// 	},1000)
// } 