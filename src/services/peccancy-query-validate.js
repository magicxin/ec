	// import isEmpty from 'utilities/is-empty'

	export default {
	    carIdInvalidMessage(carId) {
	            if (this.$.isEmpty(carId)) {
	                return '请输入车牌号'
	            }
	            if (carId.length != 7) {
	                return '请输入正确的7位车牌号'
	            }
	            return ''
	        },
	        carCodeInvalidMessage(carCode,length) {
	        	console.log(length)
	            if(length){
					if(this.$.isEmpty(carCode)){
	                	return '请输入车架号'
	                }
	                if(length!==Infinity && carCode.trim().length!=length){
	                	return '请输入车架号后'+length+'位'
	                }	    			            	
	            }else{
	            	if(carCode.trim().length!=17){
	            		reutrn '请输入完整17位车架号'
	            	}
	            }
	            // return ''
	        },
	        carEngineInvalidMessage(carEngine,length) {
	            if(length){
					if(this.$.isEmpty(carEngine)){
	                	return '请输入发动机号'
	                }
	                if(length!==Infinity && carEngine.trim().length!=length){
	                	return '请输入后发动机号后'+length+'位'
	                }	    			            	
	            }
	            return ''

	        },
	        addressInvalidMessage(province, city) {
	            if (this.$.isEmpty(province) || this.$.isEmpty(city)) {
	                return '请选择城市'
	            }
	            return ''
	        }
	}
