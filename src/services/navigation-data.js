function get(){
	let navigationData=localStorage.getItem('userNavigation')
	if(navigationData){
		return JSON.parse(navigationData)
	}
}
export default {
	get,
	unshift(location){
		let localSaved=get(),
			locationIsSaved=false
		if(!localSaved){
			localSaved=[]
		}
		localSaved.some((savedLocation)=>{
			if(location.lat==savedLocation.lat && location.lng===savedLocation.lng){
				locationIsSaved=true
				return true
			}
		})
		!locationIsSaved && localSaved.unshift(location)
		localStorage.setItem('userNavigation',JSON.stringify(localSaved))
	}
}