import carBasicInfo from 'services/car-basic-info'

export default {
    get(params, success, fail) {
        carBasicInfo.get.bind(this)(params,success,fail)        
        // setTimeout(()=>{
        // success && success({
        //     warnCode:'w1111111111',
        //     eyeCode:'e11111111'
        // })
        // },1000)
    },
    edit(params, success, fail) {
        carBasicInfo.edit.bind(this)(params,success,fail)
        // setTimeout(()=>{
        // success && success()

        // },1000)
    }
}
