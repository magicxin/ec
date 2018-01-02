import Vue from 'vue'
import calcMethod from 'utilities/calc-method'
function makeData(originalData){
  originalData.carCosts.forEach((item)=>{       
    if(item.dataSource=="0"){
      item.type=({'0':'油费','1':'电费','2':'整车费','3':'车品费','4':'保险费','5':'保养费','6':'维修费','7':'救援费','8':'洗车费','9':'违章罚款费','10':'停车费','11':'路桥费','12':'年审(检)费','13':'自定义费用'})[item.type]
    }else if(item.dataSource=="1"){
      item.type=({'0':'油费','1':'电费','2':'整车订单','3':'车品订单','4':'保险订单','5':'保养订单','6':'维修订单','7':'一键救援','8':'洗车费','9':'违章罚款费','10':'停车费','11':'路桥费','12':'年审(检)费','13':'自定义费用'})[item.type]
    }       
  })
}

export default function(params, success, fail) {
        params.carId = this.$.carId
        if(params.carId!=''&&params.carId!=null&&params.carId!=null&&params.carId!=undefined){
          params['methodName'] = 'ListCarCost'
          Vue.prototype.$.get(params).then((response)=>{  
          makeData(response.data) 
          success && success(response.data)
        },(response)=>{
          fail && fail(response.errorMessage || '错误：'+response.resultCode)
        })
     } else {
      this.$.toast('您尚未绑定车辆')
      } 
}
