export default {
	set(location){
		localStorage.setItem('userLocation',JSON.stringify(location))
	},
	get(){
		let localSavedLocation=localStorage.getItem('userLocation')
		if(localSavedLocation){
			return JSON.parse(localSavedLocation)
		}
	}
}