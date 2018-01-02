// from 参数含义
// 1：GPS设备获取的角度坐标，wgs84坐标;

// 2：GPS获取的米制坐标、sogou地图所用坐标;

// 3：google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标，国测局坐标;

// 4：3中列表地图坐标对应的米制坐标;

// 5：百度地图采用的经纬度坐标;

// 6：百度地图采用的米制坐标;

// 7：mapbar地图坐标;

// 8：51地图坐标

// 默认为1，即GPS设备获取的坐标

// to	目的坐标类型	
// 有两种可供选择：5、6。

// 5：bd09ll(百度经纬度坐标),

// 6：bd09mc(百度米制经纬度坐标);



export default function(params){
	let points=params.points.map((point)=>{
		return new BMap.Point(point.lng,point.lat) 
	}),
	splitedPoints=[],
	convertPromises=[]

	points.forEach((point,index)=>{
		let splitedPointsIndex=Math.floor(index/10)
		splitedPoints[splitedPointsIndex]=splitedPoints[splitedPointsIndex] || []
		splitedPoints[splitedPointsIndex].push(point)
	})

	splitedPoints.forEach((pointsArr)=>{
		convertPromises.push(new Promise((resolve,reject)=>{
			new BMap.Convertor().translate(pointsArr,params.from || 1,params.to || 5,(data)=>{
				if(data.status==0){
					resolve(data.points)
				}else{
					reject(data)
				}
			})
  		}))
	})

	return Promise.all(convertPromises).then((pointsArrs)=>{
		let finalPoints=[]
		pointsArrs.forEach((pointsArr)=>{
			finalPoints=finalPoints.concat(pointsArr)
		})
		console.log('points',points)
		console.log('converted points',finalPoints)
		return finalPoints
	},(err)=>{
		return err
	})

}