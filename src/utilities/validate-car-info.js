	import Vue from 'vue'
	let isEmpty = Vue.prototype.$.isEmpty

	export default {
	    carIdInvalidMessage(carId) {
	            if(!carId.toUpperCase().match(/^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$/)){
	            	return '请输入正确的7位车牌号'
	            }
	            return ''
	        },
	        specialCarIdInvalidMessage(carId){
	        	if(isEmpty(carId)){
	        		return '请输入车牌号'
	        	}
	        	if(carId.trim().length<6 || carId.trim().length>12){
	        		return '请输入6至12位特殊车牌号'
	        	}
	        	return ''
	        },
	        carCodeInvalidMessage(carCode,length,needFullLength) {
					if(isEmpty(carCode)){
	                	return '请输入车架号'
	                }
	                if(carCode.trim().length!=length){
	                	if(needFullLength || length==17){
	                		return '请输入完整的'+length+'位车架号'
	                	}else{
	                		return '请输入车架号后'+length+'位'
	                	}
	                }
	                return ''
	        },
	        carEngineInvalidMessage(carEngine,length,needFullLength) {
	        	console.log(length)
					if(isEmpty(carEngine)){
	                	return '请输入发动机号'
	                }
	                if(carEngine.trim().length<length){
	                	// alert('car engine error')
	                	if(needFullLength){
	                		return '请输入正确的发动机号（'+length+'位以上）'
	                	}else{
	                		return '请输入发动机号后'+length+'位'
	                	}
	                }
	                return ''

	        },
	        addressInvalidMessage(province, city) {
	            if (isEmpty(province) || isEmpty(city)) {
	                return '请选择城市'
	            }
	            return ''
	        }
	}
