// import uris from './uris'
import Vue from 'vue'
//import responseHandler from './response-handler'
	// var result={
	// 	"resultcode":"200",
	// 	"reason":"查询成功",
	// 	"result":{
	// 		"province":"HB",
	// 		"city":"HB_HD",
	// 		"hphm":"冀DHL327",
	// 		"hpzl":"02",
	// 		"lists":[
	// 			{
	// 			"date":"2013-12-29 11:57:29",
	// 			"area":"316省道53KM+200M",
	// 			"act":"16362 : 驾驶中型以上载客载货汽车、校车、危险物品运输车辆以外的其他机动车在高速公路以外的道路上行驶超过规定时速20%以上未达50%的",
	// 			"code":"",
	// 			"fen":"6",
	// 			"money":"100",
	// 			"handled":"0"
	// 			},
	// 			{
	// 			"date":"2013-12-30 11:57:29",
	// 			"area":"316省道53KM+200M",
	// 			"act":"16362 : 驾驶中型以上载客载货汽车、校车、危险物品运输车辆以外的其他机动车在高速公路以外的道路上行驶超过规定时速20%以上未达50%的",
	// 			"code":"",
	// 			"fen":"6",
	// 			"money":"100",
	// 			"handled":"0"
	// 			}
	// 		]
	// 	}
	// }
export default function(params, success, fail) {
    // setTimeout(()=>{
    // 	success && success(result.result.lists)
    // 	// fail && fail('asdf')
    // },1000)
	console.log(params)
	params['methodName'] = 'EditCar'
    Vue.prototype.$.get(params).then((response)=>{
    	let data = JSON.parse(response.data)
    	console.log(response.data)
        if (data.resultCode == 100) {
            success && success(data.car)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
		console.log('response')
    })
}
