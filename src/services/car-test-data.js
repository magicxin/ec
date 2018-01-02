import calcMethod from 'utilities/calc-method'
// import carTestData from 'native/services/car-test-data'
import responseHandler from './response-handler'
// import apiHost from 'settings/api-host'

export default function(params,success,fail){
	let getData=calcMethod({ 
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    // native:carTestData,
	    browser(params){
			return Promise.resolve({
					data:{
						// resultCode:100,
						resultCode:-2,
						errorMessage:'检测失败',
						isTestData:true,
						score:90,
						falutCount:2,
						testTime:'2017-03-12 13:00',
						isHistory:true,
						faults:[
							{
								text:'测试故障分类1',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
							{
								text:'测试故障分类2',
								count:0,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类3',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类4',
								count:0,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类5',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类6',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类7',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类8',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
											{
								text:'测试故障分类9',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							},
							{
								text:'测试故障分类10',
								count:2,
								path:'/carDiag/1/content/864.jhtml'
							}
						]
					}
			})
	    }
	})
	function makeData(originalData){
		console.log(originalData)
		let faultText={
			0:'故障诊断'
		}
		if(originalData.isTestData){
			return originalData
		}else{
			return {
				score:originalData.score || 0,
				falutCount:originalData.count ? parseInt(originalData.count,10) : 0,
				testTime:originalData.happenDate || '未知',
				faults:originalData.carFaults ? originalData.carFaults.map((fault)=>{
					return {
						text:faultText[fault.type],
						count:fault.count,
						// path:apiHost.dynamicHost.get()+fault.path
						path:this.addPath(ault.path)
					}
				}) : []
			}			
		}
	}

	getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
}



// export default function(params,success,fail){
// 	setTimeout(()=>{
// 		success && success({
// 			falutCount:2,
// 			testTime:'2017-03-12 13:00',
// 			isHistory:true,
// 			faults:[
// 				{
// 					text:'测试故障分类1',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 				{
// 					text:'测试故障分类2',
// 					count:0,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类3',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类4',
// 					count:0,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类5',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类6',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类7',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类8',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 								{
// 					text:'测试故障分类9',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				},
// 				{
// 					text:'测试故障分类10',
// 					count:2,
// 					path:'/carDiag/1/content/864.jhtml'
// 				}
// 			]
// 		})
// 	},1000)
// }