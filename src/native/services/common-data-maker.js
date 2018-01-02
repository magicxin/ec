export default function(response){
	// alert(response)
	let parsedData=response ? JSON.parse(response) : {},
		data=parsedData.data || {}
	if(typeof data != 'object'){
		var oldValue=data
		data={}
		data.value=oldValue	
	}
	data.resultCode=parsedData.resultCode
	data.errorMessage=parsedData.errorMessage
	// alert('maked data')
	// alert(JSON.stringify({data:data}))
	return {data:data}
}