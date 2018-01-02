// let isLogedin = false,
//     userInfo = null

// function getLoginStatus() {

//     let localSavedUserInfo = localStorage.getItem('user'),
//         jsonObj = null
//     if (localSavedUserInfo) {
//         jsonObj = JSON.parse(localSavedUserInfo)
//         isLogedin = !!jsonObj.userId
//         userInfo = jsonObj
//         return
//     }
//     isLogedin = false
//     userInfo = null
// }

// export default {
//     isLogedin() {
//             return new Promise((resolve, reject) => {
//                 getLoginStatus()
//                 if (isLogedin) {
//                     resolve()
//                 } else {
//                     reject()
//                 }
//             })
//         },
//         userInfo() {
//             return new Promise((resolve, reject) => {
//                 getLoginStatus()
//                 if (userInfo) {
//                     resolve(userInfo)
//                 } else {
//                     reject()
//                 }
//             })
//         },
//         _cachedUserInfo() {
//             return userInfo
//         }
// }

            //     user = data;
            //     user.shop.id = data.shop.id;
            //     user.wechatOpen = wechatOpen;
            //     localStorage.setItem('user', JSON.stringify(user));
            // } else {

            //     // 当不存在时，保存一个空对象，保证获取userId的时候取不到值，而不是报错
            //     localStorage.setItem('user', JSON.stringify({
            //         userId: '',
            //         wechatOpen: wechatOpen,
            //         wechatOpenId: openId,
            //         shop: {
            //             id: data.shop.id
            //         }
            //     }));
            // }


import Vue from 'vue'
import uris from 'threeparties/wechat/services/uris'
import calcUriParams from 'utilities/calc-uri-params'
import clientInfo from 'utilities/client-info'
export default function() {
    return new Promise((resolve, reject) => {
        let params=calcUriParams.getUriQuery(),
            localSavedLoginCheck=localStorage.getItem('logincheck')
    	if(clientInfo.render.isWechatWebView){
            if(localSavedLoginCheck && JSON.parse(localSavedLoginCheck).wechatOpenId && JSON.parse(localSavedLoginCheck).code==params.code && JSON.parse(localSavedLoginCheck).wechatOpen==params.state){
                resolve(JSON.parse(localStorage.getItem('user')))
            }else{
              Vue.http.get(uris.loginStatus({
                    code:params.code,
                    wechatOpen:params.state
                })).then((response)=>{
                    console.log(response)
                    let userInfo=response.data
                    // userInfo.userId=''
                    userInfo.userId=userInfo.userId || ''
                    userInfo.wechatOpen=params.state
                    userInfo.code=params.code
                    localStorage.setItem('user',JSON.stringify(userInfo))
                    localStorage.setItem('logincheck',JSON.stringify({
                        code: params.code,
                        wechatOpen: params.state,
                        wechatOpenId: userInfo.wechatOpenId,
                        shop: {
                            id: userInfo.shop.id
                        }
                    }))
                    console.log('get userinfo from http request',userInfo)

                    resolve(userInfo)
                },(response)=>{
                    reject('get userinfo in wechat occured error!!!')
                })                
            }
    	}else{
	        let localSavedUserInfo = localStorage.getItem('user')
	        resolve(localSavedUserInfo ? JSON.parse(localSavedUserInfo) : {})
    	}
    })
}
