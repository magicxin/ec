// import uris from 'services/uris'
import Vue from 'vue'
// import apiHost from 'settings/api-host'
function makeData(originalData,firstSortKey,secondSortKey,textKey,imageKey,parentText){
	let addedHeader={},data=[]
	originalData.sort((a,b)=>{
		let aAsiCode=a[firstSortKey].toUpperCase(),
			bAsiCode=b[firstSortKey].toUpperCase()
		if(aAsiCode<bAsiCode){
			return -1
		}else if(aAsiCode==bAsiCode){
			if(a[secondSortKey].toUpperCase()<b[secondSortKey].toUpperCase()){
				return -1
			}else{
				return 1
			}
		}else{
			return 1
		}
	})
	originalData.forEach((item)=>{
		if(!(item[firstSortKey] in addedHeader)){
			addedHeader[item[firstSortKey]]=true
			data.push({
				type:'subHeader',text:item[firstSortKey]
			})
		}
		data.push({
			text:item[textKey],
			parentText:parentText ? parentText : '',
			img:this.addPath(item[imageKey]) 
		})
	})
	return data
}
// function makeBrandsData(originalData){
// 	let addedHeader={},data=[]
// 	originalData.sort((a,b)=>{
// 		let aAsiCode=a.brandEnglish.toUpperCase(),
// 			bAsiCode=b.brandEnglish.toUpperCase()
// 		if(aAsiCode<bAsiCode){
// 			return -1
// 		}else if(aAsiCode==bAsiCode){
// 			if(a.brandName.toUpperCase()<b.brandName.toUpperCase()){
// 				return -1
// 			}else{
// 				return 1
// 			}
// 		}else{
// 			return 1
// 		}
// 	})
// 	originalData.forEach((item)=>{
// 		if(!(item.brandEnglish in addedHeader)){
// 			addedHeader[item.brandEnglish]=true
// 			data.push({
// 				type:'subHeader',text:item.brandEnglish
// 			})
// 		}
// 		data.push({
// 			text:item.brandName,
// 			img:apiHost.dynamicHost.get()+item.brandLogo
// 		})
// 	})
// 	return data
// }
// function makeSeriesData(originalData){
// 	let addedHeader={},data=[]
// 	originalData.sort((a,b)=>{
// 		let aAsiCode=a.manufacturer.toUpperCase(),
// 			bAsiCode=b.manufacturer.toUpperCase()
// 		if(aAsiCode<bAsiCode){
// 			return -1
// 		}else if(aAsiCode==bAsiCode){
// 			if(a.name.toUpperCase()<b.name.toUpperCase()){
// 				return -1
// 			}else{
// 				return 1
// 			}
// 		}else{
// 			return 1
// 		}
// 	})
// 	originalData.forEach((item)=>{
// 		if(!(item.manufacturer in addedHeader)){
// 			addedHeader[item.manufacturer]=true
// 			data.push({
// 				type:'subHeader',text:item.manufacturer
// 			})
// 		}
// 		data.push({
// 			text:item.name,
// 			img:apiHost.dynamicHost.get()+item.image
// 		})
// 	})
// 	return data

// }
function makeTypesData(originalData){
	return originalData.map((type)=>{
		return {
			text:type
		}
	})
}
function getBrands(success,fail){
	Vue.prototype.$.get({methodName: 'QueryCarBrand'})
	.then((response)=>{
		success && success(makeData(JSON.parse(response.data).brands,'brandEnglish','brandName','brandName','brandLogo'))
	},(response)=>{
		fail && fail('未知错误')
	})
}
function getSeries(params,success,fail){
	params['methodName'] = 'QueryCarSeries'
	Vue.prototype.$.get(params)
	.then((response)=>{
		success && success(makeData(JSON.parse(response.data).serieDatas,'manufacturer','name','name','image',params.brand))
	},(response)=>{
		fail && fail('未知错误')
	})
}
function getTypes(params,success,fail){
	params['methodName'] = 'QueryCarType'
	Vue.prototype.$.get(params)
	.then((response)=>{
		success && success(makeTypesData(JSON.parse(response.data).types))
	},(response)=>{
		fail && fail('未知错误')
	})
}
export default function(params,success,fail){
	console.log(params)
	// setTimeout(()=>{
	// 	success && success([{type:'subHeader',text:'sub header 1'},{img:'data:image/jpeg;base64,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',text:'level'+(params.level+1)+'-1'},{text:'level'+(params.level+1)+'-2'}])			
	// },1000)
	switch (params.level){
		case 0:
		getBrands.bind(this)(success,fail)
		break
		case 1:
		getSeries.bind(this)({brand:params.item.text},success,fail)
		break
		case 2:
		getTypes.bind(this)({series:params.item.text,brand:params.item.parentText},success,fail)
		break
		default:
		console.log('not supported level')
	}
}