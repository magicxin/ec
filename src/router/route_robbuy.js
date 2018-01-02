export default [
  {
		path: '/eve_robBuy/:activityId',
		name: 'eve_robBuy', // N元抢购
//		component: resolve => require(['../pages/events/eve_robBuy'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_robBuy'));}, 'robbuy')},
		meta: {
			keepAlive: false
		}
	}, {
		path: '/eve_robBuyDetails/:id/:activityId', // N元抢购详情
		name: 'eve_robBuyDetails',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_robBuyDetails'));}, 'robbuy')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/eve_userRecord/:activityId', // N元抢购 用户参与记录
		name: 'eve_userRecord',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_userRecord'));}, 'robbuy')},
		meta: {
			keepAlive: true
		}
	}, {
		path: '/eve_toAnnounce/:id/:activityId', // N元抢购 往期结果
		name: 'eve_toAnnounce',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_toAnnounce'));}, 'robbuy')},
	}, {
		path: '/eve_announceDetail/:id/:activityId/:item',
		name: 'eve_announceDetail', // N元抢购 往期结果 详情
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_announceDetail'));}, 'robbuy')},
	}, ]