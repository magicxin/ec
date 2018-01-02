import calcMethod from 'utilities/calc-method'
import terminalDataFlowData from 'native/services/terminal-data-flow-data'
import responseHandler from './response-handler'


export default calcMethod({
	    // ios:iosLoginStatus,
	    // android:androidLoginStatus,
	    // wechat:getLocation,
	    native(params,success,fail){
	    	function makeData(originalData){
	    		return originalData.map((item)=>{
	    			let text=''
	    			params.items.some((paramItem)=>{
						if(item.id==paramItem.id){
							item.text=paramItem.text
							text=paramItem.text
							return true								
						}
					})
	    			return {
	    				id:item.id,
	    				type:item.type,
	    				unit:item.unit,
	    				values:item.values!='null' ? item.values : '',
	    				value:item.value.map((valueItem,index)=>{
	    					return {
	    						x:index,
	    						y:valueItem || '--'
	    					}
	    				}),
	    				text:item.text || text
	    			}
	    		})
			}
	    	terminalDataFlowData(params.items.map((item)=>{return item.id}),responseHandler.success(success,fail,makeData),responseHandler.error(fail))
	    }, 

	    browser(params,success,fail){
				function makeData(originalData){
					originalData.forEach((item)=>{
						params.items.some((paramItem)=>{
							if(item.id==paramItem.id){
								item.text=paramItem.text
								return true								
							}
						})

						item.value.push({x:item.value[item.value.length-1].x+1,y:item.value[Math.ceil(Math.random()*item.value.length-1)].y})
					})
					return originalData
				}

				var data=[ 
					{id:'test_item_id_150',type:'value',unit:'km/h',value:[{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]},
					{id:'test_item_id_149',type:'value',unit:'kpa',value:[{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]},
					{id:'test_item_id_148',type:'value',unit:'ci/h',value:[{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]},
					{id:'test_item_id_147',type:'value',unit:'k/h',value:[{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]},
					{id:'test_item_id_146',type:'value',unit:'m/h',value:[{x:0,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:6},{x:7,y:7}]},
					{id:'test_item_id_145',type:'status',values:{1:'熄火',2:'点火',3:'怠速'},value:[{x:0,y:1},{x:1,y:2},{x:2,y:3}]}
				]

				setInterval(()=>{
					success && success(makeData(data))
				},500)
	    }
	})



