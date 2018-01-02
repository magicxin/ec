// import uris from './uris'
import Vue from 'vue'
export default function(params, success, fail) {
  console.log(params)
  function makeData(originalData){
    console.log(originalData)
    function fillCarInfo(articleCategory){
      return {id:articleCategory.id,name:articleCategory.name,grade:articleCategory.grade}
    }
    return {
      articleCategorys:originalData.articleCategorys.map((category)=>{
        return fillCarInfo(category)
      })
    }
  }
  params['methodName'] = 'ListArticleCategory'
  Vue.prototype.$.get(params).then((response)=>{
      success && success(makeData(response.data))
    },(response)=>{
      fail && fail(response.errorMessage || '错误：'+response.resultCode)
    })
}
