// import uris from './uris'
import Vue from 'vue'
import fuckingErrorMessage from 'services/fucking-error-message'
export default function(params, success, fail) {   
    Vue.prototype.$.get({
    	"record":{
                "carId":params.carId,
                "carLat":"",
                "carLng":"",
                "carLocation":"",
                "happanDate":params.happanDate,
                "id":"",
                "memberBaiduLat":params.memberBaiduLat,
                "memberBaiduLng":params.memberBaiduLng,
                "memberLocation":"中国吉林省长春市朝阳区平新路2322号",
                "memberLocationVisible":"1",
                "reasons":params.reasons,
                "workerBaiduLat":"",
                "workerBaiduLng":"",
                "workerLocation":"",
                "workerLocationVisible":""
            },
        "clientType":"0",
        "methodName":"CreateMemberRescueRecord",
        "shopId" : params.shopId,
        "userId" : params.userId
    }).then((response)=>{
    	console.log(response);
    	let data = JSON.parse(response.data);
		if (data.resultCode == 100) {
            success && success(response.data)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
    
    //故障原因获取
    Vue.prototype.$.get({
       "methodName" : 'ListMemberRescueReason',
       "shopId" : params.shopId,
       "userId" : params.userId,
       "clientType" : 3
    }).then((response)=>{
    	console.log(response);
    	let data = JSON.parse(response.data);
		  if (data.resultCode == 100) {
            success && success(response)
            console.log(data)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
    /*
//  服务记录状态更新
    this.$http.get(uris.oneKeyHelp.updateServiceRecordState({
       userId : getUserMessaage.userId,
       type : 0,
       methodName : 'Invalid',
       shopId : getUserMessaage.shop.Id,
       clientType : 3
    })).then((response)=>{
    	console.log(response);
    	let data = JSON.parse(response.data);
		  if (data.resultCode == 100) {
            success && success(response)
        } else {
            fail && fail(data.resultCode)
        }
    },(response)=>{
    	let error=response.errorInfo || '未知错误'
    	fail && fail(error)
    })
    */
}