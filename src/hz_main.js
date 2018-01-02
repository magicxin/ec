import axios from 'axios'
import init from 'tools/init.js'
import app from 'tools/app.js'
import Vue from 'vue'
import App from './app'
import router from './router/hz_index'
import MuseUI from 'muse-ui'
import vueTap from 'v-tap'
import 'muse-ui/dist/muse-ui.css'
import '!vue-style-loader!css-loader!sass-loader!./scss/layout-attributes.scss'
import './css/common.css'
import './css/font.css'
//全局引用swiper
import { Swipe, SwipeItem } from 'vue-swipe';
import 'vue-swipe/dist/vue-swipe.css'
//import VueVideoPlayer from 'vue-video-player'
import layout from 'components/layout'
import flex from 'components/flex'
import Model from 'components/model/model.js'
Vue.config.productionTip = false
Vue.use(app)
Vue.use(MuseUI)
Vue.use(vueTap)
//Vue.use(VueVideoPlayer)
Vue.component('layout', layout)
Vue.component('flex', flex)
//注册全局组件swiper
Vue.component('swipe', Swipe);
Vue.component('swipe-item', SwipeItem);

/*
 * main.js是vue程序的入口。
 * 引入了一个全局组件，公共数据存储以及方法的获取
 * 
 * 判断登录状态
 * 
 * 导航守卫
 * 
 * 
 * */

initProject()
//初始化
function initProject(){
	init()
	.then(res=>{
		alert(JSON.stringify(res))
			Vue.prototype.$.setAttr('env',res[0].env)
			Vue.prototype.setUserInfo(res[0].user)
			Vue.prototype.$.setAttr('initInfo',res[0].user) //只读
			Vue.prototype.$.setAttr('userId',res[0].user.userId)
			Vue.prototype.$.setAttr('carId',res[0].user.carId)
//			alert(res[0].user.carId)
			Vue.prototype.$.setAttr('shopId',res[0].user.shop.id)
			if(res[0].env === 'wxPublic'){
				Vue.prototype.$.setAttr('openid',res[1].wechatOpenId)
				Vue.prototype.$.setAttr('state',res[1].state)
			}
			
			Vue.prototype.$.setAttr('host',res[1].host)
			Vue.prototype.$.setAttr('uploadConfig',{
				url:'http://' + res[1].host + '/rest/json.jhtml',
			    uploadFile:'http://' +  res[1].host + '/rest/commonFileUpload.jhtml',
			    token: '24302887-5345-42ee-b20a-0c8f5175c7a9',
			    baseUrl:'http://' + res[1].host + '/',
			    fileName: 'vfac'
			})
//			localStorage.setItem('user', JSON.stringify({
//				  userId: res[0].userId,
//				  shop: {
//				    id: res[0].shopId
//				  }
//				}))
			Vue.directive('go', {
			    bind (el, binding) {
			      el.addEventListener('click', () => {
			        if (binding.value.indexOf('(') > 0) {
			          let urlParams = binding.value.split('(')
			          let _url = urlParams[0]
			          let _parmas = urlParams[1].split(')')[0]
			          let parmas = eval('(' + _parmas + ')')
			          router.push({name: _url, params: parmas})
			        } else {
			          router.push(binding.value)
			        }
			      })
			    }
			})
			//导航守卫
			router.beforeEach((to, from, next) => {
			    // if auth needed, check login status
			    console.log("%c --------------导航守卫----------------------","color:green")
			    document.title = to.meta.title || ''
			    if(to.meta.native && !from.name){
			    	if(Vue.prototype.$.query('isAndroid')==='true' || Vue.prototype.$.query('isIos')==='true'){
			    		to.params.native = true
			    		Vue.prototype.$.setAttr('router',to.name)
			    		console.log('第一次进入：'+ to.name)
			    	}else{
			    		to.params.native = false
			    	}
			     }else if(to.meta.native && to.name === Vue.prototype.$.getAttr('router')){
			    		to.params.native = true
			    		console.log('第二次进入：'+ to.name)
			    		Vue.prototype.$.deleteAttr('router') 
			    		console.log(Vue.prototype.$.getAttr('router'))
			    }else{
			    	to.params.native = false
			    }
     
			    if(to.meta.auth){//鉴权判断
			//    	localStorage.clear()
				    if(!Vue.prototype.$.userId){
				    	//goLogin
				    	alert('userId为空')
				    	console.log('%c -----------------userId为空--------------------','color:red')
				    	Vue.prototype.$.goLogin({
			              	name:'login',
			              	to:to
			              })
				    }else{
						next()
				    }
			    }else {
			    	next()
			    }
			})
			
		/* eslint-disable no-new */
		new Vue({
		  el: '#app',
		  router,
		  template: '<App/>',
		  components: { App }
		})
	})
}


