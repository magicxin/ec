// import uris from 'services/uris'
import responseHandler from 'services/response-handler'
import userInfo from 'services/user-info'
import gpsConvertor from 'utilities/gps-convertor'

function makeData(originalData) {
    console.log(originalData)
    function makeCarsData(cars){
        return cars.map((car) => {
            return {
                id: car.carId,
                ownerId: car.creatorId,
                brandId:car.plateNumber,
                logo: car.brandLogo || '',
                driver: car.driverName,
                mobile: car.driverTEL,
                status: car.deviceStatus == 0 ? '离线：未知' : car.runningStatus == 0 ? '在线：行驶' : car.runningStatus == 1 ? '在线：停止' : car.runningStatus == 2 ? '在线：熄火' : car.runningStatus == 3 ? '在线：怠速' : '离线：未知',
                statusColor:car.deviceStatus==0 ? 'gray' : car.runningStatus == 2 ? 'orange' : 'green',
                speed: car.speed,
                address: car.address,
                latitude: parseFloat(car.latitude),
                longitude: parseFloat(car.longitude),
                rotation: parseInt(car.direction, 10)
            }
        })
    }
    return {
    	hasBindedDevice:!!originalData.cars.length,
        cars: makeCarsData(originalData.cars), 
        ownCars:makeCarsData(originalData.ownCars)
    }
}
    function sortDefaultCar(cars,defaultCarId){
        cars.some((car,index)=>{
            if(car.id==defaultCarId){
                cars.splice(index,1)
                cars.unshift(car)
                return true
            }
        })
        return cars
    }

export default function(params, success, fail) {

    let carsData=null,defaultCarId='',headPhoto='',triggerTimes=0
    function tryTriggerCallback(){
        if((carsData && defaultCarId) || triggerTimes==2){
            sortDefaultCar(carsData.cars,defaultCarId)
            carsData.userInfo={headPhoto:headPhoto}
            console.log('car map data:',carsData)
            success && success(carsData)
        }
    }

    userInfo.bind(this)((data)=>{
        console.log(data)
        defaultCarId=data.defaultCarId
        headPhoto=data.headPhoto
        triggerTimes+=1
        tryTriggerCallback()
    },(err)=>{
        console.log(err)
    })


    
    // this.$http.get(uris.bindedDevice.list())
    //     .then(responseHandler.success((data)=>{
    //         carsData=data
    //         tryTriggerCallback()
    //     }, fail, makeData), fail)

    this.$.get({
        methodName:'QueryUserCarStateList'
    })
    .then(responseHandler.success((data)=>{
            carsData=data
            let gpsPoints=carsData.cars.map((car)=>{
                return {
                    lat:car.latitude,
                    lng:car.longitude
                }
            })
            console.log('gpsPoints: ',gpsPoints)
            gpsConvertor({points:gpsPoints}).then((points)=>{
                carsData.cars.forEach((car,index)=>{
                    // console.log(carData.latitude,points[index].lat)
                    car.latitude=points[index].lat
                    car.longitude=points[index].lng
                })
                triggerTimes+=1
                tryTriggerCallback()
            },(err)=>{
                fail && fail(err)
            })
        }, fail, makeData), fail)



}
