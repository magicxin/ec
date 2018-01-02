import calcMethod from 'utilities/calc-method'
import terminalParamsData from 'native/services/terminal-params-data'
import responseHandler from './response-handler'

export default {
	get(params,success,fail){
		let getData=calcMethod({
		    // ios:iosLoginStatus,
		    // android:androidLoginStatus,
		    // wechat:getLocation,
		    native:terminalParamsData.get,
		    browser(params){
				return Promise.resolve({
						data:{
							// resultCode:100,
							resultCode:-2,
							errorMessage:'读取参数失败',
							isTestData:true,
							cardNumber:139888877771,
							cardIndex:'001100',
							ip:'192.168.20.9',
							port:'8899',
							terminalType:'001',
							terminalTypeText:'测试终端类型1',
							carBrand:'吉AUN778',
							terminalTypes:[
								{text:'测试终端类型1',type:'001',selected:true},
								{text:'测试终端类型2',type:'002',selected:false}
							]
						}
				})
		    }
		})
		function makeData(originalData){
			if(originalData.isTestData){
				return originalData
			}else{
				let terminalTypeTexts={
					1:'BOSCH',
					2:'FEUP'
				}
				return {
					cardNumber:originalData.sim_numer,
					cardIndex:originalData.Ecu_Number,
					ip:originalData.IP,
					port:originalData.Port,
					terminalType:originalData.Ecu_Mode,
					terminalTypeText:terminalTypeTexts[originalData.Ecu_Mode],
					carBrand:originalData.Plate,
					terminalTypes:(()=>{
						let i,
							types=[]
						for(i in terminalTypeTexts){
							types.push({text:terminalTypeTexts[i],type:i,selected:originalData.Ecu_Mode==i})
						}
						return types
					})()
				}			
			}
		}

		getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
	},
	post(params,success,fail){
		let postData=calcMethod({
		    // ios:iosLoginStatus,
		    // android:androidLoginStatus,
		    // wechat:getLocation,
		    native:terminalParamsData.post,
		    browser(params){
				return Promise.resolve({data:{resultCode:100}})
		    }
		})
		postData(params).then(responseHandler.success(success,fail),responseHandler.error(fail))
	}
}





// export default function(params,success,fail){
// 	setTimeout(()=>{
// 		success && success({successCount:2})
// 	},1000)
// } 
// export default {
// 	get(params,success,fail){
// 		setTimeout(()=>{
// 			success && success({
// 				cardNumber:139888877771,
// 				cardIndex:'001100',
// 				ip:'192.168.20.9',
// 				port:'8899',
// 				terminalType:'001',
// 				terminalTypeText:'测试终端类型1',
// 				carBrand:'吉AUN778',
// 				terminalTypes:[
// 					{text:'测试终端类型1',type:'001',selected:true},
// 					{text:'测试终端类型2',type:'002',selected:false}
// 				]
// 			})
// 		},1000)
// 	},
// 	post(params,success,fail){
// 		console.log(params)
// 		setTimeout(()=>{
// 			success && success()
// 		},1000)
// 	}
// }