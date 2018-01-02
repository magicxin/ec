export default [
  {
		path: '/eve_helpBargain/:activityId', // 帮砍价
		name: 'eve_helpBargain',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpBargain'));}, 'helpbargain')},
		meta: {
			keepAlive: false
		}
	},  {
		path: '/eve_helpBargainRecord/:activityId', // 帮砍价记录
		name: 'eve_helpBargainRecord',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpBargainRecord'));}, 'helpbargain')},
		meta: {
			auth: true, // 帮砍价记录
			keepAlive: false
		}
	},{
		path: '/eve_helpBargainDetails/:id/:activityId/:userId',
		name: 'eve_helpBargainDetails', // 分享帮砍价页面
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpBargainDetails'));}, 'helpbargain')},
	},{
		path: '/eve_helpDetail/:id/:activityId',
		name: 'eve_helpDetail', // 帮砍价详情
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpDetail'));}, 'helpbargain')},
	}, {
		path: '/eve_helpSuccess/:money', // 助力成功页
		name: 'eve_helpSuccess',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpSuccess'));}, 'helpbargain')},
	}, {
		path: '/eve_helpError/:errorCode', // 助力失败页
		name: 'eve_helpError',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_helpError'));}, 'helpbargain')},
	}, 
//	{
//		path: '/hb_list',
//		component:resolve => {require.ensure([], function(require){resolve(require('../pages/helpBargain/hb_list'));}, 'list')},
//	}, 
]