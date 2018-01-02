import calcMethod from 'utilities/calc-method'
import terminalFileInfo from 'native/services/terminal-file-info'
import responseHandler from './response-handler'
// import apiHost from 'settings/api-host'

export default function(params,success,fail){
	let getData=calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native:terminalFileInfo, 
	    browser(params){
			return Promise.resolve({
					data:{
						resultCode:100,
						isTestData:true,
						fileName:'test net file name',
					  	fileImg:'',
					  	fileVersion:'test net file description',
					  	fileDate:'test net file release date',
					  	fileMoney:'test net file money info',
					  	fileSize:'test net file size',
					  	fileDescription:'test net file description'
					}
			})
	    }
	}) 
	function makeData(originalData){
		if(originalData.isTestData){
			return originalData
		}else{
			return {
				fileName:originalData.name,
				// fileImg:originalData.logo ? apiHost.dynamicHost.get()+originalData.logo : '',
				fileImg:originalData.logo ? this.addPath(originalData.logo) : '',
				fileVersion:originalData.version,
				fileDate:originalData.time || originalData.modifyDate,
				fileMoney:originalData.price,
				fileSize:originalData.length,
				fileDescription:originalData.description				
			}
		}
	}

	getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
}



// export default function(params,success,fail){
// 	setTimeout(()=>{
// 		success && success({
// 			fileName:'test net file name',
// 		  	fileImg:'',
// 		  	fileVersion:'test net file description',
// 		  	fileDate:'test net file release date',
// 		  	fileMoney:'test net file money info',
// 		  	fileSize:'test net file size',
// 		  	fileDescription:'test net file description'
// 		})
// 	},1000)
// }