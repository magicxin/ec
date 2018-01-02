// import isIos from 'utilities/is-ios'
// import isAndroid from 'utilities/is-android'
import Vue from 'vue'
// import isWechatWebView from 'threeparties/wechat/utilities/is-wechat-web-view'
import calcUriParams from 'utilities/calc-uri-params'
// let isAndroidWebViewUriPrefix=calcUriParams.getUriQuery().isAndroid,
// 	isIosWebViewUriPrefix=calcUriParams.getUriQuery().isIos
let isAndroidWebViewUriPrefix=Vue.prototype.$.isAndroid ,
	isIosWebViewUriPrefix=Vue.prototype.$.isIos

console.log(calcUriParams.getUriQuery())
const renders={
	iosWebView:'iosWebView',
	androidWebView:'androidWebView',
	wechatWebView:'wechatWebView',
	browser:'browser'
}

function isIosWebView(){
	// return isIos()	
	return !!isIosWebViewUriPrefix
}

function isAndroidWebView(){
	// return isAndroid() 
	return !!isAndroidWebViewUriPrefix
}

function maybeBrowser(){
	return !Vue.prototype.$.isWechat && !Vue.prototype.$.isIos && !Vue.prototype.$.isAndroid
}

const render={
	isAndroidWebView:Vue.prototype.$.isAndroid,
	isIosWebView:Vue.prototype.$.isIos,
	isNativeWebView:isAndroidWebView() || isIosWebView(),
	isWechatWebView:Vue.prototype.$.isWechat,
	isAndroid:Vue.prototype.$.isAndroid,
	isIos:Vue.prototype.$.isIos,
	isBrowser:maybeBrowser()
}

console.log(render)
export default{
	renders:renders,
	render:render
}
