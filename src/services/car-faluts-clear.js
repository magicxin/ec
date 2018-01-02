import calcMethod from 'utilities/calc-method'
// import carFaultsClear from 'native/services/car-faults-clear'
import responseHandler from './response-handler'

export default function(params,success,fail){
	let getData=calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    // native:carFaultsClear,
	    browser(params){
			return Promise.resolve({
					data:{
						resultCode:100,
						isTestData:true,
						successCount:2
					}
			})
	    }
	})
	function makeData(originalData){
		if(originalData.isTestData){
			return originalData
		}else{
			return {
				successCount:originalData.successCount || 0
			}			
		}
	}

	getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
}





// export default function(params,success,fail){
// 	setTimeout(()=>{
// 		success && success({successCount:2})
// 	},1000)
// } 