import calcMethod from 'utilities/calc-method'
import carBill from 'native/services/car-bill'
import responseHandler from './response-handler'

export default function(params,success,fail){
	// let getData=calcMethod({
	//     // ios:iosLoginStatus,
	//     // android:androidLoginStatus,
	//     // wechat:getLocation,
	//     native:carBill, 
	//     browser(params){
	//     	console.log('data flow cancel')
	// 		return Promise.resolve({
	// 				data:{
	// 					resultCode:100,
	// 					isTestData:true
	// 				}
	// 		})
	//     }
	// })
	// getData(params).then(success,fail)
	Vue.prototype.$.push('router_takePhoto', params, function (response) {
		alert(response);
		// let data=response ? JSON.parse(response) : {}
		// return Promise.resolve({userId:data.userId,shop:{id:data.shopId}})
		// resolve({data:data})
		resolve(response)
	})
}