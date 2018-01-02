import peccancyQueryCities from 'services/peccancy-query-cities'
import userInfo from 'services/user-info'

export default function(resolve,reject){
	Promise.all([peccancyQueryCities.bind(this)(),userInfo.bind(this)()])
	.then((values)=>{
		resolve({
			address:values[0],
			carInfo:values[1]
		})
	},(error)=>{
		alert(error)
		reject(error)
	})
}