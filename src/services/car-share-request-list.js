import bindedCarList from './binded-car-list'
// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'
function getCarShareRequest(params){
	function makeUserData(originalData){
		return originalData.map((user)=>{
			return {
				applyId:user.applyId,
				userHead:user.head,
				userName:user.name.split(' ')[0],
				requestDate:user.modifyDate
			}
		})
	}
	function makeData(originalData){
		return {
			carId:params.carId,
			agreed:makeUserData(originalData.authorizedCarApplyDatas),
			notAgreed:makeUserData(originalData.unauthorizedCarApplyDatas)
		}
	}
	return new Promise((resolve,reject)=>{
		params['methodName'] = 'ListCarApply'		
		Vue.prototype.$.get(params)
		.then(responseHandler.success((makedData)=>{
			resolve(makedData)
		},reject,makeData),responseHandler.error(reject))		
	})
}
export default function(params,success,fail){
	bindedCarList.bind(this)({},(cars)=>{
		let promises=[]
		cars.cars.forEach((car)=>{
			promises.push(getCarShareRequest.bind(this)({carId:car.id}))
		})
		Promise.all(promises)
		.then((values)=>{
			let carsWithRequests=[]
			values.forEach((request)=>{
			  if(!!request.agreed.length || !!request.notAgreed.length){
				carsWithRequests.push((()=>{
					let targetCar=null
					cars.cars.some((car)=>{
						if(car.id==request.carId){
							targetCar=car
							targetCar.requests=request
							return true
						}
					})
					return targetCar
				})())
			  }	
			})
			console.log(carsWithRequests)
			success && success(carsWithRequests)
		},(err)=>{
			fail && fail(err)	
		})
	},(err)=>{
		fail && fail(err)
	})
}