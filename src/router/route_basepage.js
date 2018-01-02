export default [
  {
		path: '/payResult/:type/:activityId',
		name: 'payResult',
//		component: resolve => require(['../components/payResult'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../components/payResult'));}, 'basepage')},
		meta: {
			keepAlive: true
		}
	},{
		path: '/realName', // 实名认证
		name: 'realName',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/realNameCertification/rc_realNameCertification.vue'));}, 'basepage')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/realNameHas', // 已经实名认证
		name: 'realNameHas',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/realNameCertification/re_realNameHas.vue'));}, 'basepage')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/collection',
		name: 'collection', // 收藏夹
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/collection/c_collection.vue'));}, 'basepage')},
		meta: {
			auth: true,
			keepAlive: false
		}
	},{
		path: '/l_logistics/:shippingSn',
		name: 'l_logistics',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/logistics/l_logistics'));}, 'basepage')},
	},{
		path: '/payment',
		name: 'payment',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/payment/p_payment'));}, 'basepage')},
	},{
		path: '/el_evaluationList',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/evaluation/el_evaluationList'));}, 'basepage')},
	}, {
		path: '/el_selfEvaluation', // 订单评价
		name: 'el_selfEvaluation',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/evaluation/el_selfEvaluation'));}, 'basepage')},
	}, {
		path: '/el_selfEvaluation_view', // 查看评价
		name: 'el_selfEvaluation_view',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/evaluation/el_selfEvaluation_view'));}, 'basepage')},
	},
//	{
//		path: '/Baidumap/:address', // 百度地图
//		name: 'Baidumap',
//		component:resolve => {require.ensure([], function(require){resolve(require('../components/Baidumap'));}, 'basepage')},
//	},
	{
		path: '/qrcode', // 扫码挪车
		name: 'qrcode',
		//		component: resolve => require(['../pages/qrcode/qrcode'], resolve),
		component: resolve => { require.ensure([], function (require) { resolve(require('../pages/qrcode/qrcode')); }, 'h5project') },
	},
	{
		path: '/shop-nearby', // 身边店
		name: 'shop-nearby',
		//		component: resolve => require(['../pages/shopNearby/shoph5project'], resolve),
		component: resolve => { require.ensure([], function (require) { resolve(require('../pages/shopNearby/shoplist')); }, 'h5project') },
	},
]