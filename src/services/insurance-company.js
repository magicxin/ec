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
export default function(params, success, fail) {
    // setTimeout(() => {
    //     success && success(JSON.parse(JSON.stringify(testData)))
    //     // fail && fail('error')
    // }, 1000)

    Vue.prototype.$.get({
      methodName: 'ListInsurance'
  })
  .then((response)=>{
  	console.log(response.data)
  	success && success(response.data)

  },(response)=>{
  	fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
