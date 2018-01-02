import calcMethod from 'utilities/calc-method'
import terminalDataFlowItems from 'native/services/terminal-data-flow-items'
import responseHandler from './response-handler'

export default function(params,success,fail){
	let getData=calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native:terminalDataFlowItems, 
	    browser(params){
			return Promise.resolve({
					data:{
						resultCode:100,
						isTestData:true,
						classifies:[{id:'all',text:'全部'},{id:'selected',text:'已选择'},{id:'ofenUsed',text:'常用'},{id:'others',text:'其他'}],
						items:(()=>{
							let i=150,items=[]
							while(i>=0){
								items.push({id:'test_item_id_'+i,text:'测试指标项'+i,belongs:'all,'+(i%2==0 ? 'ofenUsed' : 'others')})
								i--
							}
							return items
						})()
					}
			})
	    }
	})
	function makeData(originalData){
		if(originalData.isTestData){
			return originalData
		}else{
			let classifyTexts=[],items=[],classifies=[]
			originalData.forEach((item)=>{
				if(item.parentId && classifyTexts.indexOf(item.parentId)==-1){
					classifyTexts.push(item.parentId)
				}
				items.push({
					id:item.id,
					text:item.description_China,
					belongs:'全部'+(item.parentId ? ','+item.parentId : '')+(item.isDefaultSelected==1 ? ',selected' : '')+(item.isCommonlyUsed==1 ? ',常用' : '')
				})
			})
			classifyTexts=classifyTexts.sort()
			classifyTexts.unshift('已选择')
			classifyTexts.unshift('常用')
			classifyTexts.unshift('全部')
			classifies=classifyTexts.map((classifyText)=>{
				return {
					id:classifyText=='已选择' ? 'selected' : classifyText,
					text:classifyText
				}
			}) 
			return {
				classifies:classifies,
				items:items
			}
		}
	}

	getData(params).then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))
}

// export default function(params,success,fail){
// 	console.log(params)
// 	setTimeout(()=>{
// 		success && success({
// 			classifies:[{id:'all',text:'全部'},{id:'selected',text:'已选择'},{id:'ofenUsed',text:'常用'},{id:'others',text:'其他'}],
// 			items:(()=>{
// 				let i=150,items=[]
// 				while(i>=0){
// 					items.push({id:'test_item_id_'+i,text:'测试指标项'+i,belongs:'all,'+(i%2==0 ? 'ofenUsed' : 'others')})
// 					i--
// 				}
// 				return items
// 			})()
// 		})	
// 	},1000)
// }