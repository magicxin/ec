// import uris from 'services/uris'
import fuckingErrorMessage from 'services/fucking-error-message'
import Vue from 'vue'
function makeData(originalData,maintainData,insuranceData) {
    return {
        id:originalData.id,
        carId: originalData.plateNumber,
        carCode: originalData.vin,
        carEngine: originalData.engineNumber,
        carLogo:originalData.brandLogo,
        brand: originalData.brand,
        series: originalData.series,
        type: originalData.type,
        onTime:originalData.onTime,
        isSpecialCarId: originalData.plateNumberType == 1,
        warnCode:(()=>{
                let warnCode=''
                originalData.terminals.some((terminal)=>{
                    if(terminal.type==0 || terminal.type==4){
                        warnCode=terminal.number
                    }
                    return true
                })
                return warnCode
        })(),
        warnTerminalId:(()=>{
                let warnId=''
                originalData.terminals.some((terminal)=>{
                    if(terminal.type==0 || terminal.type==4){
                        warnId=terminal.id
                    }
                    return true
                })
                return warnId
        })(),
        eyeCode:(()=>{
                let eyeCode=''
                originalData.terminals.some((terminal)=>{
                    if(terminal.type==1){
                        eyeCode=terminal.number
                    }
                    return true
                })
                return eyeCode
        })(),
        eyeTerminalId:(()=>{
                let eyeId=''
                originalData.terminals.some((terminal)=>{
                    if(terminal.type==1){
                        eyeId=terminal.id
                    }
                    return true
                })
                return eyeId
        })(),
        insuranceFilled:!!insuranceData && !!insuranceData.id && (!!insuranceData.insuranceCompany || !!insuranceData.policyEffectiveDate),
        maintainFilled:!!maintainData && !!maintainData.id,
        yearCheckFilled:!!originalData.onTime,
        hasBindedDevice:!!originalData.terminals.length,
        isDefaultCar:originalData.defaultCar==1
    }
}

function add(params, success, fail) {
    let postParams = {
        car: {
            plateNumberType: params.isSpecialCarId ? 1 : 0,
            plateNumber: params.carId,
            vin: params.carCode,
            engineNumber: params.carEngine,
            brand: params.brand,
            series: params.series,
            type: params.type
        }
    }
    if(params.id){
        postParams.car.id=params.id        
        postParams.car.onTime=params.onTime
        postParams.car.terminals=[{number:params.warnCode,type:0},{number:params.eyeCode,type:1}]
        postParams.car.defaultCar=params.isDefaultCar ? 1 : 0
    }
    if(params.isFriendCar){
        postParams.type=0
    }
    console.log(postParams)

    if(!!params.id){
        //判断id存在
        postParams['methodName'] = 'EditCar'
    }else{
        //不存在
        postParams['methodName'] = 'AddCar'
    }

    // this.prototype.$.get(!!params.id ? uris.bindedCar.edit(postParams) : uris.bindedCar.add(postParams)).then((response) => {
    Vue.prototype.$.get(postParams).then((response) =>{
        // let data = JSON.parse(response.data)
        let data = response.data        
        if (data.resultCode == 100) {
            success && success(data.car)
        } else {
            fail && fail(fuckingErrorMessage[data.resultCode])
        }
    }, (response) => {
        fail && fail('未知错误')
    })
}

export default {
    get(params, success, fail) {
            // setTimeout(() => {
            //     success && success(testData)
            // }, 1000)
            Vue.prototype.$.get( {
                carId: params.id,
                type: 1,
                methodName: 'QueryCarInfo'
            }).then((response) => {
                let data = response.data
                if (data.resultCode == 100) {
                    success && success(makeData(data.car,data.carMaintain,data.carInsurance))
                } else {
                    fail && fail(data.resultCode)
                }
            }, (response) => {
                fail && fail('未知错误')
            })
    },
    add,
    edit(params, success, fail) {
        add.bind(this)(params, success, fail, true)
    }
}
