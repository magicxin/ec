import axios from 'axios'
import Vue from 'vue'
import androidBridge from 'utilities/jsBridge/android/bridge'
import iosBridge from 'utilities/jsBridge/ios/bridge'
import Model from 'components/model/model.js'
import router from '../router'
import wx from 'weixin-js-sdk'
import loading from 'assets/loading.gif'
//start 桥接引用判断
var bridge = ''
if (isAndroid()) {
  bridge = androidBridge
} else if (isIos()) {
  bridge = iosBridge
} else {
  bridge = 'web'
}
console.log(isAndroid)
//end 桥接引用判断
export default {
  install(Vue, options) { //创建一个全局组件
    Vue.mixin({
      methods: {
        addPath(url) {
          if (process.env.NODE_ENV === 'development') {
            return 'http://carowl.cn' + url
          } else {
            return Vue.prototype.$.host + url
          }
        },
        setAttr(name,obj){
    				if(this[name]){
    					console.log('%c -----key：'+name+'已存在-------','color:red')
    				}else{
    					this[name] = obj
    				}
        },
        getAttr(name){
        	return this[name]
        },
        editAttr(name,obj){
        	console.log('%c -----key：'+name+'请谨慎修改-------','color:green')
        	this[name] = obj
        },
        getLocal(){
        	return JSON.parse(localStorage.getItem('user'))
        }
      }
    })
    Vue.prototype.$http = axios
    Vue.prototype.setUserInfo = function(obj){
        	this['user'] = obj
        	this['$']['userId'] = obj.userId
        	this['$']['user'] = obj
        	localStorage.setItem('user',JSON.stringify(obj))
        }
     Vue.prototype.getUserInfo = function(){
        	return this['user'] || this['$']['user']
       }
     
     Vue.prototype.$ = {
      //start 属性
      //判断浏览器环境
      isAndroid: isAndroid(),
      isIos: isIos(),
      isWechat: isWechat(),
      getClientType: getClientType(),
      scrollHeight: getScrollHeight(),
      windowHeight: getWindowHeight(),
      scrollTop: getScrollTop(),
      //			host: getHost,
      //end 属性
      //判断主机环境，是否是native
      isNative: isNative(),
      //ajax请求
      get: get,
      post: post,
      postFileByFormData: postFileByFormData,
  
      //一个getter setter 函数，不是受保护的类型 生命周期为浏览器关闭
      getAttr(str) {
        return this[str]
      },
      setAttr(str, obj) {
      	if(this[name]){
    					console.log('%c -----key：'+name+'已存在-------','color:red')
    				}else{
    					this[str] = obj
    				}
      },
      editAttr(name,obj){
        	console.log('%c -----key：'+name+'请谨慎修改-------','color:green')
        	this[name] = obj
        },
      deleteAttr(name){
        	delete this[name]
      },
      //检查数据类型
      isString: checkFactory('String'),
      isObject: checkFactory('Object'),
      isFunction: checkFactory('Function'),
      getDataType: getDataType,
      check2key:check2key,
      //			getUserInfo:getUserInfo,
      isInteger: isInteger,
      isEmpty: isEmpty,
      toInteger:toInteger,
      //桥接方法全局
      go:nativeGo, //跳转
      push: nativePush, //执行操作
      back: nativeBack,
      login: nativeLogin,
      goLogin: maLogin,
      confirm: maConfirm,
      register: register,
      mark: nativeMark,
      getLoginStatus: getLoginStatus,
      //end 桥接方法
      leftpad: leftpad,
      query: getQueryVariable,
      toast: createToast,
      handToblur: handToblur,
      base64ToFile: base64ToFile,
      debounce: debounce,
      registerCar: registerCar,
      isEmojiCharacter: isEmojiCharacter,
      isArrayContains: isArrayContains,
      // 扫一扫
      isScanQRCode: isScanQRCode,
      loading: loadImg,
    }
  }
}
/**
 * 判断是否需要扫一扫 S
 * @param {*} flag 
 */
// 获取签名
let signHref = location.href.split("#")[0];
let signOpenId = 96 || window.location.search.split("=")[2].substring(0, 1);
let signUrlInfo = encodeURIComponent(signHref);
let signData = {
  "clientType": 3,
  "methodName": "QueryJssdkConfig",
  "shopId": "",
  "userId": "",
  "urlInfo": signUrlInfo,
  "wechatOpenId": signOpenId
}


function getSign() {
  get(signData).then(res => {
    res = res.data
    console.log('res: ', res)
    wx.config({
      debug: false,
      appId: 'wx4d1dad55802cb68c',
      timestamp: res.timestamp,
      nonceStr: res.nonceStr,
      signature: res.signature,
      jsApiList: [
        'scanQRCode'
      ]
    })
  })
}

var isScanQRCode = function (flag,cb) {
  flag = flag || '0'
  if (flag !== '0') {
    getSign()
    wx.ready(function () {
      wx.scanQRCode({
        needResult: 1, // 当needResult 为 1 时，扫码返回的结果
        scanType: ["qrCode", "barCode"],
        success: function (res) {
          // alert('11111111')
          // alert(JSON.stringify(res))
          // res = res.resultStr; 
          let str = res.resultStr.split('id=')[1]
          alert('srt: ' + str)
          cb && cb(str)
        }
      })
    })
  } else {
    cb && cb()
  }

}
// 判断是否需要扫一扫 E


//检查数据类型
var checkFactory = function (Type) {
  var identify = '[object ' + Type + ']'

  function isType(value) {
    return Object.prototype.toString.call(value) === identify
  }
  isType.validate = function (value) {
    if (!isType(value)) throw new TypeError('@param value must be a ' + Type)
  }
  return isType
}
//检查是否是整数
function isInteger(value) {
  return Number.isInteger(value)
}
//检查字符串是否为空
function isEmpty(value) {
    	if(value) {
    		if(String(value).trim().length) {
    			return false
    		} else {
    			return true
    		}
    	} else {
    		return true
    	}
}
//桥接返回
function nativeBack() {
  bridge().then(function (bridgeConnection) {
    bridgeConnection.callHandler('router_back')
  })
}
//桥接跳转
function nativePush(name,params,cb) {
return new Promise(function (resolve, reject) {
    bridge().then(conn => {
      conn.callHandler(name, JSON.stringify(params), (response) => {
        cb(response)
       })
    })
})
}

//桥接跳转
function nativeGo(options){
	return new Promise(function(resolve,reject){
		bridge().then(function(bridge){
			bridge.callHandler(options.name, options.query||{}, function(res) {
				resolve(res)
			})
		},function(err){
			// return Promise.reject(err)
			reject(err)
		})
	})
}
//function nativePush(options) {
//return new Promise(function (resolve, reject) {
//  bridge().then(function (bridge) {
//    bridge.callHandler(options.name, options.query || {}, function (res) {
//      resolve(res)
//    })
//  }, function (err) {
//    // return Promise.reject(err)
//    reject(err)
//  })
//})
//}

function nativeLogin() {
  bridge().then(function (bridgeConnection) {
    bridgeConnection.callHandler('router_login')
  })
}
//confirm提示框
function maConfirm(obj,callback) {
  let option = {
    type: obj.type || 'login',
    msg: obj.msg || '登录后可以使用此功能',
    label1: obj.label1 || '取消',
    label2: obj.label2 || '确定',
    name: obj.name || 'login',
    nativeName: obj.nativeName || 'router_login',
    to:obj.to || ''
  }
  var el = document.createElement('div') //hover
  var el1 = document.createElement('div') //top
  var el2 = document.createElement('div') //bottom
  var el3 = document.createElement('div') //cancel
  var el4 = document.createElement('div') //enter
  var el5 = document.createElement('div') //confirm
  var hover = document.body.appendChild(el)
  var confirm = hover.appendChild(el5)
  var elTop = confirm.appendChild(el1)
  var elBttom = confirm.appendChild(el2)
  var elCancel = elBttom.appendChild(el3)
  var elEnter = elBttom.appendChild(el4)

  elTop.innerText = option.msg
  elCancel.innerText = option.label1
  elEnter.innerText = option.label2
  hover.style.position = "fixed"
  elBttom.style.display = "flex"
  elCancel.style.justifyContent = "center"
  elCancel.style.alignItems = "center"
  hover.style.color = "#333"
  hover.style.width = "100vw"
  hover.style.height = "100vh"
  hover.style.display = "flex"
  hover.style.justifyContent = "center"
  hover.style.alignItems = "center"
  hover.style.display = "center"
  hover.style.top = "0"
  hover.style.left = "0"
  hover.style['background-color'] = "rgba(0, 0, 0, 0.4)"
  hover.style.zIndex = "1000"
  confirm.style.color = "#333"
  confirm.style['background-color'] = "#fff"
  confirm.style['border-radius'] = "4px"
  confirm.style.padding = "1em"
  elTop.style.padding = "1em"
  elBttom.style.display = "flex"
  elCancel.style.display = "flex"
  elCancel.style.justifyContent = "center"
  elCancel.style.padding = "1em"
  elCancel.style.flex = "1 1 0"
  elCancel.style.color = "red"
  elEnter.style.display = "flex"
  elEnter.style.justifyContent = "center"
  elEnter.style.padding = "1em"
  elEnter.style.flex = "1 1 0"
  elEnter.style.color = "#f98700"
  elCancel.addEventListener('click', function () {
    hover.style.display = "none"
    document.body.removeChild(hover)
  })
  hover.addEventListener('click', function () {
    document.body.removeChild(hover)
  })
  elEnter.addEventListener('click', function () {
    document.body.removeChild(hover)
    callback()
  })
}
//登陆
function maLogin(obj,callback) {
  let option = {
    type: obj.type || 'login',
    msg: obj.msg || '登录后可以使用此功能',
    label1: obj.label1 || '取消',
    label2: obj.label2 || '确定',
    name: obj.name || 'login',
    nativeName: obj.nativeName || 'router_login',
    to:obj.to || ''
  }
  var el = document.createElement('div') //hover
  var el1 = document.createElement('div') //top
  var el2 = document.createElement('div') //bottom
  var el3 = document.createElement('div') //cancel
  var el4 = document.createElement('div') //enter
  var el5 = document.createElement('div') //confirm
  var hover = document.body.appendChild(el)
  var confirm = hover.appendChild(el5)
  var elTop = confirm.appendChild(el1)
  var elBttom = confirm.appendChild(el2)
  var elCancel = elBttom.appendChild(el3)
  var elEnter = elBttom.appendChild(el4)

  elTop.innerText = option.msg
  elCancel.innerText = option.label1
  elEnter.innerText = option.label2
  hover.style.position = "fixed"
  elBttom.style.display = "flex"
  elCancel.style.justifyContent = "center"
  elCancel.style.alignItems = "center"
  hover.style.color = "#333"
  hover.style.width = "100vw"
  hover.style.height = "100vh"
  hover.style.display = "flex"
  hover.style.justifyContent = "center"
  hover.style.alignItems = "center"
  hover.style.display = "center"
  hover.style.top = "0"
  hover.style.left = "0"
  hover.style['background-color'] = "rgba(0, 0, 0, 0.4)"
  hover.style.zIndex = "100000000" // muse-ui 值为20141227, 弹出框的z-index需要设置较大才能正常展示
  confirm.style.color = "#333"
  confirm.style['background-color'] = "#fff"
  confirm.style['border-radius'] = "4px"
  confirm.style.padding = "1em"
  elTop.style.padding = "1em"
  elBttom.style.display = "flex"
  elCancel.style.display = "flex"
  elCancel.style.justifyContent = "center"
  elCancel.style.padding = "1em"
  elCancel.style.flex = "1 1 0"
  elCancel.style.color = "red"
  elEnter.style.display = "flex"
  elEnter.style.justifyContent = "center"
  elEnter.style.padding = "1em"
  elEnter.style.flex = "1 1 0"
  elEnter.style.color = "#f98700"
  elCancel.addEventListener('click', function () {
    hover.style.display = "none"
    document.body.removeChild(hover)
    callback&&callback()
  })
  elEnter.addEventListener('click', function () {
    document.body.removeChild(hover)
    if (Vue.prototype.$.env === 'webOrWechat' || Vue.prototype.$.env === 'dev' || Vue.prototype.$.env === 'wxPublic') {
      router.push({
        name: option.name,
        params:{to: option.to}
      })
    } else if (Vue.prototype.$.env === 'native') {
      nativeLogin()
    }
  })
}
//function goLogin (to) {
//  Model({
//    title: '提示',
//    modelType: 'prompt'
//  }).then(resp => {
//      nativeRouter.push({
//        name:'login',
//        query: to ? to.query : ''
//      })
//  })
//}
//桥接注册事件
function register(name, obj) {
  var that = obj;
  return new Promise((resolve, reject) => {
    if (!isNative) {
      reject('不在原生环境中')
    }
    bridge().then(bridge => {
      bridge.registerHandler(name, function (data, responseCallback) {
        resolve(data)
        if (JSON.parse(data).msgNo > 0) {
          that.newMessage = true
        }
        if (JSON.parse(data).msgNo == 0) {
          that.newMessage = false
        }
      })
    })
  })
}


// isScan = isScan || '0'
// if (isScan !== '0') {
// 	getSign().then(data =>{
// 		wx.scanQRCode({
// 			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
// 			scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
// 			success:function(res){
// 				cb && cb(res)
// 			}
// 		})
// 	})
// }
//获取登陆状态
function getLoginStatus(isChangeShopId) {

  let promise = new Promise((resolve, reject) => {
    nativeLoginStatus().then(userInfo => {
      if (!!userInfo.userId && !!userInfo.shop.id) {
        if (initChangeShopId(isChangeShopId)) {
          changeShopId(resolve, reject)
        } else {
          resolve(userInfo.shop.id)
        }
      } else {
        reject()
      }
    }, () => {
      reject()
    })
  })
  return promise
}

//签到
function nativeMark() {
  return new Promise(function (resolve, reject) {
    bridge().then(conn => {
      conn.callHandler("data_address", null, (res) => {
        resolve(res)
      })
    }, err => {
      reject(err)
    })
  })
}
//获取userId shopId
//function getUserInfo(){
//	return new Promise(function(resolve,reject){
//		bridge().then(function(bridge){
//			bridge.callHandler('data_loginStatus', {}, function(res) {
//				alert(res)
//				var data=res ? JSON.parse(res) : {}
//				// return Promise.resolve({userId:data.userId,shop:{id:data.shopId}})
//				resolve({userId:data.userId,shop:{id:data.shopId}})
//				})
//			},function(err){
//				// return Promise.reject(err)
//				reject(err)
//				})
//			})
//}
//获取数据类型
function getDataType(obj) { //获取数据类型
  var class2type = {};
  var toString = class2type.toString;

  // Populate the class2type map
  "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
  })
  if (obj == null) {
    return obj + "";
  }
  // console.log(toString.call( obj ))
  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[toString.call(obj)] || "object" :
    typeof obj;
}
//判断是否是ios环境
function isIos() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

function isWechat() {
  if (/micromessenger/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

function isAndroid() {
  if (/Android/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

function getClientType() {
  // /Android/i  /iPhone|iPad|iPod/i /BlackBerry/i /MicroMessenger/i /IEMobile/i /chrome/i /firefox/i /MSIE/i
  if (isWechat()) {
    return '3'
  } else if (isIos()) {
    return '1'
  } else if (isAndroid()) {
    return '0'
  } else {
    return '2'
  }
}
//获取host域名
//function getHost(success){
//		if(isAndroid() || isIos()){
//			bridge().then(function(conn){
//			conn.callHandler('data_commonConfig', null, (res) => {
//				success(JSON.parse(res).host)
//				})
//			})
//		}else{
//			    success({host:''})
//		}
//}
//ajax
function get(params) { //次数从Vue的原型获取有些破坏组件的生命周期，暂时这样获取
  return new Promise(function (resole, reject) {
  	!params.loading&&loadImg(true)
  	delete params.loading
    axios.get(Vue.prototype.$.host + '/rest/json.jhtml?req=' + JSON.stringify(Object.assign({}, {
      clientType: getClientType,
      userId: Vue.prototype.$.userId,
      shopId: Vue.prototype.$.shopId
    }, params)), {
      timeout: 60000
    }).then(res => {
    	loadImg()
      resole(res)
    }).catch(err => {
    	!params.loading&&loadImg()
    	createToast('网络连接错误')
    	throw new Error('net ERROR')
      reject(err)
    })
  })
}
let showLoading = false
//loading
function loadImg(b){
	if (b == true) {
		if (showLoading == true) {
	    return
	  }
		showLoading = true
	  var el = document.createElement('div')
	  var load = document.body.appendChild(el)
	  load.innerHTML = "<div class='img-loading'></div>"
	  load.id = "loadImg"
	  load.style.position = "fixed"
	  load.style.color = "#fff"
	  load.style.lineHeight = "1em"
	  load.style.display = "flex"
	  load.style.top = "50%"
	  load.style.left = "50%"
	  load.style.transform = "translate(-50% , -50%)"
	  load.style['background-color'] = "rgba(0, 0, 0, 0.4)"
	  load.style['border-radius'] = "4px"
	  load.style.padding = "1em"
	  load.style.zIndex = '20000'
//	  
//	  var load_img = document.getElementById('img-loding')
//	  load_img.style.width = '30px'
//	  load_img.style.height = '30px'
//	  load_img.style.borderRadius = '50%'
//	  load_img.style.border = '5px solid #BEBEBE'
//	  load_img.style.animation = 'load 1s linear infinite'
//	  load_img.style.width = '30px'
//	  load_img.style.width = '30px'
//	  load_img.style.width = '30px'
  }else{
  	document.getElementById('loadImg')&&document.body.removeChild(document.getElementById('loadImg'))
  	showLoading = false
  }
 
}

function post(params) {
  //		return axios.get(this.getAttr('host')+'?req=' + JSON.stringify(params), {
  //		    timeout: 60000
  //		})
}
//获取地址栏参数
function getQueryVariable(variable) {
  var query = window.location.search;
  query = query.slice(1);
  console.log("格式化url结果----" + query)
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
//toast
let show = false

function createToast(msg) {
  if (show == true) {
    return
  }
  show == true
  var el = document.createElement('div')
  var toast = document.body.appendChild(el)
  toast.innerHTML = msg
  toast.style.position = "absolute"
  toast.style.color = "#fff"
  toast.style.lineHeight = "1em"
  toast.style.display = "flex"
  toast.style.top = "50%"
  toast.style.left = "50%"
  toast.style.transform = "translate(-50% , -50%)"
  toast.style['background-color'] = "rgba(0, 0, 0, 0.4)"
  toast.style['border-radius'] = "4px"
  toast.style.padding = "1em"
  toast.style.zIndex = '30000000'
  setTimeout(function () {
    toast.style.display = "none"
    show = false
    document.body.removeChild(toast)
  }, 2000)
}
//判断时候来自native环境
function isNative() {
  if (getQueryVariable('isAndroid') === 'true' || getQueryVariable('isIos') === 'true') {
    return true
  } else {
    return false
  }
}
//获取滚动高度
function getScrollHeight() {
  var scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}
//获取屏幕高度
function getWindowHeight() {
  //  var windowHeight = 0;
  //  if (document.compatMode == 'CSS1Compat') {
  //    windowHeight = document.documentElement.clientHeight;
  //  } else {
  //    windowHeight = window.innerHeight;
  //  }
  return window.innerHeight;
}
//获取滚动顶部
function getScrollTop() {
  var scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}
// 所有弹出框失去焦点
function handToblur(el) {
  if (el.length) {
    let arr = Array.from(el)
    arr.forEach(val => {
      val.blur()
    })
  } else {
    el.blur()
  }
}

// 上传图片 base64编码转file
function base64ToFile(baseData) {
  let bytes = window.atob(baseData.split(',')[1])
  // 处理异常
  let ab = new ArrayBuffer(bytes.length)
  let is = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    is[i] = bytes.charCodeAt(i);
  }

  return new Blob([ab], {
    type: 'image/png'
  })
}

// 通过表单的形式提交附件
function postFileByFormData(options) {

  let config = Vue.prototype.$.uploadConfig
  try {
    let xhr = new XMLHttpRequest()
    let formData = new FormData()
    formData.append('token', config.token)
    formData.append('type', 0)
    if (Array.isArray(options.data)) {
      options.data.forEach((val, key) => {
        let file = base64ToFile(val)
        formData.append('uploadFile' + key, file, config.fileName + options.type)
      })
    } else {
      let file = base64ToFile(options.data)
      formData.append('uploadFile0', file, config.fileName + options.type)
    }
    xhr.open('post', config.uploadFile)
    let promise = new Promise((resolve, reject) => {
      xhr.send(formData)
      xhr.onload = function (res) {
        let _res = JSON.parse(res.currentTarget.response)
        resolve(_res)
      }
      xhr.onError = function (err) {
        reject(err)
      }
    })
    return promise
  } catch (e) {
    window.alert(e)
  }
}

//函数去抖
function debounce(fn, vm) {
  let timer = null
  return function () {
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(vm, args)
    }, 400)
  }
}
//车友，后续会去掉
function registerCar(name, obj) {
//var that = obj;
//return new Promise((resolve, reject) => {
//  if (!isNative) {
//    reject('不在原生环境中')
//  }
//  hybridBridge().then(bridge => {
//    bridge.registerHandler(name, function (data, responseCallback) {
//      resolve(data)
//      if (JSON.parse(data).msgNo > 0) {
//        that.newCarfri = true
//      }
//      if (JSON.parse(data).msgNo == 0) {
//        that.newCarfri = false
//      }
//    })
//  })
//})
}

//判断是否是一个emoji表情
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        hs == 0x2b50) {
        return true;
      }
    }
  }
}

function isArrayContains(arr, obj) {
  for (var i = 0; i < arr.length; i++) {
    if (obj === arr[i]) {
      return true;
    }
  }
  return false;
}

//转换成整数 舍去小数
function toInteger(value){
	return ~~value
}

//检测json是否有key重复
function check2key(obj){
//	let arr = []
//	if(getDataType(obj) !== 'object'){
//		console.log('%C ----------请输入json对象----------------','color:red')
//	}else{
//		
//		console.log('%c Uncaught SyntaxError: Duplicate data property in object literal not allowed in strict mode：对象字面量key不能重复:'+key,'color:red')
//		console.log('%c ---------------key值校验成功----------------------','color:green')
//	}
}

function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}
