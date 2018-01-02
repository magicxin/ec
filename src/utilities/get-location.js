import calcMethod from 'utilities/calc-method'
// import getLocation from './get-locations'


export default calcMethod({
    // ios:iosLoginStatus,
    // android:androidLoginStatus,
    // wechat:getLocation,
    browser(params,success,fail){
    	fail && fail('在浏览器中访问 未开启定位')
    }
    // ,
    // browser:wechatLoginStatus
})





