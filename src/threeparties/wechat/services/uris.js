import makeUglyUri from 'services/make-ugly-uri'
function makeWxUri(params,methodName,patten){
	// params methodName patten host
	return makeUglyUri(params,methodName,patten,'')
}
const uris = {
    sdkConfig(params) {
        return makeWxUri(params,'QueryJssdkConfig',null) 
    },
    loginStatus(params){
    	return makeWxUri(params,null,'/api/code/{code}/{wechatOpen}/wxcode.jhtml')
    }
}

export default uris
