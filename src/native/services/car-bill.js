import bridge from 'native/settings/bridge' 
import dataMaker from './common-data-maker'
function makeData(originalData){
  return originalData.map((data,index) => {
            return {
                data:data.data,                
            }
        })
}
export default function(params){
	return new Promise((resolve,reject)=>{
		bridge().then((bridge)=>{
			bridge.callHandler('router_takePhoto', params, function(response) {
				// alert(response)
				// let data=response ? JSON.parse(response) : {}
				// return Promise.resolve({userId:data.userId,shop:{id:data.shopId}})
				// resolve({data:data})
				resolve(response)
			})
		},(err)=>{
			// return Promise.reject(err)
			reject(err)
		})
	})
}
