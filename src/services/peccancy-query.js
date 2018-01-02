// import uris from './uris'

export default function(params, success, fail) {
    console.log(params)

    this.$.get({
        dtype: 'json',
        city: params.city,
        hphm: params.carId,
        hpzl: '02',
        engineno: params.carEngine,
		classno: params.carCode,
		methodName:'QueryTrafficViolation'
    }).then((response)=>{
		let data=response.data,
          	errorInfo=data.errorInfo || (data.resultCode==307 ? '本周查询次数超限' : '')
        if(errorInfo){
        	fail && fail(errorInfo,data.resultCode)
        }else{
        	success && success(typeof data.trafficViolatio=='string' ? JSON.parse(data.trafficViolatio).lists : data.trafficViolatio.lists,data.resultCode==307)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
}
