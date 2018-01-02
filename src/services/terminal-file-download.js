import calcMethod from 'utilities/calc-method'
import terminalFileDownload from 'native/services/terminal-file-download'
import responseHandler from './response-handler'


export default {
	download:calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native(params,success,fail){
	    	function makeData(originalData){
	    		return {
	    			loadingPercent:parseInt(originalData.value,10)
	    		}
			}
	    	terminalFileDownload.download(params,responseHandler.success(success,fail,makeData),responseHandler.error(fail))
	    }, 

	    browser(params,success,fail){
			setTimeout(()=>{
				success && success({loadingPercent:50})
				setTimeout(()=>{
					success && success({loadingPercent:100})
				},1000)
			},1000)
	    }
	}),
	cancel:calcMethod({
		native:terminalFileDownload.cancel,
		browser(prams){
			console.log('download canceled')
		}
	})
}






// export default {
// 	download(params,success,fail){
// 		console.log(params)
// 		setTimeout(()=>{
// 			success && success({loadingPercent:50})
// 			setTimeout(()=>{
// 				success && success({loadingPercent:100})
// 			},1000)
// 		},1000)
// 	},
// 	cancel(){

// 	}
// }