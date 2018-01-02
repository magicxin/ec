// import uris from 'services/uris'
import Vue from 'vue'
import responseHandler from 'services/response-handler'
import toInteger from 'utilities/to-integer'
import toMinutes from 'utilities/to-minutes'
import calcMethod from 'utilities/calc-method'
import nativeCarInfo from 'native/services/car-info'
import bindedDeviceStatus from 'services/binded-device-status'
import loginStatus from 'services/login-status'

import token from 'services/crumb'
// 上传图片 base64编码转file
  function base64ToFile (baseData) {
    let bytes = window.atob(baseData.split(',')[1])
    // 处理异常
    let ab = new ArrayBuffer(bytes.length)
    let is = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i ++) {
      is[i] = bytes.charCodeAt(i);
    }

    return new Blob( [ab] , {type : 'image/png'})
  }


export default {
        carInfo(params, success, fail) {
            let getData=calcMethod({
                native:nativeCarInfo, 
                browser(params){
                    console.log('data flow cancel')
                    return Promise.resolve({data:{carId:768}})
                }
            }) 
            getData(params).then(success,fail)  
        },
        getUserName(){
            // console.log(Vue.prototype.$.getLoginStatus);
            return Promise.resolve({userName:loginStatus._cachedUserInfo().userName})
        },
        getListCarByMember(params, success, fail) {
            params['methodName'] = 'ListCarByMember'
            Vue.prototype.$.get(params).then((response)=>{
                    success && success(response.data)
                },(response)=>{
                    fail && fail(response.errorMessage || '错误：'+response.resultCode)
            })           
        },
        listFleetByCar(params, success, fail) {
            params['methodName'] = 'ListFleetByCar'
            Vue.prototype.$.get(params).then((response)=>{
                    console.log(response.data)
                    success && success(response.data)
                },(response)=>{
                    fail && fail(response.errorMessage || '错误：'+response.resultCode)
            })
        },
        createCarCost(params,success,fail){
            params['methodName'] = 'CreateCarCost'
            alert(JSON.stringify(params))
            Vue.prototype.$.get(params).then(responseHandler.success(success,fail),responseHandler.error(fail))
        },
        commonFileUpload(params,success,fail){
            // alert(formData);
            var formData=new FormData()
            formData.append('type','0')
            params.images.forEach((image,index)=>{
                let file = base64ToFile(image.data)                           
                formData.append('uploadFile'+index,file,'vfac'+'.'+image.type)               
            })
            this.$http.post(Vue.prototype.$.host+'/rest/commonFileUpload.jhtml', formData)
            .then(res=>{
                alert(res)
                success && success(res.data)
            })
            .catch(err=>{
                alert(err)
                fail && fail(response.errorMessage || '错误：' + response.resultCode)
            })
        }
}
