export default function(positionArray,success,fail) {
	var points = false;
//	var positionArray = [
//					     {"longitude":116.174008, "latitude":41.059728},
//					     {"longitude":117.172708, "latitude":42.0603688},
//					     {"longitude":118.174535, "latitude":43.059727},
//					     {"longitude":119.373919, "latitude":44.981656}
//					     ];
	function turnPosition(gpsPoint){
		return new Promise((resolve,reject)=>{
			BMap.Convertor.translate(gpsPoint,0,function (point){
				resolve(point);	    
			})
		})
	}	
	return Promise.all(positionArray.map((position)=>{
		var gpsPoint = new BMap.Point(position.longitude,position.latitude);
		return turnPosition(gpsPoint);
	}));
}