import androidBridge from 'utilities/jsBridge/android/bridge'
import iosBridge from 'utilities/jsBridge/ios/bridge'
import axios from 'axios'
import query from './getQueryVariable'
//屏蔽alert 测试时可注释掉

window.alert = function(){} 
//start 桥接引用判断
//alert(query('isAndroid'))
var bridge = ''
let config = [{
	user:{userId:'',carId:'',shop:{id:''}},
	env:''
},{
	host:'',
	appname:''
}]

let DEV_CONFIG =  [{
	user:{userId:'1237',carId:'6369',shop:{id:'18'}},
	env:'dev'
	}]

let WEB_CONFIG = [{
	user:{userId:'',carId:'',shop:{id:''}},
	env:'webOrWechat'
	}]


if (process.env.NODE_ENV === 'development') {
	if(query('isAndroid')==='true'){
		alert('开发模式 安卓app')
		bridge = androidBridge
	}
	else if(query('isIos')==='true'){
		alert('开发模式 苹果app')
		bridge = iosBridge
	}
	else if(query('isWxPublic')==='true' || query('loginFrom')){
		alert('开发环境 公众平台')
		bridge = 'wxPublic'
	}
	else if(/micromessenger/i.test(navigator.userAgent)){
		alert('开发环境 微信浏览器')
		bridge = 'wechat'
	}
	else{
		alert('开发环境 其他浏览器')
		bridge = 'dev'
	}
}else{
	if(query('isAndroid')==='true'){
		bridge = androidBridge
	}
	else if(query('isIos')==='true'){
		bridge = iosBridge
	}
	else if(query('isWxPublic')==='true'){
		alert('生产环境 公众平台')
		bridge = 'wxPublic'
	}
	else if(/micromessenger/i.test(navigator.userAgent)){
		bridge = 'wechat'
	}
	else{
		bridge = 'web'
	}
}


export default function(){
	return new Promise(function(resolve,reject){
		if(bridge === 'dev'){//开发模式
				resolve(Object.assign([],config,DEV_CONFIG))
		}else if(bridge === 'wechat' || bridge === 'web'){//build模式网页
				resolve(Object.assign([],config,WEB_CONFIG))
		}else if(bridge === 'wxPublic'){//build模式公众平台
			var code = query('code')
			var state = query('state')
			var url = '/api/code/' + code + '/' + state + '/wxcode.jhtml';
			axios.get(url, {
			    timeout: 60000
			}).then(res=>{
				alert(JSON.stringify(res.data))
					resolve(Object.assign([],config,[{
						user:res.data,
						shopId:res.data.shop.id,
						userId:res.data.userId?res.data.userId:'',
						carId:res.data.carID?res.data.carID:'',
						env:'wxPublic'
						},{
						host:'',
						code: code,
						state: state,
						wechatOpenId: res.data.wechatOpenId
						}]))
			}).catch(err=>{
				alert(err)
			})
		}
		else{//build模式native
			let getUserInfo = function(){
			return new Promise(function(resolve,reject){
				bridge().then(function(bridge){
					bridge.callHandler('data_loginStatus', {}, function(res) {
						var data=res ? JSON.parse(res) : {}
//						alert(res)
						// return Promise.resolve({userId:data.userId,shop:{id:data.shopId}})
						resolve({
							user:{userId:data.userId,carId:data.carID,shop:{id:data.shopId}},
							env:'native'
						})
					})
				},function(err){
						reject(err)
						})
					})
			}
			let getConfig = function(){
				return new Promise(function(resolve,reject){
						bridge().then(function(conn){
						conn.callHandler('data_commonConfig', null, (res) => {
							var data = JSON.parse(res)
							data.host = 'http://' + data.host
							resolve(data)
							})
						})
				})
			}
			Promise.all([getUserInfo(),getConfig()])
			.then(res=>{
				resolve(res)
			})
		}
	})
}
