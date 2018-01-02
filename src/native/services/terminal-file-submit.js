import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'
export default function(params,success,fail){
		return new Promise((resolve,reject)=>{

			bridge().then((bridge)=>{
				bridge.registerHandler(params.type=='ecu' ? 'data_calibrationProgress' : 'data_bootUpdateProgress', function(data, responseCallback) {


					success ? success(dataMaker(data)) : resolve(dataMaker(data))
					responseCallback && responseCallback()
				})	
				bridge.callHandler(params.type=='ecu' ? 'data_startCalibration' : 'data_startBootUpdate', params, function(response) {
					// success ? success(dataMaker(response)) : resolve(dataMaker(response))
					console.log((params.type=='ecu' ? 'data_startCalibration' : 'data_startBootUpdate')+' called from js')
				})

			},(err)=>{
				// return Promise.reject(err)
				fail ? fail(err) : reject(err)
				
			})
		})
}