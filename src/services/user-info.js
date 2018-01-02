// import uris from 'services/uris'

function makeData (originalData) {
  let carId = originalData.carPlateNumber || '',
    carCode = '',
    carEngine = '',
    brandLogo = '',
    headPhoto = originalData.headerUrl || '',
    defaultCarId = originalData.carId
  originalData.cars.some((car) => {
    if (car.id === originalData.carId) {
      carCode = car.vin || ''
      carEngine = car.engineNumber || ''
      brandLogo = car.brandLogo || ''
      return true
    }
  })
  return {
    carId: carId,  //车牌还
    carCode: carCode, //车架号
    carEngine: carEngine, //发动机号
    defaultCarId: defaultCarId,
    headPhoto: headPhoto,
    realName: originalData.realName || '',
    mobile: originalData.mobile || ''
  }
}
export default function (success, fail) {
  return this.$.get({'methodName':'Index'})
    .then((response) => {
      console.log(response.data)
      let data = makeData(response.data)
      success && success(data)
      return data
    }, (response) => {
      let error = response.data.errorInfo || '错误：' + response.data.resultCode
      fail && fail(error)
      return error
    })
}
