// import uris from 'services/uris'
import Vue from 'vue'
// let testData = {
//     cars: [
//         { brandCode: '吉A11111', state: '行驶', logo: '' },
//         { brandCode: '吉A22222', state: '离线', logo: '' },
//         { brandCode: '吉A33333', state: '离线', logo: '' }
//     ],
//     friendCars: [
//         { brandCode: '吉A44444', state: '行驶', logo: '' },
//         { brandCode: '吉A55555', state: '离线', logo: '' }
//     ]
// }
function makeData(originalData){
	// console.log(originalData)
	function fillCarInfo(carInfo){
		return {
			id:carInfo.id,
			brandCode:carInfo.plateNumber || '未知',
			state:carInfo.deviceStatusText || '未知',
			logo:carInfo.brandLogo,
			terminals:carInfo.terminals || []
		}
	}
	return {
			cars:originalData.ownCars.map((car)=>{
				return fillCarInfo(car)
			}),
			friendCars:originalData.otherCars.map(car=>{
				return fillCarInfo(car)
			})
		}
} 
export default function(params, success, fail) {
    // setTimeout(() => {
    //     success && success(JSON.parse(JSON.stringify(testData)))
    //     // fail && fail('error')
    // }, 1000)
	
	Vue.prototype.$.get({
		methodName:'QueryCarInfoList'
 	})
  .then((response)=>{
	  // success && success(makeData(JSON.parse(response.data)))
	  success && success(makeData(response.data))
  },(response)=>{
  	fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
