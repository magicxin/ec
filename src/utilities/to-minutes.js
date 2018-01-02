import toInteger from 'utilities/to-integer'
export default function(value){
	if(value){
		let hour=toInteger(value.split(':')[0]),
			minute=toInteger(value.split(':')[1])
		return hour*60+minute		
	}
	return 0
}