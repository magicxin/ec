export default [
  {
		path: '/JS_RECENTACTIVITY', // 活动列表
		name: 'JS_RECENTACTIVITY',
//		component: resolve => require(['../pages/events/eve_list'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_list'));}, 'active')},
		meta: {
			keepAlive: true,
			native: true,
			title: '近期活动'
		}
	}, {
		path: '/active_list/:type', // 活动列表
		name: 'active_list',
//		component: resolve => require(['../pages/events/eve_list'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/active_list'));}, 'active_type')},
		meta: {
			keepAlive: true,
			title: '活动'
		}
	},{
		path: '/eve_listAll/:type/:id', // 所有活动 中转页
		name: 'eve_listAll',
//		component: resolve => require(['../pages/events/eve_listAll'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_listAll'));}, 'active')},
	},{
		path: '/eve_myPrize/:activityId', // 我的奖品
		name: 'eve_myPrize',
//		component: resolve => require(['../pages/events/eve_myPrize'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_myPrize'));}, 'active')},
	}, 
//	{
//		path: '/eve_paySuccess', //  获取支付成功页
//		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_paySuccess'));}, 'list')},
//	}, {
//		path: '/eve_submitOrder',
//		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_submitOrder'));}, 'list')},
//	}, 
]