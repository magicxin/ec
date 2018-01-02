// import uris from 'services/uris'
import Vue from 'vue'
import responseHandler from 'services/response-handler'
import toInteger from 'utilities/to-integer'
import toMinutes from 'utilities/to-minutes'
import bindedDeviceStatus from 'services/binded-device-status'
export default {
    getList(params, success, fail) {
            // setTimeout(() => {
            //     success && success([
            //         { id: 1, name: '测试围栏1' },
            //         { id: 2, name: '测试围栏2' } 
            //     ])
            // }, 1000)
            function makeData(originalData){
                return originalData.fences
            }
            params['methodName'] = 'QueryFenceList'
            Vue.prototype.$.get(params)
            .then(responseHandler.success(success,fail,makeData),responseHandler.error(fail))

        },
        get(params, success, fail) {
            if (params.id) {
                // setTimeout(() => {
                //     success && success({
                //         railName: 'test rail name',
                //         carSpeed: 100,
                //         railType: 'square',
                //         railRemindType: 'in-out',
                //         railRemindTime: { start: 0, end: 1439 },
                //         railCars: [
                //             { logo: '/upload/image/brand/117.jpg', brandId: 'xxxxx1', id: 1, selected: true },
                //             { logo: '/upload/image/brand/117.jpg', brandId: 'xxxxx2', id: 2 ,selected:false}
                //         ],
                //         railIsOpen: false
                //     })
                // }, 1000)
                function makeData(railData,deviceData){
                    return {
                        railName: railData.fence.name,
                        carSpeed: toInteger(railData.fence.overspeed),
                        railType: railData.fence.type==0 ? 'circle' : railData.fence.type==1 ? 'square' : railData.fence.type==2 ? 'area' : 'polyline',
                        railRemindType: railData.fence.triggerMethod==0 ? 'in' : railData.fence.triggerMethod==1 ? 'out' : 'in-out',
                        railRemindTime: { start: toMinutes(railData.fence.startTime), end: toMinutes(railData.fence.endTime) },
                        railIsOpen: railData.fence.isEnabled==1,
                        railCars:deviceData.ownCars.map((car)=>{
                            return {
                                logo:car.logo,
                                brandId:car.brandId,
                                id:car.id,
                                selected:railData.fence.carIds.indexOf(car.id)!=-1
                            }
                        }), 
                        latitude:railData.fence.type==0 ? parseFloat(railData.fence.circleLat) : railData.fence.type==1 ? (parseFloat(railData.fence.rectLat4) - parseFloat(railData.fence.rectLat1))/2 : 39.915,
                        longitude:railData.fence.type==0 ? parseFloat(railData.fence.circleLng) : railData.fence.type==1 ? (parseFloat(railData.fence.rectLng2) - parseFloat(railData.fence.rectLng1))/2 : 116.404,
                        railData:{
                            leftTop:{lng:parseFloat(railData.fence.rectLng1),lat:parseFloat(railData.fence.rectLat1)},
                            rightTop:{lng:parseFloat(railData.fence.rectLng2),lat:parseFloat(railData.fence.rectLat2)},
                            rightBottom:{lng:parseFloat(railData.fence.rectLng3),lat:parseFloat(railData.fence.rectLat3)},
                            leftBottom:{lng:parseFloat(railData.fence.rectLng4),lat:parseFloat(railData.fence.rectLat4)},
                            center:{lng:parseFloat(railData.fence.circleLng),lat:parseFloat(railData.fence.circleLat)},
                            radiusMeters:parseFloat(railData.fence.radius)
                        },
                        selectedArea:railData.fence.type==2 ? [{id:railData.fence.areaData.id,text:railData.fence.areaData.name}] : [],
                        selectedAreaText:railData.fence.type==2 ? railData.fence.fullName : ''
                    }
                }

                function getDeviceStatus(params){
                    return new Promise((resolve,reject)=>{
                        bindedDeviceStatus.bind(this)(params,(data)=>{
                            resolve(data)
                        },(err)=>{
                            reject(err)
                        })
                    })
                }

                return Promise.all([Vue.prototype.$.get({fenceId:params.id, methodName:'QueryFence'}),getDeviceStatus.bind(this)({})])
                .then((responses)=>{
                    success && success(makeData(responses[0].data),responses[1])
                },responseHandler.error(fail))

            } else {
                // setTimeout(() => {
                //     success && success({
                //         railName: '',
                //         carSpeed: '',
                //         railType: '',
                //         railRemindType: '',
                //         railRemindTime: {},
                //         railCars: [{ logo: '/upload/image/brand/117.jpg', brandId: 'xxxxx1', id: 1, selected: false },
                //             { logo: '/upload/image/brand/117.jpg', brandId: 'xxxxx2', id: 2 ,selected:false}],
                //         railIsOpen: true
                //     })
                // }, 1000)
                bindedDeviceStatus.bind(this)(params,(data)=>{
                    success && success({
                        railCars: data.ownCars.map((car)=>{
                            return {
                                logo:car.logo,
                                id:car.id,
                                brandId:car.brandId,
                                selected:false
                            }
                        })
                    })  
                },(err)=>{
                    fail && fail(err)
                })
            }
        },
        post(params, success, fail) {
        //             /**
        //  * 电子围栏类型
        //  */
        // public enum type {
        //     /** 圆形 */
        //     circle,
        //     /** 矩形 */
        //     rectangle,
        //     /** 行政区域 */
        //     adminarea,
        //     /** 多边形 */
        //     polygon
        // }



        // /**
        //  * 围栏类别
        //  */
        // public enum category {
        //     /** 个人 */
        //     personal,
        //     /** 车队 */
        //     fleet,
        //     /** 公司 */
        //     company
        // }



        // /**
        //  * 触发方式
        //  */
        // public enum triggerMethod {
        //     /** 进围栏提醒 */
        //     in,
        //     /** 出围栏提醒 */
        //     out,
        //     /** 入出围栏提醒 */
        //     inout
        // }
        // /** 矩形左上点经度 */
        // private String rectLng1;
        // /** 矩形左上点纬度 */
        // private String rectLat1;
        // /** 矩形右上点经度 */
        // private String rectLng2;
        // /** 矩形右上点纬度 */
        // private String rectLat2;
        // /** 矩形右下点经度 */
        // private String rectLng3;
        // /** 矩形右下点纬度 */
        // private String rectLat3;
        // /** 矩形左下点经度 */
        // private String rectLng4;
        // /** 矩形左下点纬度 */
        // private String rectLat4;
        // /** 圆形中心点经度 */
        // private String circleLng;
        // /** 圆形中心点纬度 */
        // private String circleLat;
        // /** 圆形半径 */
        // private String radius;
        // /** 多边形点阵 */
        // private String polygon = "";
            console.log(params)
            function makeParams(originalParams){
                let typeCode={
                    circle:0,
                    square:1,
                    area:2,
                    polygon:3
                }
                let triggerMethodCode={
                    in:0,
                    out:1,
                    'in-out':2
                }
                let makedParams={

                    name:originalParams.railName,
                    overspeed:originalParams.carSpeed,
                    isEnabled:originalParams.railIsOpen ? 1 : 0,
                    startTime:originalParams.railRemindTime.split('-')[0],
                    endTime:originalParams.railRemindTime.split('-')[1],
                    // time:originalParams.railRemindTime,
                    carIds:originalParams.railCars.map((car)=>{
                        return car.id
                    }),
                    // carId:,         


                    type:typeCode[originalParams.railType],
                    category:0,
                    triggerMethod:triggerMethodCode[originalParams.railRemindType]
                }
                if(originalParams.railType=='square'){
                    makedParams.rectLng1=originalParams.railData.leftTop.lng
                    makedParams.rectLat1=originalParams.railData.leftTop.lat
                    makedParams.rectLng2=originalParams.railData.rightTop.lng
                    makedParams.rectLat2=originalParams.railData.rightTop.lat
                    makedParams.rectLng3=originalParams.railData.rightBottom.lng
                    makedParams.rectLat3=originalParams.railData.rightBottom.lat
                    makedParams.rectLng4=originalParams.railData.leftBottom.lng
                    makedParams.rectLat4=originalParams.railData.leftBottom.lat
                }else if(originalParams.railType=='circle'){
                    makedParams.circleLng=originalParams.railData.center.lng
                    makedParams.circleLat=originalParams.railData.center.lat
                    makedParams.radius=originalParams.railData.radiusMeters
                }else if(originalParams.railType=='area'){
                    makedParams.areaId=originalParams.railAreaId
                }
                originalParams.railId && (makedParams.id=originalParams.railId)
                return makedParams
            }

            if(params.railId){
                console.log(uris.carRails.edit({fence:makeParams(params)}))
                // Vue.prototype.$.get(uris.carRails.edit({fence:makeParams(params)}))
                Vue.prototype.$.get(
                    
                    {
                        methodName: 'EditFence',
                        fence:makeParams(params)
                    }
                )
                .then(responseHandler.success(success,fail),responseHandler.error(fail))
            }else{
                // Vue.prototype.$.get(uris.carRails.add({fence:makeParams(params)}))
                Vue.prototype.$.get({
                    methodName: 'CreateFence',
                    fence:makeParams(params)
                })
                .then(responseHandler.success(success,fail),responseHandler.error(fail))
            }
            // setTimeout(()=>{
            //     success && success()
            // },1000)
        },
        delete(params,success,fail){
            // setTimeout(()=>{
            //     success && success()
            // },1000)
            Vue.prototype.$.get({
                fenceId:params.railId,
                methodName: 'DeleteFence'
            })
            .then(responseHandler.success(success,fail))

        }
}
