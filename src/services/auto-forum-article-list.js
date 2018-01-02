// import uris from './uris'
import Vue from 'vue'
// import apiHost from 'settings/api-host'
export default function(params, success, fail) {
  function makeData(originalData){
    function fillCarInfo(carForum){
      return {id:carForum.id,title:carForum.title,logo:this.addPath(carForum.logo),publishDate:carForum.publishDate,path:this.addPath(carForum.path),author:carForum.author}
    }
    if( typeof originalData.carForums =='undefined' || originalData.carForums == null){
        return []
    }
    return {
      carForums:originalData.carForums.map((carForum)=>{
        return fillCarInfo(carForum)
      })
    }
  }
  Vue.prototype.$.get({
    categoryId: params.categoryId,
    beginTime: params.beginTime,
    count: params.count,
    shopId:params.shopId,
    methodName:'ListCarForum'
  }).then((response)=>{
      success && success(makeData(response.data))
    },(response)=>{
      fail && fail(response.errorMessage || '错误：'+response.resultCode)
    })
}
