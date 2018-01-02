/**
 * Created by lenovo on 2017/6/22.
 */
// import apiHost from 'settings/api-host';

// export default function (params, success, fail) {
//   let unbindUri = apiHost.host + '/rest/json.jhtml',
//     data = {
//       methodName: 'ZhonganInsuranceAccess',
//       clientType: 'unknown',
//       userId: params.userId,
//       shopId: params.shop.Id
//     }
//   this.$http.post(unbindUri, data).then((response) => {
//     let getData = response.data;
//     console.log(response.data);
//     if (getData.resultCode == 100) {
//       success && success(data);
//     } else {
//       fail && fail(getData.resultCode);
//     }
//   }, (response) => {
//     fail && fail(response.errorMessage || '错误：' + response.resultCode);
//   });
// }


// import uris from './uris'
import Vue from 'vue'
import responseHandler from './response-handler'
export default {
  getZhongAnUri(params, success, fail){

    function makeData(originalData) {
      return {
        uri: originalData.url
      };
    }
    
    //this.$http.post(uris.insurance.zhongAnUri(params), responseHandler.success(success, fail, makeData), responseHandler.error(fail))
    params['methodName'] = 'ZhonganInsuranceAccess'
    Vue.prototype.$.get(params)
      .then(responseHandler.success(success, fail, makeData), responseHandler.error(fail))
  }
}
