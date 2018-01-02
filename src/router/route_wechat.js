export default [
  {
		path: '/eve_smart_message', // 智能到店微信消息
		name: 'eve_smart_message',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_smart_message'));}, 'wechat')},
	},{
		path: '/qr_code', // 二维码
		name: 'qr_code',
//		component: resolve => require(['../pages/share/qr_code'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/qr_code'));}, 'wechat')},
	},
// {
//		path: '/register/:id/:activityId/:inviteWay', // 注册旧
//		name: 'register',
//		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/register'));}, 'oldLogin')},
//	},{
//		path: '/register_success', // 注册成功
//		name: 'register_success',
//		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/register_success'));}, 'oldLogin')},
//	},
	{
		path: '/signup', // 注册
		name: 'signup',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/signup'));}, 'wechat')},
		meta: {
			title: '注册'
		}
	}, {
		path: '/setPassword', // 注册设置密码
		name: 'setPassword',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/setPassword'));}, 'wechat')},
		meta: {
			title: '注册'
		}
	}, {
		path: '/login', // 登录
		name: 'login',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/share/login'));}, 'wechat')},
		meta: {
			title: '会员中心'
		}
	}, 
]