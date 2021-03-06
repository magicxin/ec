import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'
export default function(params){
	return new Promise((resolve,reject)=>{
		bridge().then((bridge)=>{
			bridge.callHandler('data_stopTerminalLive', params, function(response) {
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
