// import uris from './uris'
// import apiHost from 'settings/api-host'
import Vue from 'vue'
export default function(params, success, fail) {
  const PAGE_IDS={
    '12':'#igniteSystems',
    '9':'#inductionSystems',
    '6':'',
    '8':'',
    '0':'#',
    '1':'#engineControlSystems',
    '10':'#emissionSystems',
    '11':'#fuelSystems',
    '13':'#startSystems',
    '2':'#electricalSystems',
    '3':'#coolingSystems',
    '4':'#lubricatingSystems',
    '5':'',
    '7':''
  }
  function makeData(originalData) {
    function fillCarInfo(carFaults) {
      return {type: carFaults.type, count: carFaults.count, path: this.addPath(carFaults.path+PAGE_IDS[carFaults.type])}
    }
    function sortCarFaults (a, b) {
      if (a.count == 0 && b.count == 0) {
        if (a.type > b.type) {
          return 1
        }
        return -1
      } else if (a.count == 0 && b.count != 0) {
        return 1
      } else if (a.count != 0 && b.count == 0) {
        return -1
      } else {
        if ((a.type != 6 && a.type != 7 && a.type != 8) && (b.type != 6 && b.type != 7 && b.type != 8)) {
          if (a.type > b.type) {
            return 1
          }
          return -1
        } else if ((a.type == 6 || a.type == 7 || a.type == 8) && (b.type != 6 && b.type != 7 && b.type != 8)) {
          return 1
        } else if ((a.type != 6 && a.type != 7 && a.type != 8) && (b.type == 6 || b.type == 7 || b.type == 8)) {
          return -1
        } else if ((a.type == 6 || a.type == 7 || a.type == 8) && (b.type == 6 || b.type == 7 || b.type == 8)) {
          if (a.type > b.type) {
            return 1
          }
          return -1
        }
      }
      return -1
    }
    var carFaultsTmp = originalData.carFaults.map((carFaults)=>{
      return fillCarInfo(carFaults)
    })
    // var carFaultsTmp = [
    //   {
    //     type : "0",
    //     count : "0",
    //     path : "/carDiag/0/content/475.jhtml"
    //   },
    //   {
    //     type : "1",
    //     count : "0",
    //     path : "/carDiag/1/content/475.jhtml"
    //   },
    //   {
    //     type : "2",
    //     count : "0",
    //     path : "/carDiag/2/content/475.jhtml"
    //   },
    //   {
    //     type : "3",
    //     count : "0",
    //     path : "/carDiag/3/content/475.jhtml"
    //   },
    //   {
    //     type : "4",
    //     count : "0",
    //     path : "/carDiag/4/content/475.jhtml"
    //   },
    //   {
    //     type : "5",
    //     count : "0",
    //     path : ""
    //   },
    //   {
    //     type : "6",
    //     count : "1",
    //     path : ""
    //   },
    //   {
    //     type : "7",
    //     count : "2",
    //     path : ""
    //   },
    //   {
    //     type : "8",
    //     count : "1",
    //     path : ""
    //   },
    //   {
    //     type : "9",
    //     count : "3",
    //     path : "/carDiag/9/content/475.jhtml"
    //   },
    //   {
    //     type : "10",
    //     count : "0",
    //     path : "/carDiag/10/content/475.jhtml"
    //   },
    //   {
    //     type : "11",
    //     count : "0",
    //     path : "/carDiag/11/content/475.jhtml"
    //   },
    //   {
    //     type : "12",
    //     count : "0",
    //     path : "/carDiag/12/content/475.jhtml"
    //   },
    //   {
    //     type : "13",
    //     count : "0",
    //     path : "/carDiag/13/content/475.jhtml"
    //   }
    // ]
    return {
      id:originalData.id,
      carId:originalData.carId,
      score:originalData.score,
      happenDate:originalData.happenDate,
      count:originalData.count,
      carbonEmission:originalData.carbonEmission,
      carFaults:carFaultsTmp.sort(sortCarFaults)
    }
  }
  this.$http.get({
    carId: params.carId,
    beginTime: params.beginTime,
    endTime: params.endTime,
    methodName: 'QueryCarFaultList'
  }).then((response)=>{
    success && success(makeData(JSON.parse(response.data)))
  },(response)=>{
    fail && fail(response.errorMessage || '错误：'+response.resultCode)
  })
}
