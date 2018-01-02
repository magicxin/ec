import errorMessage from 'services/fucking-error-message'
export default {
	success:function(success,fail,makeData){
		return function(response){
			let data=typeof response.data=='string' ? JSON.parse(response.data) : response.data
			if(data.resultCode==100){
				success && success(makeData ? makeData(data) : data)
			}else{
				console.log(data)
				if(data.resultCode){
					if(data.resultCode==-2){
						success && success(makeData ? makeData(data) : data, errorMessage[data.resultCode] ? errorMessage[data.resultCode] : data.errorMessage || '未定义类型错误',data.resultCode)
					}else{
						fail && fail(errorMessage[data.resultCode] ? errorMessage[data.resultCode] : data.errorMessage || '未定义类型错误',data.resultCode)											
					}
				}else{					
					fail && fail(data.errorMessage || '未知错误')
				}
			}
		}
	},
	error:function(error){
		return function(){
			error && error('未知错误')			
		}
	}
}