export default function(params,success,fail){
	console.log(params)
	success && success({fileName:'test local file name'})
}