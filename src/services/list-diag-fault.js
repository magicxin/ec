// import uris from './uris'
import Vue from 'vue'
export default function(params, success, fail) {
  function makeData(originalData){
    // function fillCarInfo(diagFault){
    //   return {id:diagFault.id,faultCode:diagFault.faultCode,definition:diagFault.definition}
    // }
    // if( typeof originalData.diagFaults =='undefined' || originalData.diagFaults == null){
    //   return []
    // }
    return { 
      ListDiagFault:originalData.diagFaults instanceof Array ? originalData.diagFaults.map((diagFault)=>{
        // return fillCarInfo(diagFault)
        return {
          id:diagFault.id,
          faultCode:diagFault.faultCode,
          definition:diagFault.definition     
        }
      }) : []
    }
  }
  Vue.prototype.$.get({
    count: params.count,
    methodName: 'ListDiagFault'
  }).then((response)=>{
    success && success(makeData(JSON.parse(response.data)))
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
