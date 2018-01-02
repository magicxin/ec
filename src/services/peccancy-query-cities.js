// import uris from './uris'
import Vue from 'vue'
let toInteger = Vue.prototype.$.toInteger
var makeData=function(result){
  var data={}, 
      provincesCodes=Object.keys(result)
  provincesCodes.map(function(provinceCode){
    data[result[provinceCode].province]={
      code:provinceCode,
      cities:(function(){
        var subData={}

        result[provinceCode].citys.map(function(city){
          function makeCityData(){
              subData[city.city_name]={
                code:city.city_code,
                carCodeNeededLength:!!toInteger(city.classa) ? toInteger(city.classno) : 0,
                carEngineNeededLength:!!toInteger(city.engine) ? toInteger(city.engineno) : 0
              }          
          }
          if(['SH','TJ','CQ','BJ','JL'].indexOf(city.city_code)!=-1){
            makeCityData()
          }else{
            city.city_code != provinceCode && makeCityData()
          }
        })
        return subData
      })()
    }
  })
  console.log(data)
  return data
}
export default function(success,fail){
  // setTimeout(()=>{
  // success && success(address)
  // },1000)
  return Vue.prototype.$.get({'methodName':'QuerySuppoetCitys'}) 
  .then((response)=>{ 
    console.log(response)
      let data=response.data,
          errorInfo=data.errorInfo || (data.resultCode==307 ? '本周查询次数超限' : '') 
          console.log(data)
      if(errorInfo){
        fail && fail(data.resultCode)
        return Promise.reject(data.resultCode)
      }else{
      let makedData=makeData(JSON.parse(data.suppoetCitys))
        success && success(makedData)
        return Promise.resolve(makedData)
      }
  },(response)=>{
    let error=response.errorInfo || '未知错误'
    fail && fail(error)
    return Promise.reject(error) 
  })
}
