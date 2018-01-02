import calcMethod from 'utilities/calc-method'
import terminalFileSubmit from 'native/services/terminal-file-submit'
import responseHandler from './response-handler'


export default {
	submit:calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native(params,success,fail){ 
	    	function makeData(originalData){
	    		if(parseInt(originalData.download,10)<100){
	    			return {
	    				submitPercent:Math.floor(parseInt(originalData.download,10)/2)
	    			}
	    		}else{
	    			return {
	    				submitPercent:50+Math.floor(parseInt(originalData.flash,10)/2)
	    			}
	    		}
			}

	    	terminalFileSubmit(params,responseHandler.success(success,fail,makeData),responseHandler.error(fail))
	    }, 

	    browser(params,success,fail){
			setTimeout(()=>{
				success && success({submitPercent:50})
				setTimeout(()=>{
					success && success({submitPercent:100})
				},1000)
			},1000)	
	    }
	}),
	cancel(){
		
	}
}








// export default {
// 	submit(params,success,fail){
// 		console.log(params)
// 		setTimeout(()=>{
// 			success && success({submitPercent:50})
// 			setTimeout(()=>{
// 				success && success({submitPercent:100})
// 			},1000)
// 		},1000)
// 	},
// 	cancel(){

// 	}
// }