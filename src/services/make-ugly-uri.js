// import apiHost from 'settings/api-host'
import clientInfo from 'utilities/client-info'
import loginStatus from 'services/login-status'
// console.log('api host: ', apiHost.dynamicHost.get())

let makeUri = (finalParams, host) => {
    let pathPatten = '/rest/json.jhtml?req=' + encodeURIComponent(finalParams)
    return typeof host == 'string' ? host + pathPatten : this.addPath(pathPatten)
    // return apiHost.host + '/rest/json.jhtml?req=' + encodeURIComponent(finalParams)
  },
  addParam = (params, methodName) => {
    let i, j, finalParams = {},
      userInfo = loginStatus._cachedUserInfo()
    if (params !== undefined) {
      for (i in params) {
        finalParams[i] = (params[i] === undefined || params[i] === null ? '' : params[i])
      }
    }
    methodName && (finalParams.methodName = methodName)

    finalParams.clientType = clientInfo.render.isWechatWebview ? 3 : clientInfo.render.isIosWebview ? 1 : clientInfo.render.isAndroidWebview ? 2 : 'unknown'
    finalParams.userId = userInfo && userInfo.userId ? userInfo.userId : ''
    finalParams.shopId = userInfo && userInfo.shop && userInfo.shop.id ? userInfo.shop.id : (params.shopId || '')
    return JSON.stringify(finalParams)
  },
  makeUglyUri = (params, methodName, patten, host) => {
    if (methodName) {
      return makeUri(addParam(params, methodName), host)
    } else {
      let url = patten, i
      for (i in params) {
        url = url.replace('{' + i + '}', params[i])
      }
      return typeof host == 'string' ? host + url : this.addPath(url)
    }
  }

export default makeUglyUri
