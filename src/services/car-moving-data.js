// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'
import calcMethod from 'utilities/calc-method'
// import nativeCarInfo from 'native/services/car-info'

let static_data={
	lineCategories:[{
		value:'1',label:'扭矩控制模式'
	},{
		value:'2',label:'驾驶员需求扭矩百分比'
	},{
		value:'3',label:'发动机实际扭矩百分比'
	},{
		value:'4',label:'发动机转速'
	},{
		value:'5',label:'加速踏板低怠速开关'
	},{
		value:'6',label:'加速踏板Kickdown开关'
	},{
		value:'7',label:'驻车控制器开关'
	},{
		value:'8',label:'巡航控制开关激活状态'
	},{
		value:'9',label:'制动踏板状态'
	},{
		value:'10',label:'离合器开关信号'
	},{
		value:'11',label:'油门踏板位置'
	},{
		value:'12',label:'当前速度下负载百分比'
	},{
		value:'13',label:'名义摩擦力矩百分比'
	},{
		value:'14',label:'尿素液位'
	},{
		value:'15',label:'输出轴转速'
	},{
		value:'16',label:'车速'
	},{
		value:'17',label:'日里程'
	},{
		value:'19',label:'目标档位'
	},{
		value:'20',label:'实际速比'
	},{
		value:'21',label:'当前档位'
	},{
		value:'22',label:'怠速油耗'
	},{
		value:'23',label:'实时油耗'
	},{
		value:'25',label:'发动机水温'
	},{
		value:'26',label:'机油压力'
	},{
		value:'27',label:'基于车轮的车速'
	},{
		value:'28',label:'发动机负荷'
	}
	// ,{
	// 	value:'29',label:'外特征'
	// }
	],
	barCategories:[{label:'1',value:'1'},{label:'2',value:'2'}]
}

static_data.defaultLineCategory=static_data.lineCategories[0].value
static_data.defaultBarCategory=static_data.barCategories[0].value



export default {
	staticData:static_data,
	get(params,success,fail){
		console.log(params)
		function makeInfoData(originalData){
			return {
				totalMovingRange:originalData.totalMileage,
				dayMovingRange:originalData.dayMileage,
				totalFuelCost:originalData.totalConsumption,
				ureaLevel:originalData.ureaLevel	
			}
		}
		function makeLineData(originalData){
			let makedData={
				lineUnitX:'点数',
				lineUnitY:'',
				lineCategories:static_data.lineCategories,
				lineData:[],
				lineLabelsX:[],
				lineType:originalData.type
			}
			originalData.data.forEach((item,index)=>{
				makedData.lineData.push({x:index,y:Number(item.value)})
				makedData.lineType=='value' ? makedData.lineUnitY=originalData.unit : makedData.lineType=='state' ? makedData.lineLabelsX=originalData.unit.replace(/\d*:/g,'').split(',') : ''
			})
			console.log(makedData)
			return makedData
		}

		calcMethod({
			// native:nativeCarInfo,
			browser(){
				return Promise.resolve({data:{carId:1086}})
			}
		})().then((data)=>{
			console.log(data)
			// alert(data.data.carId)
			switch(params.type){
				case 'info':
				  // setTimeout(()=>{
				  // 	success && success(JSON.parse(JSON.stringify({
					 //  		totalMovingRange:'1000',
						// 	dayMovingRange:'1500',
						// 	totalFuelCost:'1200',
						// 	ureaLevel:'1300'
						// })))
				  // 	},2000)
				  Vue.prototype.$.get({
				  	beginTime:params.start,
				  	endTime:params.end,
				  	category:4,
					carId:data.data.carId,
					methodName: 'QueryDrivingData'
				  }).then(responseHandler.success(success,fail,makeInfoData),responseHandler.error(fail))
				  break
				case 'line':
					Vue.prototype.$.get({
						beginTime:params.start,
						endTime:params.end,
						category:0,
						type:params.category,
						carId:data.data.carId,
						methodName: 'QueryDrivingData'
					}).then(responseHandler.success(success,fail,makeLineData),responseHandler.error(fail))
					// setTimeout(()=>{
				 //  		success && success(JSON.parse(JSON.stringify({
					// 		lineUnitX:'x单位',
					// 		lineUnitY:'y单位',
					// 		lineCategories:[{label:'折线1',value:'1'},{label:'折线2',value:'2'}],
					// 		lineData: [12,234,45,23,45,23,4],
					// 		lineLabelsX:['1-1','1-2','1-3','1-4','1-5','1-6','1-7']
					//   	})))
				 //  	},2000)

				  break
				case 'bar':
					setTimeout(()=>{
				  		success && success(JSON.parse(JSON.stringify({
							barUnitX:'x单位',
							barUnitY:'y单位',
							barCategories:[{label:'柱状1',value:'1'},{label:'柱状2',value:'2'}],
							barData: [12,234,45,23,45,23,4],
							barLabelsX:['1-1','1-2','1-3','1-4','1-5','1-6','1-7'],
					  	})))
				  	},2000)
				  break
				case 'table':
					setTimeout(()=>{
				  		success && success(JSON.parse(JSON.stringify({tableItems:[
				  			{label:'title1',value:'value1'},	
				  			{label:'title2',value:'value2'}	
				  		]})))
				  	},2000)
				  break
				default:
				  fail && fail('不支持的数据类型')
			}
		},(err)=>{
			console.log(err)
		})




	}
}