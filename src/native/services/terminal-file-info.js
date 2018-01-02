import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'
export default function(params){
	return new Promise((resolve,reject)=>{
		bridge().then((bridge)=>{
			bridge.callHandler(params.type=='ecu' ? 'data_getCalibrationInfo' : 'data_getBootInfo', params, function(response) {
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
