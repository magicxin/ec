// import uris from 'services/uris'
import Vue from 'vue'
//import dateFilter from 'filters/dateFilters'
function makeData(originalData){
  originalData.forEach((item)=>{
    item.beginTime=dateFilter(item.beginTime);
    item.endTime=dateFilter(item.endTime);
  })
}
export default function(params, success, fail) {
  //console.log(params)
  params['methodName'] = 'QueryCarTrackList'
  Vue.prototype.$.get(params).then((response)=>{
    let data = response.data  
    makeData(data.carTracks) 
                if (data.resultCode == 100) {
                    success && success(data)
                } else {
                    fail && fail(data.resultCode)
                }
  },(response)=>{
  	fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })

}
