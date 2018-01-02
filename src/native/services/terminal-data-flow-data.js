import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'


export default function(params,success,fail){

	return new Promise((resolve,reject)=>{

		bridge().then((bridge)=>{

			bridge.registerHandler('data_terminalFlowData', function(data, responseCallback) {
				// alert(data)
				success ? success(dataMaker(data)) : resolve(dataMaker(data))
				responseCallback && responseCallback()
			})	
			bridge.callHandler('data_getTerminalData', params, function(response) {
				console.log('data_getTerminalData called from js')
				// success ? success(dataMaker(response)) : resolve(dataMaker(response))
			})	

		},(err)=>{
			// return Promise.reject(err)
			fail ? fail(err) : reject(err)
		})

	})

}
