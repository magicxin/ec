import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'
export default {
	download(params,success,fail){
		return new Promise((resolve,reject)=>{
			bridge().then((bridge)=>{
				bridge.registerHandler(params.type=='ecu' ? 'data_downloadCalibrationProgress' : 'data_downloadBootProgress', function(data, responseCallback) {
					success ? success(dataMaker(data)) : resolve(dataMaker(data))
					responseCallback && responseCallback()
				})	

				bridge.callHandler(params.type=='ecu' ? 'data_downloadCalibration' : 'data_downloadBoot', params, function(response) {
					// success ? success(dataMaker(response)) : resolve(dataMaker(response))
					console.log((params.type=='ecu' ? 'data_downloadCalibration' : 'data_downloadBoot')+' called from js')
				})

			},(err)=>{ 
				// return Promise.reject(err)
				fail ? fail(err) : reject(err)
				
			})
		})
	},
	cancel(params){
		return new Promise((resolve,reject)=>{
			bridge().then((bridge)=>{
				bridge.callHandler(params.type=='ecu' ? 'data_stopDownloadCalibration' : 'data_stopDownloadBoot', params, function(response) {
					// let data=response ? JSON.parse(response) : {}
					// return Promise.resolve({userId:data.userId,shop:{id:data.shopId}})
					// resolve({data:data})
					resolve(dataMaker(response))
					
				})
			},(err)=>{
				// return Promise.reject(err)
				reject(err)
			})
		})
	}
}