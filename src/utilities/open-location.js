import calcMethod from 'utilities/calc-method'
import openLocation from 'threeparties/wechat/utilities/open-location'

//import iosOpenLocation from '...'
//import androidOpenLocation from '....'
//import nativeOpenLocation from '...'

export default calcMethod({
    // ios:iosLoginStatus,
    // android:androidLoginStatus,
    wechat:openLocation,
    browser(params,success,fail){
    	fail && fail('在浏览器中访问 未开启定位')
    }
    // ,
    // browser:wechatLoginStatus
})





