import calcMethod from 'utilities/calc-method'
import clientInfo from 'utilities/client-info'
import wechatLoginStatus from 'threeparties/wechat/services/login-status'
// import nativeLoginStatus from 'native/services/login-status'


let cachedIsLogedin = false,
    cachedUserInfo = null,
    getLoginStatus = calcMethod({
        // native: nativeLoginStatus,
        wechat: wechatLoginStatus,
        browser(){
            let localDevUserInfo=localStorage.getItem('user'),
                devUserInfo=localDevUserInfo ? JSON.parse(localDevUserInfo) : {}
            return Promise.resolve(devUserInfo)
        } 
    })

function getLoginStatusFunc(success, fail) {
    getLoginStatus().then((userInfo) => {
        // alert('userInfo getted:'+JSON.stringify(userInfo))
        cachedIsLogedin = !!userInfo.userId
        cachedUserInfo = userInfo
        success && success()
    }, (err) => {
        cachedIsLogedin = false
        cachedUserInfo = null
        fail && fail(err)
    })
}

export default {
    isLogedin() {
            return new Promise((resolve, reject) => {
                getLoginStatusFunc(()=>{
                    cachedIsLogedin ? resolve() : reject()
                },reject)
            })
        },
        userInfo() {
        	return new Promise((resolve, reject) => {
                getLoginStatusFunc(() => {
                    !!cachedUserInfo ? resolve() : reject()
                }, reject)
            })
        },
        _cachedUserInfo() {
            return cachedUserInfo
        }
}
