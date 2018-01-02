import Vue from 'vue'
import Router from 'vue-router'
import route_carFriend from './route_carFriend'
import route_active from './route_active'
import route_appointment from './route_appointment'
import route_basepage from './route_basepage'
import route_card from './route_card'
import route_carmap from './route_carmap'
import route_groupbuy from './route_groupbuy'
//import route_h5project from './route_h5project'
import route_helpbargain from './route_helpbargain'
import route_icar_article from './route_icar_article'
import route_icar_service from './route_icar_service'
import route_luckdraw from './route_luckdraw'
import route_order from './route_order'
import route_recommond from './route_recommond'
import route_redpackage from './route_redpackage'
import route_robbuy from './route_robbuy'
import route_shake from './route_shake'
import route_simcard from './route_simcard'
import route_timespike from './route_timespike'
import route_vbusiness from './route_vbusiness'
import route_vip from './route_vip'
import route_vr from './route_vr'
import route_wechat from './route_wechat'

Vue.use(Router)

let routeCarFriend = route_carFriend
let routeActive = route_active
let routeAppointment = route_carFriend
let routeBasepage = route_basepage
let routeCard = route_card
let routeCarmap = route_carmap
let routeGroupbuy = route_groupbuy
//let routeH5project = route_h5project
let routeHelpbargain = route_helpbargain
let routeIcar_article = route_icar_article
let routeIcar_service = route_icar_service
let routeLuckdraw = route_luckdraw
let routeOrder = route_order
let routeRecommond = route_recommond
let routeRedpackage = route_redpackage
let routeRobbuy = route_robbuy
let routeShake = route_shake
let routeSimcard = route_simcard
let routeTimespike = route_timespike
let routeVbusiness = route_vbusiness
let routeVip = route_vip
let routeVr = route_vr
let routeWechat = route_wechat

// 其他
let otherRoutes = [ 

	//  会员卡和充值都 使用了新的页面  可以考虑删除这两个配置理由和相应文件
	//  {
	//   path: '/p_purse', 
	//   name: 'p_purse',
	//   component: resolve => require(['../pages/purse/p_purse'], resolve)
	// }, {
	//   path: '/charge',
	//   name: 'charge', // 充值
	//   component: resolve => require(['../pages/purse/charge'], resolve)
	// },
	  {
		path: '*',
		redirect: '/orderManage'
	}
]
let routes = [...routeCarFriend, 
			 ...routeActive ,
			 ...routeAppointment ,
			 ...routeBasepage ,
			 ...routeCard ,
			 ...routeCarmap ,
			 ...routeGroupbuy ,
//			 ...routeH5project ,
			 ...routeHelpbargain ,
			 ...routeIcar_article ,
			 ...routeIcar_service ,
			 ...routeLuckdraw ,
			 ...routeOrder ,
			 ...routeRecommond ,
			 ...routeRedpackage ,
			 ...routeRobbuy ,
			 ...routeShake ,
			 ...routeSimcard ,
			 ...routeTimespike ,
			 ...routeVbusiness ,
			 ...routeVip ,
			 ...routeVr ,
			 ...routeWechat ,
			...otherRoutes]

export default new Router({
	routes
})