import calcMethod from 'utilities/calc-method'
// import wechatScanQrCode from 'threeparties/wechat/utilities/scan-qr-code'
import Vue from 'vue'


export default calcMethod({
    // ios:iosLoginStatus,
    // android:androidLoginStatus,
    // wechat:wechatScanQrCode
    wechat:Vue.prototype.$.isScanQRCode
    // ,
    // browser:wechatLoginStatus
})





